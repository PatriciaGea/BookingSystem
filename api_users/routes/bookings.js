const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const express = require("express")
const router = express.Router()
const Booking = require("../models/booking")
const User = require("../models/user")
const authMiddleware = require("../middleware/auth")
const nodemailer = require("nodemailer")

// Configuração do Nodemailer (usando Gmail como exemplo)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Email remetente (ex: seuemail@gmail.com)
    pass: process.env.EMAIL_PASS  // Senha de aplicativo do Gmail
  }
})

// Função para enviar email de confirmação
async function sendConfirmationEmail(userEmail, userName, booking) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Confirmação de Agendamento",
    html: `
      <h2>Olá ${userName}!</h2>
      <p>Seu agendamento foi confirmado com sucesso!</p>
      <p><strong>Data:</strong> ${booking.bookingDate}</p>
      <p><strong>Horário:</strong> ${booking.bookingTime}</p>
      <p><strong>Serviço:</strong> ${booking.serviceSize}</p>
      <br>
      <p>Obrigado por agendar conosco!</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email de confirmação enviado para:", userEmail)
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    // Não bloqueia o agendamento se o email falhar
  }
}

// POST /bookings - Cria novo agendamento (rota protegida)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { serviceSize, bookingDate, bookingTime } = req.body
    const userId = req.userId // Vem do middleware de autenticação

    // Validação de campos obrigatórios
    if (!serviceSize || !bookingDate || !bookingTime) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }

    // Validação do tamanho do serviço
    if (!["pequeno", "medio", "grande"].includes(serviceSize)) {
      return res.status(400).json({ message: "Tamanho de serviço inválido" })
    }

    // Verifica conflito de horário (outro agendamento na mesma data/hora)
    const conflict = await Booking.findOne({ bookingDate, bookingTime })
    if (conflict) {
      return res.status(409).json({ 
        message: "Este horário já está ocupado. Por favor, escolha outro." 
      })
    }

    // Cria o agendamento
    const booking = new Booking({
      userId,
      serviceSize,
      bookingDate,
      bookingTime
    })
    await booking.save()

    // Busca dados do usuário para enviar email
    const user = await User.findById(userId)
    if (user && user.email) {
      await sendConfirmationEmail(user.email, user.name, booking)
    }

    res.status(201).json({ 
      message: "Agendamento criado com sucesso", 
      booking 
    })
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

// GET /bookings - Retorna os agendamentos do usuário logado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const { date } = req.query

    let filter = {}

    // Se foi passada uma data específica, filtra por ela
    if (date) {
      filter.bookingDate = date
    } else {
      // Senão, retorna apenas os bookings do usuário logado
      filter.userId = userId
    }

    const bookings = await Booking.find(filter)
      .populate("userId", "name email") // Inclui dados do usuário
      .sort({ bookingDate: 1, bookingTime: 1 }) // Ordena por data e hora

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

// GET /bookings/my - Retorna apenas os agendamentos do usuário logado
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId

    const bookings = await Booking.find({ userId })
      .sort({ bookingDate: 1, bookingTime: 1 })

    res.status(200).json(bookings)
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

// DELETE /bookings/:id - Cancela um agendamento
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId
    const bookingId = req.params.id

    // Busca o agendamento e verifica se pertence ao usuário
    const booking = await Booking.findOne({ _id: bookingId, userId })
    
    if (!booking) {
      return res.status(404).json({ message: "Agendamento não encontrado" })
    }

    await Booking.findByIdAndDelete(bookingId)
    
    res.status(200).json({ message: "Agendamento cancelado com sucesso" })
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

module.exports = router
