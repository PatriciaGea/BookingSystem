const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const jwt = require("jsonwebtoken")

// Middleware para validar JWT e proteger rotas
const authMiddleware = (req, res, next) => {
  try {
    // Pega o token do header Authorization: "Bearer TOKEN"
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ message: "Token não fornecido" })
    }

    const token = authHeader.split(" ")[1] // Remove "Bearer" e pega o token
    
    if (!token) {
      return res.status(401).json({ message: "Token inválido" })
    }

    // Valida o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_default")
    
    // Adiciona o userId do token decodificado ao request
    req.userId = decoded.userId
    
    next() // Continua para a próxima função
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return res.status(401).json({ message: "Token inválido ou expirado" })
  }
}

module.exports = authMiddleware
