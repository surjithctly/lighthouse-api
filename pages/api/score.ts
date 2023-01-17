// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

// interface CustomAPIRequest extends NextApiRequest {
//   query: {
//     url: string;
//   };
// }

type Data = {
  message?: string;
  error?: boolean;
  success?: boolean;
  url?: string;
  score?: object;
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {

export default async function handler(req: NextApiRequest) {
  console.log(req);

  // res.status(200).json({ score: req });

  // const thenga = req;

  return new Response(JSON.stringify(req));

  return new Response(
    JSON.stringify({
      score: req,
    })
    // {
    //   status: 200,
    //   headers: {
    //     'content-type': 'application/json',
    //     'cache-control': 'public, s-maxage=1200, stale-while-revalidate=600',
    //   },
    // }
  );

  // const url = req.query.url;

  if (!url) {
    res.status(400).json({ error: true, message: "Please add a valid URL" });
  }

  const params = new URLSearchParams();
  params.append("url", url as string);
  params.append("key", process.env.PAGESPEED_API_KEY as string);
  params.append(
    "fields",
    "lighthouseResult.categories.*.score,lighthouseResult.categories.*.title"
  );
  // Share the mobile score
  params.append("strategy", "mobile");
  // fetch required categories
  params.append("category", "PERFORMANCE");
  params.append("category", "ACCESSIBILITY");
  params.append("category", "BEST-PRACTICES");
  params.append("category", "SEO");

  // do the fetch
  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`
    );
    const data = await response.json();

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=43200"
    );
    res.status(200).json({ success: true, url: url, score: data });
  } catch (error) {
    res.status(400).json({ error: true, message: error as string });
  }
}
