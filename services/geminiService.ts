
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAIExplanation = async (algorithmName: string, category: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured. Cannot generate AI explanation.";
  }

  try {
    const prompt = `
      You are an expert computer science professor.
      Explain the algorithm or data structure called "${algorithmName}" from the category "${category}".
      Keep the explanation concise, student-friendly, and easy to understand.
      Focus on the core concept and how it works.
      Do not include code snippets.
      Format the output in simple paragraphs.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.5,
            topP: 0.95,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching AI explanation:", error);
    if (error instanceof Error) {
        return `An error occurred while generating the explanation: ${error.message}`;
    }
    return "An unknown error occurred while generating the explanation.";
  }
};
