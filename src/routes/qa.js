const express = require("express");
const router = express.Router();
const qaController = require("../controllers/qaController");

router.post("/ask", qaController.ask);
router.post("/resend", qaController.resend);
router.post("/simple", qaController.simple);

module.exports = router;