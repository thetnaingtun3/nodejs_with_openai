import express from "express";
import OpenAI from "openai";
import cors from "cors";
import pkg from "body-parser";

const { json } = pkg;

const app = express();
app.use(json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const title = req.body.title;
    // const title = "Customer Service Principles";
    async function main() {
      const stream = await openai.beta.chat.completions.stream({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `
     show me  ${title} at least three title only generate  and response data please make  this  format [{'key':1,'value':'title 1'},{'key':2,'value':'title 2'}] `,
          },
        ],
        stream: false,
      });

      // for await (const chunk of stream) {
      //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
      // }

      const chatCompletion = await stream.finalChatCompletion();
      const response = chatCompletion["choices"][0]["message"]["content"];
      // console.log(response);

      const responseData = JSON.parse(response.replace(/'/g, '"'));
      return res.json(responseData);
    }
    main();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.post("/explain/title", (req, res) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const title = req.body.title;
    // const title = "Customer Service Principles";
    async function main() {
      const stream = await openai.beta.chat.completions.stream({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `
     please explain  ${title} details 100 words counts`,
          },
        ],
        stream: false,
      });

      // for await (const chunk of stream) {
      //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
      // }

      const chatCompletion = await stream.finalChatCompletion();
      const response = chatCompletion["choices"][0]["message"]["content"];
      // console.log(response);

      // const responseData = JSON.parse(response.replace(/'/g, '"'));
      return res.json(response);
    }
    main();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
