import { GoogleGenAI } from "@google/genai";

// Ideally, this is server-side, but for this prototype we do it client-side.
// The user must provide their key in the environment or we handle the error gracefully.
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePropertyDescription = async (
  title: string,
  type: string,
  features: string[],
  location: string
): Promise<string> => {
  if (!API_KEY) {
    console.warn("No API Key found for Gemini");
    return "Please configure your Gemini API Key to generate descriptions automatically.";
  }

  try {
    const prompt = `
      Write a catchy, professional, and appealing description for a rental property listing.
      Maximize the appeal for potential tenants. Keep it under 100 words.
      
      Details:
      Title: ${title}
      Type: ${type}
      Location: ${location}
      Key Features: ${features.join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please write a description manually.";
  }
};