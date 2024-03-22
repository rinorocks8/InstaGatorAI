import type { VercelRequest, VercelResponse } from "@vercel/node";

const instagram_business_account_id = "17841464631072740";

const accessToken = process.env["META_ACCESS_TOKEN"] ?? "";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { caption, imageURL, name } = req.body;

  console.log("Uploading Post for", name);

  const media_id = await createInstagramMediaContainer(imageURL, caption);
  const postRes = await postMediaContainerToInstagram(media_id);

  return res.status(200).send({
    post_res: postRes,
    image_url: imageURL,
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
