const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { swaggerUi, specs } = require("./config/swagger");

const app = express();

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const qaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde 5 minutos." },
});
app.use("/api/qa", qaLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", routes);

const FRONTEND_PATH = path.join(__dirname, "../../front/dist");

if (require("fs").existsSync(FRONTEND_PATH)) {
  app.use(express.static(FRONTEND_PATH));

  app.get("*", (_req, res) =>
    res.sendFile(path.join(FRONTEND_PATH, "index.html"))
  );
}

app.use(errorHandler);

module.exports = app;