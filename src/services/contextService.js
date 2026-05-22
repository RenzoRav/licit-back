const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

class ContextService {
  async list() {
    const { data, error } = await supabase
      .from("contexts")
      .select("id, name, created_at, char_count")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }

  async getById(id) {
    const { data, error } = await supabase
      .from("contexts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data) throw Object.assign(new Error("Contexto não encontrado"), { status: 404 });
    return data;
  }

  async create({ name, content }) {
    const { data, error } = await supabase
      .from("contexts")
      .insert({ id: uuidv4(), name: name.trim(), content })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async createFromUpload(file, bodyName) {
    const content = file.buffer.toString("utf-8");
    const name =
      bodyName ||
      file.originalname.replace(/\.txt$/i, "").trim() ||
      `Contexto ${new Date().toLocaleDateString("pt-BR")}`;
    return this.create({ name, content });
  }

  async update(id, { name, content }) {
    const updates = {};
    if (name) updates.name = name.trim();
    if (content !== undefined) updates.content = content;
    if (Object.keys(updates).length === 0) {
      throw Object.assign(new Error("Nada para atualizar."), { status: 400 });
    }
    const { data, error } = await supabase
      .from("contexts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase.from("contexts").delete().eq("id", id);
    if (error) throw error;
    return { deleted: true };
  }
}

module.exports = new ContextService();
