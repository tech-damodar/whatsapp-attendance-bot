const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json());

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process"
        ]
    }
});

// QR Code
client.on("qr", (qr) => {
    console.log("Scan this QR with WhatsApp:");
    qrcode.generate(qr, { small: true });
});

// Ready Event
client.on("ready", () => {
    console.log("WhatsApp Bot Ready");
});

// Error Handling
client.on("auth_failure", () => {
    console.log("Authentication Failed");
});

client.on("disconnected", () => {
    console.log("WhatsApp Disconnected");
});

// Start WhatsApp
client.initialize();


// API to send message
app.post("/send", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {
            return res.status(400).send("Message is required");
        }

        const groupId = "120363422672209611@g.us";

        await client.sendMessage(groupId, message);

        res.send("Message sent successfully");

    } catch (error) {

        console.error(error);
        res.status(500).send("Error sending message");

    }

});

// Test route
app.get("/", (req, res) => {
    res.send("WhatsApp Bot Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
