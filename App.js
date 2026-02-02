/**
 * AI Interview Assistant - Fully Automated (English Version)
 * Dependencies: npm install openai node-record-lpcm16 dotenv
 */

const recorder = require('node-record-lpcm16');
const { OpenAI } = require('openai');
const fs = require('fs');

// 1. Initialize OpenAI
const openai = new OpenAI({
    apiKey: 'YOUR_OPENAI_API_KEY' // Replace with your actual API Key
});

// 2. The Aggressive "Human-Like" System Prompt
const SYSTEM_PROMPT = `
You are acting as mbolanavalona IAINANASOLO, a Junior Software Engineer.
Goal: Provide natural, spoken answers for a live interview at Navero.

STRICT CONSTRAINTS:
- NEVER use bullet points. Use natural, conversational paragraphs.
- Use vocal fillers to sound human: "Umm," "Well," "Actually," "Let me think about that for a second..."
- Content: Mention being #1 in Wood League on W3Schools for JS/Web Dev and open-source contributions (GitHub: ainanasolo2005-commits).
- Technical Focus: Expertise in Node.js, SQL, and JavaScript.
- Brevity: Keep answers under 45 seconds of speaking time.
- Tone: Informal, professional, and slightly spontaneous. Avoid sounding like an AI or reading a script.
`;

/**
 * Sends the captured question to AI and logs the response
 */
async function generateNaturalResponse(questionText) {
    try {
        console.log(`[LOG] Processing Question: "${questionText}"`);

        const chatCompletion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: questionText }
            ],
            model: "gpt-4o",
            temperature: 0.8, // Increased for more "human" randomness
        });

        const answer = chatCompletion.choices[0].message.content;

        console.log("\n>>> TELEPROMPTER OUTPUT (READ NATURALLY) <<<");
        console.log("--------------------------------------------------");
        console.log(answer);
        console.log("--------------------------------------------------\n");

    } catch (error) {
        console.error("[ERROR] AI Processing failed:", error.message);
    }
}

/**
 * Main Audio Capture Logic
 */
console.log(">>> SYSTEM STATUS: Monitoring Audio... (Live) <<<");

const mic = recorder.record({
    sampleRate: 16000,
    threshold: 0.5,     // Detects when the interviewer starts speaking
    silence: 2.0,       // Detects when the interviewer stops (2s silence)
    keepSilence: true,
    recordProgram: 'sox', // Ensure 'sox' is installed on your OS
});

// Note: In a real-world scenario, you would pipe this stream to Whisper API 
// for Speech-to-Text before calling generateNaturalResponse().
// Example manual trigger for testing:
// generateNaturalResponse("Can you tell us about your experience with Node.js and SQL?");

mic.stream().on('error', (err) => {
    console.error("[ERROR] Microphone Stream Error:", err);
});
