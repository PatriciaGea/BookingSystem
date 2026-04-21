
const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")

// Modelo de usuário com autenticação
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Para login social, o passwordHash pode ser vazio.
  passwordHash: { type: String, default: "" }, // Senha criptografada
  authProvider: { type: String, default: "local" },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("User", userSchema)
