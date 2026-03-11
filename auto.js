const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on("qr", qr => {
    qrcode.generate(qr, {small: true});
});

client.on("ready", () => {
    console.log("WhatsApp Bot Ready");
});

client.initialize();

app.post("/send", async (req,res)=>{

    const message = req.body.message;

    const groupId = "120363422672209611@g.us";

    await client.sendMessage(groupId,message);

    res.send("Message sent");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});