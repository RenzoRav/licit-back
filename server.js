require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[Express] Servidor rodando em http://localhost:${PORT}`);
  console.log(`[Express] Doc da API rodando em http://localhost:${PORT}/api/docs/`);
});