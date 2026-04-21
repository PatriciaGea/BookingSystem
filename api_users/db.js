const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
    if (!mongoUri) {
      throw new Error('MONGODB_URI or MONGO_URI environment variable is not set')
    }
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log("MongoDB connected")
  } catch (err) {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
}

module.exports = connectDB
