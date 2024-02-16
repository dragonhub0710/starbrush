const OpenAI = require("openai");
const axios = require("axios");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

async function generateImage(prompt, base_prompt) {
  try {
    const image_prompt = base_prompt + `Prompt: ${prompt}`;
    return openai.images
      .generate({
        model: "dall-e-3",
        prompt: image_prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      })
      .then((response) => response.data[0].url);
  } catch (err) {
    console.log(err);
  }
}

const imgGenerator = async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(process.env.DATABASE_API, {
      name: process.env.DATABASE_PROJECT_NAME,
    });

    if (response.data.data.prompt) {
      const firstBatchPrompts = new Array(7).fill(prompt);
      const firstBatchPromises = firstBatchPrompts.map((prompt) =>
        generateImage(prompt, response.data.data.prompt)
      );
      const firstBatchUrls = await Promise.all(firstBatchPromises);

      res.json(firstBatchUrls);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  imgGenerator,
};
