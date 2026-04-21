const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const User = require("../models/user")

function buildFrontendRedirect(searchParams = {}) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173"
  const redirectUrl = new URL(frontendUrl)

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      redirectUrl.searchParams.set(key, value)
    }
  })

  return redirectUrl.toString()
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error("Google não retornou email"), null)
        }

        // Procura o usuário; se não existir, cria automaticamente.
        let user = await User.findOne({ email })
        if (!user) {
          user = new User({
            name: profile.displayName || "Usuário Google",
            email,
            passwordHash: "",
            authProvider: "google"
          })
          await user.save()
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// POST /register - Cria novo usuário com senha criptografada
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Validação de campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nome, email e senha são obrigatórios" })
    }

    // Verifica se o email já está cadastrado
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(409).json({ message: "Email já cadastrado" })
    }

    // Criptografa a senha com bcrypt (10 rounds de salt)
    const passwordHash = await bcrypt.hash(password, 10)

    // Cria o novo usuário
    const user = new User({ 
      name, 
      email, 
      passwordHash 
    })
    await user.save()

    res.status(201).json({ 
      message: "Usuário criado com sucesso", 
      userId: user._id 
    })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

// POST /login - Autentica usuário e retorna JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validação de campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" })
    }

    // Busca usuário pelo email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Email ou senha incorretos" })
    }

    if (!user.passwordHash) {
      return res.status(401).json({ message: "Use login com Google para esta conta" })
    }

    // Compara a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou senha incorretos" })
    }

    // Gera token JWT válido por 7 dias
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || "secret_key_default",
      { expiresIn: "7d" }
    )

    res.status(200).json({ 
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    res.status(500).json({ message: "Erro no servidor" })
  }
})

// GET /auth/google - Inicia autenticação Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
)

// GET /auth/google/callback - Callback do Google e emissão de JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET || "secret_key_default",
        { expiresIn: "7d" }
      )

      const userPayload = JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      })

      // Redireciona para o frontend com token para persistência local.
      return res.redirect(
        buildFrontendRedirect({
          token,
          user: userPayload
        })
      )
    } catch (error) {
      console.error("Erro no callback Google:", error)
      return res.redirect(buildFrontendRedirect({ oauthError: "callback_failed" }))
    }
  }
)

// GET /auth/google/failure - Tratamento de falha no login social
router.get("/google/failure", (_req, res) => {
  return res.redirect(buildFrontendRedirect({ oauthError: "google_auth_failed" }))
})

module.exports = router
