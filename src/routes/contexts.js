const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const contextController = require("../controllers/contextController");

/**
 * @swagger
 * tags:
 *   name: Contexts
 *   description: Gerenciamento de contextos (arquivos .txt para o modelo de IA)
 */

/**
 * @swagger
 * /contexts:
 *   get:
 *     summary: Lista todos os contextos do usuário
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contextos retornada com sucesso
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
 *                     example: "660e8400-e29b-41d4-a716-446655440001"
 *                   name:
 *                     type: string
 *                     example: "Edital 45/2024"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-15T10:30:00Z"
 *                   char_count:
 *                     type: integer
 *                     example: 15420
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token não fornecido."
 */
router.get("/", contextController.list);

/**
 * @swagger
 * /contexts/{id}:
 *   get:
 *     summary: Busca um contexto específico pelo ID
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do contexto
 *         example: "660e8400-e29b-41d4-a716-446655440001"
 *     responses:
 *       200:
 *         description: Contexto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 content:
 *                   type: string
 *                   description: Texto completo do arquivo .txt
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Contexto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contexto não encontrado"
 */
router.get("/:id", contextController.getById);

/**
 * @swagger
 * /contexts:
 *   post:
 *     summary: Cria um novo contexto manualmente
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - content
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do contexto
 *                 example: "Edital Concorrência 01/2024"
 *               content:
 *                 type: string
 *                 description: Texto completo do contexto
 *                 example: "O presente edital tem por objeto a contratação de empresa especializada..."
 *     responses:
 *       201:
 *         description: Contexto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
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
 *                   example: "name e content são obrigatórios."
 */
router.post("/", contextController.create);

/**
 * @swagger
 * /contexts/upload:
 *   post:
 *     summary: Faz upload de um arquivo .txt como contexto
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo .txt (máximo 5MB)
 *               name:
 *                 type: string
 *                 description: Nome customizado do contexto (opcional, usa nome do arquivo se omitido)
 *                 example: "Meu Contexto"
 *     responses:
 *       201:
 *         description: Contexto criado a partir do upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 content:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Nenhum arquivo enviado ou formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nenhum arquivo enviado."
 */
router.post("/upload", upload.single("file"), contextController.upload);

/**
 * @swagger
 * /contexts/{id}:
 *   patch:
 *     summary: Atualiza nome ou conteúdo de um contexto
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do contexto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do contexto
 *                 example: "Edital Atualizado"
 *               content:
 *                 type: string
 *                 description: Novo conteúdo do contexto
 *                 example: "Novo texto do edital..."
 *     responses:
 *       200:
 *         description: Contexto atualizado com sucesso
 *       400:
 *         description: Nada para atualizar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nada para atualizar."
 *       404:
 *         description: Contexto não encontrado
 */
router.patch("/:id", contextController.update);

/**
 * @swagger
 * /contexts/{id}:
 *   delete:
 *     summary: Remove um contexto permanentemente
 *     tags: [Contexts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do contexto a ser removido
 *     responses:
 *       200:
 *         description: Contexto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Contexto não encontrado
 */
router.delete("/:id", contextController.remove);

module.exports = router;