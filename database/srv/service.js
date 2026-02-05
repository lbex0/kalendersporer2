const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

module.exports = (srv) => {

  // JWT guard (replaces server.js middleware)
  srv.before("*", (req) => {
    if (req.event === "validateLogin" || req.event === "refreshToken") return;
    
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) req.reject(401, "Authorization header missing");

    try {
      const token = auth.split(" ")[1];
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.reject(403, "Invalid token");
    }
  });

  srv.on("validateLogin", async (req) => {
    const { username, password } = req.data;

    const loginInfo = await cds.run(
      SELECT.one.from("kalendersporer.LoginInfo").where({ username })
    );

    if (!loginInfo) req.reject(401, "Invalid username or password");

    const ok = await bcrypt.compare(password, loginInfo.password_hash);
    if (!ok) req.reject(401, "Invalid username or password");

    return {
      accessToken: jwt.sign({ username }, JWT_SECRET, { expiresIn: "15m" }),
      refreshToken: jwt.sign({ username }, REFRESH_SECRET, { expiresIn: "7d" })
    };
  });

  srv.on("refreshToken", (req) => {
    try {
      const payload = jwt.verify(req.data.refreshToken, REFRESH_SECRET);
      return {
        accessToken: jwt.sign({ username: payload.username }, JWT_SECRET, { expiresIn: "15m" })
      };
    } catch {
      req.reject(403, "Invalid or expired refresh token");
    }
  });
};
