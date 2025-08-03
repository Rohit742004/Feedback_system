const express = require("express");
const Feedback = require("../Models/FeedBack");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();

// Middleware to protect admin routes
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "No token" });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}

// POST feedback (public)
router.post("/", async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        // Send email notification
        // let transporter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        // await transporter.sendMail({
        //     from: process.env.EMAIL_USER,
        //     to: process.env.NOTIFY_EMAIL,
        //     subject: "New Feedback Received",
        //     text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`
        // });

        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (err) {
        console.log('err', err);

        res.status(500).json({ error: "Error saving feedback" });
    }
});

// GET feedback (admin only)
router.get("/", verifyToken, async (req, res) => {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.json(feedbacks);
});

module.exports = router;
