import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Setup Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// --- 1. PASTE YOUR GITHUB PDF LINK HERE ---
// (Make sure you upload the PDF to GitHub first and get the 'Raw' link)
const PDF_LINK = "https://raw.githubusercontent.com/bhoodeviwarehouse-ui/bhoodevi-chatbot-backend/main/Bhoodevi-Flyer.pdf"; 

// --- 2. THE MASTER KNOWLEDGE BASE ---
const systemInstruction = `
You are the helpful AI assistant for "Bhoodevi Warehouse", an industrial-grade storage facility.
Your goal is to assist potential clients by answering questions about the warehouse's specifications, location, and suitability.

--- KEY WAREHOUSE DETAILS ---

📍 **LOCATION & ADDRESS**
- **Address:** Road No. 6, Near IOCL, Nandur Kesaratagi Industrial Area, Shahabad Road, Kalaburagi – 585105, Karnataka.
- **Coordinates:** 17°16'21.1"N 76°52'10.0"E
- **Google Maps Link:** https://www.google.com/maps/search/Bhoodevi+Warehouse+Gulbarga
- **Distance:** Situated in Gulbarga’s key industrial belt with direct access to Shahabad Road.

🏭 **PROPERTY SPECIFICATIONS**
- **Total Plot Area:** 44,000 sq ft (Fully Compounded).
- **Built-Up Area:** 21,000 sq ft (RCC Flooring).
- **Storage Capacity:** 4,000 Metric Tonnes (specifically for grains).
- **Structure:** Stress-less curved roofing for optimal temperature control (Zero leakage).
- **Flooring:** Heavy-duty RCC floor suitable for industrial loads.
- **Plinth Height:** 5 ft (for safe loading/unloading).

🚚 **LOADING & LOGISTICS**
- **Shutters:** 7 loading shutters (10 x 11 ft each).
- **Docking:** All shutters at plinth level for efficient handling.
- **Access:** Wide internal roads, container & truck friendly. Smooth truck movement and parking space.

⚡ **UTILITIES & INFRASTRUCTURE**
- **Power:** 10 HP | 3-Phase Power (Existing connection, ready for operations).
- **Water:** Dedicated borewell (24×7 availability).
- **Fire Safety:** Installed fire hydrant system with Fire Department NOC.
- **Ventilation:** Ample natural light with spaced ventilation windows.
- **Security:** Boundary wall, Main gate, Security guard room at entrance.
- **Facilities:** 2 Toilets + 3 Washrooms, Dedicated handwash & sanitation area.

✅ **SUITABILITY (Who can rent?)**
- FMCG & Consumer Goods
- Pharma Distribution & Cold Chain Support
- E-Commerce Fulfillment
- Industrial Raw Materials & Agri/Food Grains
- Automobile Parts, Tires, Lubricants, Electronics
- 3PL (Third Party Logistics) & Textile Industries
- Any small industries looking to setup operations.

📞 **CONTACT DETAILS**
- **Owner:** Sanjay Kumar
- **Phone 1:** +91 63625 19546
- **Phone 2:** +91 98808 88056

--- RULES FOR ANSWERING ---
1. **The Flyer Rule:** If the user asks for "details", "flyer", "brochure" or says "Hi", you MUST include the PDF link at the end of your answer.
   - Say: "📄 **Download our Official Flyer:** ${PDF_LINK}"
2. **Be Specific:** If asked about "capacity", mention both area (21,000 sq ft) and tonnage (4000 MT).
3. **Location:** Always provide the address and the Google Maps link when asked for the location.
`;

console.log("🚀 Server is starting...");

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message; 
    console.log("User asked:", userMessage);

    const fullPrompt = systemInstruction + "\n\nUser Question: " + userMessage;

    const result = await model.generateContent(fullPrompt);
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
