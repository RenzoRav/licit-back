const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Gerenciamento de conversas do usuário
 */

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Lista todas as conversas do usuário logado
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de conversas retornada com sucesso
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
 *                     example: 550e8400-e29b-41d4-a716-446655440000
 *                   title:
 *                     type: string
 *                     example: Nova conversa
 *                   context_id:
 *                     type: string
 *                     nullable: true
 *                     example: 660e8400-e29b-41d4-a716-446655440001
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-15T10:30:00Z
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-15T14:20:00Z
 *                   contexts:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Edital 45/2024
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Token não fornecido.
 */
router.get("/", conversationController.list);

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Busca uma conversa específica com todas as mensagens
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Conversa encontrada com mensagens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 context_id:
 *                   type: string
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 contexts:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     content:
 *                       type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       conversation_id:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user, assistant]
 *                       content:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Conversa não encontrada
 */
router.get("/:id", conversationController.getById);

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Cria uma nova conversa
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da conversa (opcional, padrão é Nova conversa)
 *                 example: Dúvida sobre Edital 45/2024
 *               context_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID do contexto a vincular (opcional)
 *                 example: 660e8400-e29b-41d4-a716-446655440001
 *     responses:
 *       201:
 *         description: Conversa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 context_id:
 *                   type: string
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Não autorizado
 */
router.post("/", conversationController.create);

/**
 * @swagger
 * /conversations/{id}:
 *   patch:
 *     summary: Atualiza título ou contexto de uma conversa
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Novo título
 *                 example: Edital atualizado
 *               context_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: Novo contexto (null para remover)
 *     responses:
 *       200:
 *         description: Conversa atualizada
 *       400:
 *         description: Nada para atualizar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nada para atualizar.
 *       404:
 *         description: Conversa não encontrada
 */
router.patch("/:id", conversationController.update);

/**
 * @swagger
 * /conversations/{id}:
 *   delete:
 *     summary: Remove uma conversa e todas as mensagens
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da conversa a ser removida
 *     responses:
 *       200:
 *         description: Conversa removida
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
router.delete("/:id", conversationController.remove);

module.exports = router;