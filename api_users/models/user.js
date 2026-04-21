
const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")

// User model with authentication support.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // For social login users, passwordHash can be empty.
  passwordHash: { type: String, default: "" }, // Hashed password
  authProvider: { type: String, default: "local" },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("User", userSchema)
