import type { VercelRequest, VercelResponse } from "@vercel/node";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const instagram_business_account_id = "17841464631072740";

//Expires on March 26, 2024
const accessToken = process.env["META_ACCESS_TOKEN"] ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let event = req.body;

  if (!event) {
    const all_events = await getFloridaGatorsSchedule();
    event = all_events[0].events[0];
  }

  console.log(
    `Starting Post for University of Florida ${event.sport.title} game vs ${event.opponent.title}`
  );

  const [caption, schoolColors] = await Promise.all([
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
      `What are the school colors for the University of Mississippi? Please only respond with the colors and nothing else.`
    ),
  ]);

  if (!schoolColors || !caption)
    return res.status(500).send("Prompt Generation Failure");

  const imageUrl = await generateImage(`
    Please make me an image for the University of Florida ${event.sport.title} game vs ${event.opponent.title}. Please make it extravagent and comedic.

    Please use the Gator mascot for the University of Florida and the ${event.opponent.mascot} for the ${event.opponent.title}. Place the image in an environment related Gator or ${event.opponent.mascot} or in the University of Florida or ${event.opponent.title} stadium.

    Make sure the florida gators are wearing their school colors and says the University of Florida or UF on their jersey. Make sure the ${event.opponent.title} are wearing their own school colors, ${schoolColors} and says the name of the school, ${event.opponent.title}, on their jersey.

    Make fun of the ${event.opponent.title} and make sure to glorify the University of Florida. Please embarass ${event.opponent.title}.
  `);

  const media_id = await createInstagramMediaContainer(imageUrl, caption);
  const postRes = await postMediaContainerToInstagram(media_id);

  return res.status(200).send({
    post_res: postRes,
    image_url: imageUrl,
  });
}

const postMediaContainerToInstagram = async (media_id: string) => {
  const post = await fetch(
    `https://graph.facebook.com/v19.0/${instagram_business_account_id}/media_publish?creation_id=${media_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        access_token: accessToken,
      }),
    }
  );
  const postRes = await post.json();
  return postRes;
};

const createInstagramMediaContainer = async (
  photoURL: string,
  caption: string
) => {
  const post = await fetch(
    `https://graph.facebook.com/v19.0/${instagram_business_account_id}/media`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        image_url: photoURL,
        is_carousel_item: "false",
        caption: removeQuotes(caption),
        access_token: accessToken,
      }),
    }
  );
  const postRes = await post.json();
  return postRes.id;
};

function removeQuotes(inputString: string) {
  if (
    inputString.charAt(0) === '"' &&
    inputString.charAt(inputString.length - 1) === '"'
  ) {
    return inputString.substring(1, inputString.length - 1);
  } else {
    return inputString;
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

async function getFloridaGatorsSchedule() {
  const baseUrl = "https://floridagators.com/services/responsive-calendar.ashx";
  const queryParams = {
    type: "events",
    sport: "0",
    location: "all",
    date: getFormattedDate(),
  };
  const encodedParams = Object.entries(queryParams)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  const url = `${baseUrl}?${encodedParams}`;
  const response = await fetch(url);
  const all_events = await response.json();
  return all_events;
}

function getFormattedDate() {
  const now = new Date();

  const month = (now.getMonth() + 1).toString();
  const day = now.getDate().toString();
  const year = now.getFullYear();

  return `${month}/${day}/${year} 12:00:00 AM`;
}

const generateToken = () => {
  // const authUrl = graph.getOauthUrl({
  //   client_id: "755270246516147",
  //   redirect_uri: "https://localhost:3000/auth",
  //   scope:
  //     "ads_management business_management instagram_basic instagram_content_publish pages_read_engagement pages_show_list public_profile",
  // });
  // return res.status(200).send(authUrl); // Return to postman
  /*
  //get first access token from postman
  */
  // graph.extendAccessToken(
  //   {
  //     access_token:
  //       "EAAW2wBTYPIgBO1BToRFvGMMZC5hacPN1Ee16WnZAzPZAOLngJya3Py977Jt26B83ZBSdbcnDTFfU9nwq8av44eJUZCfGMncHp8MgKFGxTsrZCfdqjuyoOEUJW0loOQWztHmzzcBM4dNrBUBaFdAkNB1kWZBoD85nMp9ejZCWfEew25NqcB8uJjN37HTyuwXTlOC898kty63erHEUpUMoe8mTxWethwZDZD",
  //     client_id: "1608310983244936",
  //     client_secret: "213f9daac2ddf54649f153d9a9dc3206",
  //   },
  //   function (err: any, facebookRes: any) {
  //     console.log(facebookRes);
  //   }
  // );
  // new token:
  // const accessToken =
  //   "EAAW2wBTYPIgBOxEicQbStJ4AZAiXZCZBXpN13MAIjk7kEAFVY5eiwta0IBPDFtaefHRt7XMPK8S2rGPWmoj16vEPVDhohkvQjdSaE70mtC0RrXtftERtnm5DyZBZBLECtjnY7RZAr8eBvFJ7YUDuaOm0No2VST1HDPi75N0prmTCZBD4wXqA55j7QsOjX2DVNRfb0CdH4jZCB37va5MzA4xe9MmphQZDZD";
  // graph.setAccessToken(accessToken);
};
