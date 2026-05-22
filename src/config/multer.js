const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const isTxt = file.mimetype === "text/plain" || file.originalname.endsWith(".txt");
  cb(isTxt ? null : new Error("Apenas arquivos .txt são aceitos."), isTxt);
};

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
