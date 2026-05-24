const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");

router.get("/", messageController.list);
router.post("/", messageController.create);
router.patch("/:messageId", messageController.update);
router.delete("/:messageId", messageController.deleteOne);
router.delete("/", messageController.deleteAll);

module.exports = router;