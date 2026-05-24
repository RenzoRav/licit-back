const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);


app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
    ...(err.details && { details: err.details }),
  });
});

app.listen(PORT, () => {
  console.log(`[Express] Servidor rodando em http://localhost:${PORT}`);
  console.log(`[Express] Doc da API rodando em http://localhost:${PORT}/api/docs/`);
});
