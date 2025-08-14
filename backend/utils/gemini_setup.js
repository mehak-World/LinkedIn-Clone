require("dotenv").config()
const { GoogleGenAI } = require("@google/genai");
const {Modality } = require("@google/genai");
const fs  = require("node:fs");
const { handleUpload } = require("../utils/cloudinary_config.js")

const ai = new GoogleGenAI({api_key: process.env.GOOGLE_GEMINI_KEY});
const path = require("path")


const generateImage = async (keywords) => {
  const contents = `Hi, can you create an image related to ${keywords} for a linkedin post`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
});

  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      const buffer = Buffer.from(imageData, "base64");

      const filePath = path.join(__dirname, "../uploads/gemini-native-image.png");
      fs.writeFileSync(filePath, buffer);

      const cloudinaryUrl = await handleUpload(filePath);
      return cloudinaryUrl;
    }
  }
};

module.exports = {generateImage}
