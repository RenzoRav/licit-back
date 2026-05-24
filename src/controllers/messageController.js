const messageService = require("../services/messageService");
const contextService = require("../services/contextService");
const supabase = require("../config/supabase");
const axios = require("axios");

const QA_API_URL = process.env.QA_API_URL || "http://localhost:8100/qa";

exports.list = async (req, res, next) => {
  try {
    const data = await messageService.list(req.params.conversationId);
    res.json(data);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { question, context_id } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: "question não pode ser vazio." });
    }

    const conversationId = req.params.conversationId;

    const userMessage = await messageService.create(conversationId, { role: "user", content: question });

    // Resolve context_id — se não veio no body, busca pela conversa no banco
    let resolvedContextId = context_id || null;
    if (!resolvedContextId) {
      try {
        const { data: conv } = await supabase
          .from("conversations")
          .select("context_id")
          .eq("id", conversationId)
          .single();
        resolvedContextId = conv?.context_id || null;
        console.log("[QA] context_id resolvido pela conversa:", resolvedContextId);
      } catch (convErr) {
        console.warn("[QA] Não foi possível buscar conversa:", convErr.message);
      }
    }

    let contextText = "";
    if (resolvedContextId) {
      try {
        const context = await contextService.getById(resolvedContextId);
        contextText = context?.content || "";
      } catch (ctxErr) {
        console.warn("[QA] Contexto não encontrado:", resolvedContextId);
      }
    }

    console.log("[QA] context_id recebido:", context_id);
    console.log("[QA] context_id resolvido:", resolvedContextId);
    console.log("[QA] context preview:", contextText.substring(0, 200));
    console.log("[QA] question:", question);

    let answerText = "Não foi possível obter resposta do modelo.";
    try {
      const { data } = await axios.post(QA_API_URL, { text: question, context: contextText });
      answerText = data.answer;
    } catch (qaErr) {
      console.error("[QA] Erro ao chamar modelo:", qaErr.message);
    }

    const assistantMessage = await messageService.create(conversationId, { role: "assistant", content: answerText });

    res.status(201).json({ user_message: userMessage, assistant_message: assistantMessage });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: "content não pode ser vazio." });
    const data = await messageService.update(req.params.conversationId, req.params.messageId, content);
    res.json(data);
  } catch (err) { next(err); }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const result = await messageService.deleteOne(req.params.conversationId, req.params.messageId);
    res.json(result);
  } catch (err) { next(err); }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await messageService.deleteAll(req.params.conversationId);
    res.json(result);
  } catch (err) { next(err); }
};