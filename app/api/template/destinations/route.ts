import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { i18n } from "i18n.config";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  const locale = req.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  revalidatePath(path);

  try {
    const destinations = await prisma.destinations.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      include: {
        DestinationsTranslation: {
          where: {
            language: {
              locale,
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: destinations.map((ele) => ({
          ...ele,
          description: ele.DestinationsTranslation?.[0]?.description,
        })),
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
