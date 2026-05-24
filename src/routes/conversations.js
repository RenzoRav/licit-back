const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

router.get("/", conversationController.list);
router.get("/:id", conversationController.getById);
router.post("/", conversationController.create);
router.patch("/:id", conversationController.update);
router.delete("/:id", conversationController.remove);

module.exports = router;
