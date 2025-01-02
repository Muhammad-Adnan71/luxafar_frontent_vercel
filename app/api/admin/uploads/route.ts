import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import NodeCache from "node-cache";

const s3 = new S3({
  signatureVersion: "v4",
  region: process.env.NEXT_PUBLIC_S3_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
});
const cache = new NodeCache({ stdTTL: 86400 });

export async function GET(req: Request) {
  const url = new URL(req.url);

  const fileType = url.searchParams.get("fileType");

  const ex = fileType?.split("/")[1];
  const key = `${randomUUID()}.${ex}`;
  const preSignedUrl = await s3.getSignedUrl("putObject", {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    ContentType: `images/${ex}`,
    Expires: 5 * 60,
  });

  return new NextResponse(
    JSON.stringify({
      url: preSignedUrl,
      key: key,
      status: "success",
    })
  );
}
export async function POST(req: Request) {
  const { media } = await req.json();
  const getSignedUrls = await Promise.all(
    Object.entries(media).map(async (item: any) => {
      if (item[1]) {
        const fileParams = {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
          Key: item[1],
          Expires: 60 * 60 * 24,
        };

        const cacheKey = `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}-${item[1]}`;
        const cachedUrl = cache.get(cacheKey);
        if (cachedUrl) {
          return { [item[0]]: cachedUrl };
        } else {
          const url = await s3.getSignedUrlPromise("getObject", fileParams);
          cache.set(cacheKey, url);
          return { [item[0]]: url };
        }
      } else return { [item[0]]: null };
    })
  );

  return new NextResponse(
    JSON.stringify({
      urls: getSignedUrls,
      status: "success",
    })
  );
}
