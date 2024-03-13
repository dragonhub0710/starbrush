const OpenAI = require("openai");
const axios = require("axios");
const Replicate = require("replicate");

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateImage(prompt, base_prompt) {
  try {
    const image_prompt = base_prompt + `Prompt: ${prompt}`;
    return replicate
      .run(
        "playgroundai/playground-v2-1024px-aesthetic:42fe626e41cc811eaf02c94b892774839268ce1994ea778eba97103fe1ef51b8",
        {
          input: {
            width: 1024,
            height: 1024,
            prompt: image_prompt,
            scheduler: "K_EULER_ANCESTRAL",
            guidance_scale: 3,
            apply_watermark: false,
            negative_prompt: "",
            num_inference_steps: 50,
          },
        }
      )
      .then((res) => res[0]);
    // return openai.images
    //   .generate({
    //     model: "dall-e-3",
    //     prompt: image_prompt,
    //     n: 1,
    //     size: "1024x1024",
    //     quality: "standard",
    //   })
    //   .then((response) => response.data[0].url);
  } catch (err) {
    console.log(err);
  }
}

const imgGenerator = async (req, res) => {
  const { list } = req.body;
  try {
    const res_optimize = await axios.post(process.env.DATABASE_API, {
      name: process.env.STARBRUSH_CHAT_OPTIMIZE_PROMPT,
    });
    let msgs = [
      {
        role: "system",
        content: res_optimize.data.data.prompt,
      },
    ];
    for (let i = 0; i < list.length; i++) {
      msgs.push({ role: list[i].role, content: list[i].content });
    }
    const completion = await openai.chat.completions.create({
      messages: msgs,
      model: "gpt-3.5-turbo",
    });
    const res_image = await axios.post(process.env.DATABASE_API, {
      name: process.env.STARBRUSH_IMAGE_PROMPT,
    });

    if (res_image.data.data.prompt) {
      const imagePrompts = new Array(10).fill(
        completion.choices[0].message.content
      );
      const imagePromises = imagePrompts.map((prompt) =>
        generateImage(prompt, res_image.data.data.prompt)
      );
      const imageUrls = await Promise.all(imagePromises);

      res.json(imageUrls);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  imgGenerator,
};
