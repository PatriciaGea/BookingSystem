const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")

// Booking model
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceSize: { 
    type: String, 
    required: true, 
    enum: ["pequeno", "medio", "grande", "small", "medium", "large"]
  },
  bookingDate: { type: String, required: true }, // Format: YYYY-MM-DD
  bookingTime: { type: String, required: true }, // Format: HH:MM
  createdAt: { type: Date, default: Date.now }
})

// Compound index to prevent duplicate booking slots.
bookingSchema.index({ bookingDate: 1, bookingTime: 1 }, { unique: true })

module.exports = mongoose.model("Booking", bookingSchema)
