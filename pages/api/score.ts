import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

const isUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

export default async function handler(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !isUrl(url)) {
    return new Response(
      JSON.stringify({ error: true, message: "Please add a valid URL" }),
      { status: 400 }
    );
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

    return new Response(
      JSON.stringify({
        success: true,
        url: url,
        lighthouse: data.lighthouseResult.categories,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "cache-control":
            "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Something went Wrong",
        desc: error,
      }),
      { status: 400 }
    );
  }
}
