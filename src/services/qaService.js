const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8100";

class QaService {
  async getConversationWithContext(conversationId, contextId) {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*, contexts(id, name, content)")
      .eq("id", conversationId)
      .single();
    if (convErr || !conv) {
      throw Object.assign(new Error("Conversa nao encontrada."), { status: 404 });
    }

    let contextContent = conv.contexts?.content || null;

    if (contextId && contextId !== conv.context_id) {
      const { data: ctx } = await supabase
        .from("contexts")
        .select("content")
        .eq("id", contextId)
        .single();
      if (ctx) {
        contextContent = ctx.content;
        await supabase
          .from("conversations")
          .update({ context_id: contextId, updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
    }

    return { conversation: conv, contextContent };
  }

  async saveUserMessage(conversationId, content) {
    const id = uuidv4();
    const { error } = await supabase.from("messages").insert({
      id,
      conversation_id: conversationId,
      role: "user",
      content: content.trim(),
    });
    if (error) throw error;
    return id;
  }

  async callPythonApi(question, contextContent, timeoutMs = 900_000) {
    const fetch = (await import("node-fetch")).default;
    const startTime = Date.now();
    console.log(`[QA] Iniciando requisicao para Python API...`);

    const body = contextContent
      ? { text: question.trim(), context: contextContent }
      : { text: question.trim(), context: "" };

    const pyRes = await fetch(`${PYTHON_API_URL}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[QA] Resposta recebida em ${elapsed}s`);

    if (!pyRes.ok) {
      const errBody = await pyRes.text();
      throw new Error(`Python API retornou ${pyRes.status}: ${errBody}`);
    }

    return pyRes.json();
  }

  async saveErrorMessage(conversationId, error) {
    let message = error.message;
    if (error.type === "aborted" || error.message?.includes("aborted")) {
      message =
        "Tempo limite excedido (15 min). O modelo esta muito lento. Tente com um contexto menor.";
    }
    console.error(`[QA] Erro ao chamar Python API:`, error);
    await supabase.from("messages").insert({
      id: uuidv4(),
      conversation_id: conversationId,
      role: "assistant",
      content: `[ERRO ao contatar o modelo: ${message}]`,
      is_error: true,
    });
    throw Object.assign(new Error(message), { status: 504 });
  }

  async saveAssistantMessage(conversationId, answer) {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        id: uuidv4(),
        conversation_id: conversationId,
        role: "assistant",
        content: answer,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async bumpConversationUpdatedAt(conversationId) {
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  async ask({ question, conversationId, contextId }) {
    if (!question?.trim()) {
      throw Object.assign(new Error("question nao pode ser vazio."), { status: 400 });
    }
    if (!conversationId) {
      throw Object.assign(new Error("conversation_id e obrigatorio."), { status: 400 });
    }

    const { contextContent } = await this.getConversationWithContext(conversationId, contextId);
    const userMsgId = await this.saveUserMessage(conversationId, question);

    let pythonResponse;
    try {
      pythonResponse = await this.callPythonApi(question, contextContent);
    } catch (err) {
      await this.saveErrorMessage(conversationId, err);
      throw err;
    }

    const answer = pythonResponse.answer || pythonResponse.text || "";
    const assistantMsg = await this.saveAssistantMessage(conversationId, answer);
    await this.bumpConversationUpdatedAt(conversationId);

    return { user_message_id: userMsgId, assistant_message: assistantMsg };
  }

  async resend({ messageId, newQuestion, conversationId }) {
    if (!messageId || !newQuestion?.trim() || !conversationId) {
      throw Object.assign(
        new Error("message_id, new_question e conversation_id sao obrigatorios."),
        { status: 400 }
      );
    }

    await supabase
      .from("messages")
      .update({ content: newQuestion.trim(), edited: true })
      .eq("id", messageId);

    const { data: originalMsg } = await supabase
      .from("messages")
      .select("created_at")
      .eq("id", messageId)
      .single();

    if (originalMsg) {
      await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("role", "assistant")
        .gte("created_at", originalMsg.created_at);
    }

    return this.ask({
      question: newQuestion,
      conversationId,
      contextId: null,
    });
  }

  async simpleAsk({ question, context }) {
    if (!question?.trim()) {
      throw Object.assign(new Error("question nao pode ser vazio."), { status: 400 });
    }

    const fetch = (await import("node-fetch")).default;
    const pyRes = await fetch(`${PYTHON_API_URL}/qa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: question.trim(), context: context || "" }),
      signal: AbortSignal.timeout(300_000),
    });

    if (!pyRes.ok) {
      const errBody = await pyRes.text();
      throw new Error(`Python API retornou ${pyRes.status}: ${errBody}`);
    }

    const pythonResponse = await pyRes.json();
    return { answer: pythonResponse.answer || pythonResponse.text || "" };
  }
}

module.exports = new QaService();
