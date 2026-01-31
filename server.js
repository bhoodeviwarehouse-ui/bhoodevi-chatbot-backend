import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Setup Google Gemini (Free Version)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

console.log("🚀 Server is starting...");

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message; 
    console.log("User asked:", userMessage);

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const botReply = response.text();

    console.log("Bot replied:", botReply);

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));