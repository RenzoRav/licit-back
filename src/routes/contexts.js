const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const contextController = require("../controllers/contextController");

router.get("/", contextController.list);
router.get("/:id", contextController.getById);
router.post("/", contextController.create);
router.post("/upload", upload.single("file"), contextController.upload);
router.patch("/:id", contextController.update);
router.delete("/:id", contextController.remove);

module.exports = router;