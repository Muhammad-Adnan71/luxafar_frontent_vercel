import { parseISO } from "date-fns";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";
import {
  removeParaTagsFromString,
  replaceSpacesWithDash,
} from "@utils/functions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const url = process.env.NEXT_PUBLIC_API_URL as string;

  const feed = new Feed({
    title: "Luxafar-Re-Defining Luxury",
    description: "Luxafar-Re-Defining Luxury",
    id: url,
    link: url,
    language: "en",
    favicon: `${url}/favicon.ico`,
    copyright: "All rights reserved 2023, Luxafar",
    author: {
      name: "Luxafar",
      email: "no-reply@luxafar.com",
      link: url,
    },
  });
  body.forEach((post: any) => {
    const inspirationUrl = `${url}/${post?.seoMeta?.slug}`;
    feed.addItem({
      id: inspirationUrl,
      link: inspirationUrl,
      title: post.title,
      description: removeParaTagsFromString(post.description as string),
      date: parseISO(post.createdAt),
      author: [
        {
          name: "Luxafar",
          email: "no-reply@luxafar.com",
          link: url,
        },
      ],
    });
  });
  writeFileSync("./public/rss.xml", feed.rss2(), { encoding: "utf-8" });

  return new NextResponse(
    JSON.stringify({
      status: "success",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
