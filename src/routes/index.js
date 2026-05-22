const express = require("express");
const router = express.Router();

const contextsRouter = require("./contexts");
const conversationsRouter = require("./conversations");
const messagesRouter = require("./messages");
const qaRouter = require("./qa");
const { verifyToken } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Verificação de status da API
 *   - name: Contexts
 *     description: Gerenciamento de contextos (arquivos .txt)
 *   - name: Conversations
 *     description: Gerenciamento de conversas
 *   - name: Messages
 *     description: Gerenciamento de mensagens dentro das conversas
 *   - name: QA
 *     description: Perguntas e respostas com IA
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica se a API está online
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get("/health", (_req, res) => res.json({ status: "ok" }));

// rotas protegidas, requer token JWT
router.use("/contexts", verifyToken, contextsRouter);
router.use("/conversations", verifyToken, conversationsRouter);
router.use("/conversations", verifyToken, messagesRouter);
router.use("/qa", verifyToken, qaRouter);

/**
 * @swagger
 * /{path}:
 *   all:
 *     summary: Rota não encontrada
 *     responses:
 *       404:
 *         description: Endpoint não existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rota não encontrada
 */
router.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

module.exports = router;