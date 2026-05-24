const express = require("express");
const router = express.Router();
const contextsRouter = require("./contexts");
const conversationsRouter = require("./conversations");
const messagesRouter = require("./messages");
const qaRouter = require("./qa");
const { verifyToken } = require("../middlewares/auth");

router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/contexts", verifyToken, contextsRouter);
router.use("/conversations", verifyToken, conversationsRouter);
router.use("/conversations/:conversationId/messages", verifyToken, messagesRouter); // ← corrigido
router.use("/qa", verifyToken, qaRouter);

router.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

module.exports = router;