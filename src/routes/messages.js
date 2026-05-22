const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Gerenciamento de mensagens dentro das conversas
 */

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   get:
 *     summary: Lista todas as mensagens de uma conversa
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Lista de mensagens retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: "770e8400-e29b-41d4-a716-446655440003"
 *                   conversation_id:
 *                     type: string
 *                     format: uuid
 *                     example: "550e8400-e29b-41d4-a716-446655440000"
 *                   role:
 *                     type: string
 *                     enum: [user, assistant]
 *                     example: "user"
 *                   content:
 *                     type: string
 *                     example: "Qual o prazo de entrega do edital?"
 *                   edited:
 *                     type: boolean
 *                     example: false
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-15T10:30:00Z"
 *       401:
 *         description: Token não fornecido ou inválido
 *       404:
 *         description: Conversa não encontrada
 */
router.get("/", messageController.list);

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   post:
 *     summary: Envia uma nova mensagem na conversa
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - content
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *                 description: Quem enviou a mensagem
 *                 example: "user"
 *               content:
 *                 type: string
 *                 description: Conteúdo da mensagem
 *                 example: "Qual o valor estimado do contrato?"
 *     responses:
 *       201:
 *         description: Mensagem criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 conversation_id:
 *                   type: string
 *                 role:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "role deve ser 'user' ou 'assistant'."
 */
router.post("/", messageController.create);

/**
 * @swagger
 * /conversations/{conversationId}/messages/{messageId}:
 *   patch:
 *     summary: Edita uma mensagem existente
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da mensagem a ser editada
 *         example: "770e8400-e29b-41d4-a716-446655440003"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Novo conteúdo da mensagem
 *                 example: "Qual o prazo de entrega atualizado?"
 *     responses:
 *       200:
 *         description: Mensagem editada com sucesso
 *       400:
 *         description: Conteúdo vazio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "content não pode ser vazio."
 *       404:
 *         description: Mensagem não encontrada
 */
router.patch("/:messageId", messageController.update);

/**
 * @swagger
 * /conversations/{conversationId}/messages/{messageId}:
 *   delete:
 *     summary: Remove uma mensagem específica
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da mensagem a ser removida
 *         example: "770e8400-e29b-41d4-a716-446655440003"
 *     responses:
 *       200:
 *         description: Mensagem removida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete("/:messageId", messageController.deleteOne);

/**
 * @swagger
 * /conversations/{conversationId}/messages:
 *   delete:
 *     summary: Remove TODAS as mensagens de uma conversa
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Todas as mensagens removidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Conversa não encontrada
 */
router.delete("/", messageController.deleteAll);

module.exports = router;