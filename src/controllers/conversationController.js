const conversationService = require("../services/conversationService");

exports.list = async (req, res, next) => {
  try {
    const data = await conversationService.list(req.user.uid);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await conversationService.getById(req.params.id, req.user.uid);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await conversationService.create({
      title: req.body.title,
      contextId: req.body.context_id,
      userId: req.user.uid,
    });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await conversationService.update(req.params.id, req.user.uid, {
      title: req.body.title,
      contextId: req.body.context_id,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await conversationService.delete(req.params.id, req.user.uid);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
