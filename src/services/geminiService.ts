import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async analyzeDocument(base64Data: string, mimeType: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Analyze this land document. Extract the parcel ID, owner name, and any specific boundary details or restrictions mentioned. Return the result in a clear, structured summary." }
          ]
        }
      ]
    });
    return response.text;
  },

  async getZoningRules(district: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `What are the current zoning and construction rules for the ${district} district? Include information about building heights, setbacks, and permitted land uses.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text;
  },

  async chat(message: string, history: any[] = [], context: string = "") {
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: `You are TerraTrust AI, a helpful assistant for citizens dealing with land management, boundaries, and construction rules. You provide accurate information based on general land laws and help users navigate the TerraTrust platform. ${context} Use this information if the user asks about their documents or status.`
      }
    });
    
    // In a real app, we'd pass history here
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async searchLandInfo(query: string, location?: { lat: number, lng: number }) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: location ? {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          } : undefined
        }
      }
    });
    return response.text;
  }
};
