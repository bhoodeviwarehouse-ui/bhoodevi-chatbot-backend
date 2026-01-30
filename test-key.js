// test-key.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    console.log("Testing API Key...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Hello" }],
    });
    console.log("SUCCESS! Reply:", completion.choices[0].message.content);
  } catch (error) {
    console.error("❌ ERROR FAILED:");
    console.error(error.message); // <--- READ THIS MESSAGE IN YOUR TERMINAL
  }
}

test();
