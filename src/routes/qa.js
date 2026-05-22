const express = require("express");
const router = express.Router();
const qaController = require("../controllers/qaController");

/**
 * @swagger
 * tags:
 *   name: QA
 *   description: Perguntas e respostas com IA sobre licitações
 */

/**
 * @swagger
 * /qa/ask:
 *   post:
 *     summary: Envia uma pergunta para a IA e retorna a resposta
 *     tags: [QA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - conversation_id
 *             properties:
 *               question:
 *                 type: string
 *                 description: Pergunta do usuário sobre o contexto
 *                 example: "Qual o prazo de entrega do edital 45/2024?"
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da conversa onde a mensagem será salva
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               context_id:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID do contexto a usar (opcional, usa o da conversa se omitido)
 *                 example: "660e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Resposta da IA gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_message_id:
 *                   type: string
 *                   format: uuid
 *                   description: ID da mensagem do usuário salva
 *                   example: "880e8400-e29b-41d4-a716-446655440004"
 *                 assistant_message:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     conversation_id:
 *                       type: string
 *                       format: uuid
 *                     role:
 *                       type: string
 *                       example: "assistant"
 *                     content:
 *                       type: string
 *                       description: Resposta da IA
 *                       example: "O prazo de entrega do edital 45/2024 é de 30 dias úteis a partir da assinatura do contrato."
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "question não pode ser vazio."
 *       404:
 *         description: Conversa não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Conversa não encontrada."
 *       422:
 *         description: Sem contexto vinculado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nenhum contexto vinculado a esta conversa. Selecione um arquivo de contexto antes de perguntar."
 *       504:
 *         description: Timeout na API Python
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Tempo limite excedido (15 min). O modelo está muito lento. Tente com um contexto menor."
 */
router.post("/ask", qaController.ask);

/**
 * @swagger
 * /qa/resend:
 *   post:
 *     summary: Reenvia uma pergunta editada e remove respostas posteriores
 *     tags: [QA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message_id
 *               - new_question
 *               - conversation_id
 *             properties:
 *               message_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da mensagem original a ser editada
 *                 example: "880e8400-e29b-41d4-a716-446655440004"
 *               new_question:
 *                 type: string
 *                 description: Nova versão da pergunta
 *                 example: "Qual o prazo de entrega e pagamento do edital 45/2024?"
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID da conversa
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Nova resposta gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_message_id:
 *                   type: string
 *                   format: uuid
 *                 assistant_message:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     role:
 *                       type: string
 *                     content:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "message_id, new_question e conversation_id são obrigatórios."
 */
router.post("/resend", qaController.resend);

/**
 * @swagger
 * /qa/simple:
 *   post:
 *     summary: Pergunta simples sem salvar no banco (sem autenticação)
 *     tags: [QA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Pergunta para a IA
 *                 example: "O que é uma licitação?"
 *               context:
 *                 type: string
 *                 description: Contexto opcional para a resposta
 *                 example: "Processo de contratação pública no Brasil"
 *     responses:
 *       200:
 *         description: Resposta da IA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   description: Resposta gerada pelo modelo
 *                   example: "Licitação é o processo administrativo pelo qual a Administração Pública seleciona a proposta mais vantajosa para a contratação de obra, serviço, compra ou alienação."
 *       400:
 *         description: Pergunta vazia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "question não pode ser vazio."
 */
router.post("/simple", qaController.simple);

module.exports = router;