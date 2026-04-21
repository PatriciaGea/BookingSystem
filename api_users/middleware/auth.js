const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const jwt = require("jsonwebtoken")

// Middleware to validate JWT and protect routes.
const authMiddleware = (req, res, next) => {
  try {
    // Read token from Authorization header: "Bearer TOKEN".
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ message: "Token not provided" })
    }

    const token = authHeader.split(" ")[1]
    
    if (!token) {
      return res.status(401).json({ message: "Invalid token" })
    }

    // Validate token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_default")
    
    // Attach userId from decoded token.
    req.userId = decoded.userId
    
    next()
  } catch (error) {
    console.error("Authentication error:", error)
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

module.exports = authMiddleware
