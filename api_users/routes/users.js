const dns = require("node:dns").promises
dns.setServers(["1.1.1.1"])
const mongoose = require("mongoose")
const express = require("express")
const router = express.Router()
const User = require("../models/user")


router.post("/", async (req, res) => {
  try {
    const { name, email, age } = req.body
    if (!name || !email || !age) return res.status(400).json({ message: "Name, email and age required" })

    const userExists = await User.findOne({ email })
    if (userExists) return res.status(409).json({ message: "User already exists" })

    const user = new User({ name, email, age: Number(age) })
    await user.save()

    res.status(201).json({ message: "User created successfully", userId: user._id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})


router.get("/", async (req, res) => {
  try {
    const { name, email, age } = req.query
    const filter = {}
    if (name) filter.name = new RegExp(name, 'i')
    if (email) filter.email = new RegExp(email, 'i')
    if (age) filter.age = Number(age)

    const users = await User.find(filter)
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})


router.put("/:id", async (req, res) => {
  try {
    const { name, email, age } = req.body
    if (!name && !email && !age) return res.status(400).json({ message: "At least one field is required" })

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(email && { email }), ...(age && { age: Number(age) }) },
      { new: true, runValidators: true }
    )

    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json({ message: "User updated successfully", user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})


router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
