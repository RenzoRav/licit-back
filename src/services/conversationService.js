const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

class ConversationService {
  async list(userId) {
    if (!userId) throw Object.assign(new Error("userId obrigatorio"), { status: 400 });
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, context_id, created_at, updated_at, contexts(name)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw Object.assign(new Error("Erro ao buscar conversas"), { status: 500, details: error });
    return data || [];
  }

  async getById(id, userId) {
    if (!userId) throw Object.assign(new Error("userId obrigatorio"), { status: 400 });
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*, contexts(id, name, content)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (convErr) throw Object.assign(new Error("Erro ao buscar conversa"), { status: 500, details: convErr });
    if (!conv) throw Object.assign(new Error("Conversa nao encontrada"), { status: 404 });
    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });
    if (msgErr) throw Object.assign(new Error("Erro ao buscar mensagens"), { status: 500, details: msgErr });
    return { ...conv, messages: messages || [] };
  }

  async create({ title, contextId, userId }) {
    if (!userId) throw Object.assign(new Error("userId obrigatorio"), { status: 400 });
    const { data, error } = await supabase
      .from("conversations")
      .insert({ id: uuidv4(), user_id: userId, title: (title || "Nova conversa").trim(), context_id: contextId || null })
      .select()
      .single();
    if (error) throw Object.assign(new Error("Erro ao criar conversa"), { status: 500, details: error });
    return data;
  }

  async update(id, userId, { title, contextId }) {
    if (!userId) throw Object.assign(new Error("userId obrigatorio"), { status: 400 });
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (contextId !== undefined) updates.context_id = contextId;
    updates.updated_at = new Date().toISOString();
    if (Object.keys(updates).length === 1 && updates.updated_at) {
      throw Object.assign(new Error("Nada para atualizar"), { status: 400 });
    }
    const { data, error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw Object.assign(new Error("Erro ao atualizar conversa"), { status: 500, details: error });
    if (!data) throw Object.assign(new Error("Conversa nao encontrada"), { status: 404 });
    return data;
  }

  async delete(id, userId) {
    if (!userId) throw Object.assign(new Error("userId obrigatorio"), { status: 400 });
    const { error } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", userId);
    if (error) throw Object.assign(new Error("Erro ao excluir conversa"), { status: 500, details: error });
    return { deleted: true };
  }
}

module.exports = new ConversationService();
