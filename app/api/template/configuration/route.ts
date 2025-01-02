import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    const locale =
      request.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
    revalidatePath(path);

    const [destinations, inspirations, configuration] =
      await prisma.$transaction([
        prisma.destinations.findMany({
          where: {
            isActive: true,
            isDeleted: false,
          },
          include: {
            seoMeta: true,
            DestinationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
            placeToVisit: {
              where: {
                isActive: true,
                isDeleted: false,
              },
            },
          },
        }),
        prisma.inspirations.findMany({
          where: {
            isActive: true,
            isDeleted: false,
          },
          include: {
            destination: true,
            seoMeta: true,
            InspirationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 3,
        }),
        prisma.configuration.findFirst({
          include: {
            media: true,
            ConfigurationTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        }),
      ]);

    const configurationResponse = await convertMediaIdsResponseIntoMediaUrl(
      configuration
    );
    return new NextResponse(
      JSON.stringify({
        data: {
          destinations: destinations.map((ele) => ({
            ...ele,
            ...ele.DestinationsTranslation?.[0],
          })),
          inspirations: inspirations.map((ele) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
          })),
          configuration: {
            ...configurationResponse,
            ...configuration?.ConfigurationTranslation?.[0],
          },
        },
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
