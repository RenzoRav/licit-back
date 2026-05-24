const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

class MessageService {
  async list(conversationId) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async create(conversationId, { role, content }) {
    await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", conversationId);
    const { data, error } = await supabase
      .from("messages")
      .insert({ id: uuidv4(), conversation_id: conversationId, role, content: content.trim() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(conversationId, messageId, content) {
    const { data, error } = await supabase
      .from("messages")
      .update({ content: content.trim(), edited: true })
      .eq("id", messageId)
      .eq("conversation_id", conversationId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteOne(conversationId, messageId) {
    const { error } = await supabase.from("messages").delete().eq("id", messageId).eq("conversation_id", conversationId);
    if (error) throw error;
    return { deleted: true };
  }

  async deleteAll(conversationId) {
    const { error } = await supabase.from("messages").delete().eq("conversation_id", conversationId);
    if (error) throw error;
    return { deleted: true };
  }
}

module.exports = new MessageService();
