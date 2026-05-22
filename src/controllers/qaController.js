const qaService = require("../services/qaService");

exports.ask = async (req, res, next) => {
  try {
    const result = await qaService.ask({
      question: req.body.question,
      conversationId: req.body.conversation_id,
      contextId: req.body.context_id,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.resend = async (req, res, next) => {
  try {
    const result = await qaService.resend({
      messageId: req.body.message_id,
      newQuestion: req.body.new_question,
      conversationId: req.body.conversation_id,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.simple = async (req, res, next) => {
  try {
    const result = await qaService.simpleAsk({
      question: req.body.question,
      context: req.body.context,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
