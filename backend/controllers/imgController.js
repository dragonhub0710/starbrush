const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

async function generateImage(prompt) {
  return openai.images
    .generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })
    .then((response) => response.data[0].url);
}

const imgGenerator = async (req, res) => {
  const { prompt } = req.body;
  try {
    const firstBatchPrompts = new Array(5).fill(prompt);
    const firstBatchPromises = firstBatchPrompts.map(generateImage);
    const firstBatchUrls = await Promise.all(firstBatchPromises);

    res.json(firstBatchUrls);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  imgGenerator,
};
