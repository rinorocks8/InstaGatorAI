import type { VercelRequest, VercelResponse } from "@vercel/node";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let prompt =
      req.body?.prompt ||
      `
  Title: \"The Great Swamp Showdown - UF vs FSU\"\n\nEnvision this spectacle: At the swamp-infested Ben Hill Griffin Stadium, the gargantuan Gator mascot of University of Florida (UF) is poised directly at the field's 50-yard line. The Gator, armored in an overwhelming and obstinate shade of orange and blue, is growling triumphantly with a custom-made \"UF\" engraved football in its claws. The pumped up crowd is a sea of orange around, chanting with fervor, \"Go Gators!\"\n\nJust opposite the field, the Seminole mascot from FSU isn't having the best of the days - his vivid garnet and gold attire overwhelmed by the Gators' might. Despite sitting on a horse, he looks more like a timid squirrel, wary of a prowling Gator. The war paint on his face appears to be running with beads of sweat. His eyes dart around nervously, caught in the electrifying energy of Gator nation. His once formidable spear eerily resembles a wooden toothpick in comparison to the robust Gator. Even his jersey, inscribed \"FSU\", seems to whisper a desperate plea for mercy.\n\nNow add a twist of humor: Tucked within the crowd, a squad of gallant squirrels sporting orange and blue tiny jerseys are seen marching, mocking the Seminole mascot with their outrageous antics. A few pelicans are flying overhead in V formation, dropping precisely aimed water balloons on the Seminole, further impaling their spirit. The crowd's laughter echoes through the stadium, turning the Gators' territory into a comic theatre.\n\nThis scene intensifies the rivalry between University of Florida and the Florida State University, amplifying the much-awaited swamp showdown. The stadium reverberates with the imprinted echo, \"Go Gators!\" while the FSU mascot cringes, ensnared in the comedic battlefield. This is more than just a game - it's the University of Florida creating an unforgettable mockery of FSU, painting an irresistibly entertaining canvas for its diehard Gator fans.
  `;

    console.log("Generating image for", req.body?.name);

    const imageUrl = await generateImage(prompt);

    return res.status(200).send({
      message: imageUrl,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      error: "Internal Server Error",
    });
  }
}

async function generateImage(prompt: string) {
  const imgObj = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
  });
  const imgUrl = imgObj.data[0].url;
  return imgUrl ?? "";
}
