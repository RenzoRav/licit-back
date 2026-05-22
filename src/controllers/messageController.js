const messageService = require("../services/messageService");

exports.list = async (req, res, next) => {
  try {
    const data = await messageService.list(req.params.conversationId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { role, content } = req.body;
    if (!["user", "assistant"].includes(role)) {
      return res.status(400).json({ error: "role deve ser 'user' ou 'assistant'." });
    }
    if (!content?.trim()) {
      return res.status(400).json({ error: "content não pode ser vazio." });
    }
    const data = await messageService.create(req.params.conversationId, { role, content });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: "content não pode ser vazio." });
    }
    const data = await messageService.update(
      req.params.conversationId,
      req.params.messageId,
      content
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const result = await messageService.deleteOne(
      req.params.conversationId,
      req.params.messageId
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const result = await messageService.deleteAll(req.params.conversationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
