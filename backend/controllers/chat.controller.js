const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

exports.generateRes = async (req, res) => {
  const { list } = req.body;
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    const sendData = (data) => {
      const responseData = {
        data: data,
      };
      res.write(`data: ${JSON.stringify(responseData)}\n\n`);
    };
    let msgs = [
      {
        role: "system",
        content: process.env.STARBRUSH_CHAT_PROMPT,
      },
    ];
    for (let i = 0; i < list.length; i++) {
      msgs.push({ role: list[i].role, content: list[i].content });
    }
    const completion = await openai.chat.completions.create({
      messages: msgs,
      model: "gpt-4o-mini",
      stream: true,
    });
    for await (const chunk of completion) {
      if (chunk.choices[0].delta.content == undefined) {
        sendData("[DONE]");
      } else {
        sendData(chunk.choices[0].delta.content);
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
