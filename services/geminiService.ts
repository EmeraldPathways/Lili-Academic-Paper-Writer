
import { GoogleGenAI } from "@google/genai";
import { ReferencingStyle } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set. Using a placeholder which will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = ai.models;

export const generatePaper = async (
  prompt: string,
  draft: string,
  style: ReferencingStyle
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please set the API_KEY environment variable.");
  }
  
  const fullPrompt = `
    Based on the following instructions and draft, generate a section for an academic paper.
    The tone must be formal, scholarly, and suitable for a submission to a university in Ireland.
    All citations and the reference list must strictly follow the ${style} referencing standard. Ensure references are plausible and correctly formatted.

    Instructions:
    "${prompt}"

    Existing Draft/Content (if any):
    ---
    ${draft || "No existing draft provided. Start from scratch based on the instructions."}
    ---
  `;

  try {
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: `You are a world-class academic writing assistant. Your expertise lies in structuring scholarly articles, ensuring impeccable grammar, and formatting citations and references flawlessly according to specified styles. You are assisting a student at an Irish university.`,
        temperature: 0.7,
        topP: 0.95,
        topK: 40
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating paper with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the paper.");
  }
};
