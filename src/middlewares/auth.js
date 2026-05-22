const admin = require("../config/firebase");

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || null,
    };

    next();
  } catch (err) {
    console.error("[Auth] Token inválido:", err.message);
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
