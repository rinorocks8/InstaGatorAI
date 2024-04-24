import { VercelRequest, VercelResponse } from "@vercel/node";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let event = req.body;

    if (!event || Object.keys(event).length === 0)
      return res.status(400).send({
        error: "No event provided",
      });

    console.log(
      `Starting Post for University of Florida ${event.sport.title} game vs ${event.opponent.title}`
    );

    // Hard code the environment more, change character

    const [caption, dallePrompt] = await Promise.all([
      generatePrompt(
        `
        Please write me a 30 word caption for an Instagram photo that describes the University of Florida ${
          event.sport.title
        } game vs ${event.opponent.title}. 
        Show your support and hopes for the university of florida winning. Include the time of the game: ${
          event.time ?? event.date
        }.
        `
      ),
      generatePrompt(
        `
        Please make write me a dalle prompt for the University of Florida ${event.sport.title} game vs ${event.opponent.title}. Please make it extravagent and comedic.
  
        Please use the Gator mascot for the University of Florida and the ${event.opponent.mascot} for the ${event.opponent.title}. Place the image in an environment related Gator or ${event.opponent.mascot} or in the University of Florida or ${event.opponent.title} stadium.
    
        Make sure the florida gators are wearing their school colors, orange and blue, and says the University of Florida or UF on their jersey. Make sure the ${event.opponent.title} are wearing their own school colors and says the name of the school, ${event.opponent.title}, on their jersey.
    
        Make fun of the ${event.opponent.title} and make sure to glorify the University of Florida. Please embarass ${event.opponent.title}.
        `
      ),
    ]);

    const image = await fetch("http://localhost:3000/api/requestDalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `University of Florida ${event.sport.title} game vs ${event.opponent.title}`,
        prompt: dallePrompt,
      }),
    });

    const imageURL = (await image?.json()).message;

    const post = await fetch("http://localhost:3000/api/postPhoto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `University of Florida ${event.sport.title} game vs ${event.opponent.title}`,
        caption: caption,
        imageURL: imageURL,
      }),
    });

    return res.status(200).send({
      message: "Successfully posted to Instagram",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
}

async function generatePrompt(prompt: string) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-4",
  };
  const chatCompletion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);
  const imagePrompt = chatCompletion.choices[0].message.content;
  return imagePrompt ?? "";
}
