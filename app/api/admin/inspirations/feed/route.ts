import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { MediaResponse } from "@utils/types";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { i18n } from "i18n.config";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  try {
    const inspirations = await prisma.inspirations.findMany({
      take: 20,
      where: {
        isActive: true,
        isDeleted: false,
      },
      include: {
        destination: true,
        inspirationDetail: true,
        media: { select: { mobileMediaUrl: true } },
        seoMeta: true,
      },
      orderBy: {
        id: "desc",
      },
    });
    const inspirationsResponse = await Promise.all(
      inspirations.map(async (inspiration: any) => {
        const inspirationMediaUrl = await getUploadsUrl({
          mobileMediaUrl: inspiration?.media?.mobileMediaUrl,
        });

        return {
          ...inspiration,
          media: {
            ...inspiration?.media,
            mobileMediaUrl: inspirationMediaUrl?.data[0]?.mobileMediaUrl,
          },
        };
      })
    );
    return new NextResponse(
      JSON.stringify({
        data: inspirationsResponse,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
