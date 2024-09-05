const OpenAI = require("openai");
const Replicate = require("replicate");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const { readFile } = require("node:fs/promises");
const path = require("path");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateOpenAIImage(prompt, base_prompt) {
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

exports.imgGenerator = async (req, res) => {
  const { list } = req.body;
  try {
    let msgs = [
      {
        role: "system",
        content: process.env.STARBRUSH_CHAT_OPTIMIZE_PROMPT,
      },
    ];
    for (let i = 0; i < list.length; i++) {
      msgs.push({ role: list[i].role, content: list[i].content });
    }
    const completion = await openai.chat.completions.create({
      messages: msgs,
      model: "gpt-4o-mini",
    });
    const imagePrompts = new Array(5).fill(
      completion.choices[0].message.content
    );
    const imagePromises = imagePrompts.map((prompt) =>
      generateOpenAIImage(prompt, process.env.STARBRUSH_IMAGE_PROMPT)
    );
    const imageUrls = await Promise.all(imagePromises);

    res.json(imageUrls);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeBg = async (req, res) => {
  try {
    const file = req.file;
    const inputPath = path.join(__dirname, "..", "uploads", file.filename);
    const image = await removeBg(inputPath);

    res.status(200).json({ image: image });
    await unlinkAsync(`uploads/${file.filename}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function removeBg(path) {
  let image = await readFile(path);
  let output = await replicate.run(
    "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
    {
      input: { image: image },
    }
  );
  return output;
}

exports.bgDiffusion = async (req, res) => {
  try {
    const file = req.file;
    const { prompt } = req.body;
    const inputPath = path.join(__dirname, "..", "uploads", file.filename);
    const prompts = new Array(3).fill(prompt);
    const imagePromises = prompts.map((item) =>
      generateSDImage(inputPath, item)
    );
    const imageURLs = await Promise.all(imagePromises);

    res.status(200).json({ images: imageURLs });
    await unlinkAsync(`uploads/${file.filename}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function generateSDImage(path, prompt) {
  let image = await readFile(path);
  let output = await replicate.run(
    "wolverinn/realistic-background:ce02013b285241316db1554f28b583ef5aaaf4ac4f118dc08c460e634b2e3e6b",
    {
      input: {
        seed: -1,
        image: image,
        steps: 20,
        prompt: prompt,
        cfg_scale: 7,
        max_width: 1024,
        max_height: 1024,
        sampler_name: "DPM++ SDE Karras",
        negative_prompt:
          "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
        denoising_strength: 0.75,
        only_masked_padding_pixels: 4,
      },
    }
  );
  return output.image;
}
