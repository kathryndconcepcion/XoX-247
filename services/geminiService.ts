
import { GoogleGenAI } from "@google/genai";
import { BannerStyle } from "../types";

const getSystemPrompt = (style: BannerStyle) => {
  const commonRequirements = `
    Create a professional 9:16 vertical promotional banner for 'XOX247'.
    Content must include 4 distinct sections or icons for:
    1. 🎮 Live Games
    2. 🎰 Slots
    3. 🏏 Sports
    4. 🐟 Arcade/Fish
    
    Required Text Overlays:
    - '✨ Bonus on First Deposit' (Main visual hook)
    - '👉 Register Now | xox247.com' (Call to action at the bottom)
    - '🛑 18+ Only | Play Responsibly' (Small regulatory text)
    
    Safety Rules:
    - NO images of cash, coins, or currency.
    - NO betting slips or 'win money' visuals.
    - Policy-safe and Facebook Ads compliant.
    - Focus on game entertainment value.
  `;

  switch (style) {
    case BannerStyle.CYBER:
      return `${commonRequirements}
        Style: Futuristic Neon Cyber.
        Visuals: Dark gradient background, vibrant neon pink and electric blue accents, 3D gaming icons, glowing bold typography, digital particle effects, high-tech interface aesthetic.`;
    case BannerStyle.MINIMAL:
      return `${commonRequirements}
        Style: Minimal Flat Design.
        Visuals: Light gray or off-white background, clean geometric flat icons, elegant sans-serif typography (like Inter or Helvetica), spacious layout, sophisticated simplicity.`;
    case BannerStyle.LUXURY:
      return `${commonRequirements}
        Style: Luxury Gold / Premium.
        Visuals: Deep black/charcoal background with brushed gold metallic accents, elegant serif typography, subtle sparkles or bokeh effects, premium materials aesthetic, high-end exclusive feel.`;
    case BannerStyle.CARTOON:
      return `${commonRequirements}
        Style: Cartoon / Playful.
        Visuals: Bright multicolored vibrant background (sky blue, yellow, orange), friendly rounded cartoonish icons, bold playful bubble fonts, high energy, fun and engaging mascot-style illustrations.`;
    default:
      return commonRequirements;
  }
};

export const generateBannerImage = async (style: BannerStyle): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = getSystemPrompt(style);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    let imageUrl = '';
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in response");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
