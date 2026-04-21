const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const express = require("express")
const router = express.Router()
const Booking = require("../models/booking")
const User = require("../models/user")
const authMiddleware = require("../middleware/auth")
const nodemailer = require("nodemailer")

// Nodemailer configuration (Gmail).
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Sender email account
    pass: process.env.EMAIL_PASS  // Gmail app password
  }
})

// Send booking confirmation email.
async function sendConfirmationEmail(userEmail, userName, booking) {
  const serviceSizeLabel = {
    pequeno: "Small",
    medio: "Medium",
    grande: "Large",
    small: "Small",
    medium: "Medium",
    large: "Large"
  }[booking.serviceSize] || booking.serviceSize

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Booking Confirmation",
    html: `
      <h2>Hello ${userName}!</h2>
      <p>Your booking has been confirmed successfully.</p>
      <p><strong>Date:</strong> ${booking.bookingDate}</p>
      <p><strong>Time:</strong> ${booking.bookingTime}</p>
      <p><strong>Service:</strong> ${serviceSizeLabel}</p>
      <br>
      <p>Thank you for booking with us.</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Confirmation email sent to:", userEmail)
  } catch (error) {
    console.error("Error sending email:", error)
    // Do not block booking creation if email fails.
  }
}

// POST /bookings - Create new booking (protected route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bookingDate, bookingTime } = req.body
    const userId = req.userId

    const normalizedServiceSize = {
      pequeno: "small",
      medio: "medium",
      grande: "large",
      small: "small",
      medium: "medium",
      large: "large"
    }[req.body.serviceSize]

    // Validate required fields.
    if (!normalizedServiceSize || !bookingDate || !bookingTime) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check schedule conflict for same date/time.
    const conflict = await Booking.findOne({ bookingDate, bookingTime })
    if (conflict) {
      return res.status(409).json({ 
        message: "This time slot is already occupied. Please choose another." 
      })
    }

    // Create booking.
    const booking = new Booking({
      userId,
      serviceSize: normalizedServiceSize,
      bookingDate,
      bookingTime
    })
    await booking.save()

    // Load user details for confirmation email.
    const user = await User.findById(userId)
    if (user && user.email) {
      await sendConfirmationEmail(user.email, user.name, booking)
    }

    res.status(201).json({ 
      message: "Booking created successfully", 
      booking 
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /bookings - Return bookings for logged user or selected date.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const { date } = req.query

    let filter = {}

    // Filter by date when provided.
    if (date) {
      filter.bookingDate = date
    } else {
      filter.userId = userId
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email")
      .sort({ bookingDate: 1, bookingTime: 1 })

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error loading bookings:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /bookings/my - Return only logged user bookings.
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId

    const bookings = await Booking.find({ userId })
      .sort({ bookingDate: 1, bookingTime: 1 })

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Error loading bookings:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE /bookings/:id - Cancel booking.
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const bookingId = req.params.id

    // Verify ownership before deleting.
    const booking = await Booking.findOne({ _id: bookingId, userId })
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    await Booking.findByIdAndDelete(bookingId)
    
    res.status(200).json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
