
import { GoogleGenAI, Type } from "@google/genai";
import { Intensity, CardType, Player, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCardPrompt = async (
  type: CardType,
  intensity: Intensity,
  difficulty: Difficulty,
  selectedPlayer: Player,
  allPlayers: Player[],
  language: string = 'en'
) => {
  const otherPlayers = allPlayers.filter(p => p.id !== selectedPlayer.id).map(p => p.name).join(', ');
  
  const systemPrompt = `You are a creative party game engine. 
  Generate a unique, engaging, and high-quality ${type} card for a social game.
  The intensity level is: ${intensity}. 
  The difficulty level is: ${difficulty}. (EASY means safe, simple, and lighthearted. HARD means more challenging, deeper, riskier, or more complex).
  The selected player is: ${selectedPlayer.name}. 
  The other players are: ${otherPlayers}.
  The response must be in ${language}.
  
  Guidelines:
  - Truth: Thought-provoking, social, emotional or funny questions.
  - Dare: Safe, interactive, physical or verbal challenges (no internet/camera needed).
  - Secret: A hidden mission for ${selectedPlayer.name} that only they should see.
  - Chaos: A game-breaking rule change or group-wide activity.
  
  Adhere strictly to both intensity and difficulty. ${difficulty} difficulty ${type} should feel noticeably ${difficulty === Difficulty.HARD ? 'more intense/tricky' : 'more chill/casual'} than EASY.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one creative prompt.",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["title", "description"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
