const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")

// Modelo de agendamento
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceSize: { 
    type: String, 
    required: true, 
    enum: ["pequeno", "medio", "grande"] // Tamanhos de serviço permitidos
  },
  bookingDate: { type: String, required: true }, // Formato: YYYY-MM-DD
  bookingTime: { type: String, required: true }, // Formato: HH:MM
  createdAt: { type: Date, default: Date.now }
})

// Índice composto para garantir que não haja conflitos de horário
bookingSchema.index({ bookingDate: 1, bookingTime: 1 }, { unique: true })

module.exports = mongoose.model("Booking", bookingSchema)
