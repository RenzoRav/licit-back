const contextService = require("../services/contextService");

exports.list = async (_req, res, next) => {
  try {
    const data = await contextService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await contextService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: "name e content são obrigatórios." });
    }
    const data = await contextService.create({ name, content });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }
    const data = await contextService.createFromUpload(req.file, req.body.name);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await contextService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await contextService.delete(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
