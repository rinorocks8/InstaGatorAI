import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("here");

  return res.status(200).send({
    message: "Response.",
  });
}
