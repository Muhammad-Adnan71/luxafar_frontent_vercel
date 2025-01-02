import { getErrorResponse } from "@utils/api-helpers";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const checkExistingSeason = await prisma.seasonToVisit.findMany({
      where: { destinationId: Number(body.destinationId) },
    });
    if (checkExistingSeason?.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Season is created with this destination",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const seasonResponse = body.seasonToVisit.map(async (element: any) => {
        const { destinationId, media, ...rest } = element;
        const languages = await prisma.languages.findMany({});

        const newSeason = await prisma.seasonToVisit.create({
          data: {
            ...rest,
            media: {
              create: media,
            },
            destination: { connect: { id: destinationId } },
          },
          include: {
            media: true,
          },
        });

        languages.forEach(async (lang) => {
          const {
            name,
            title,
            description,
            eventOccasions,
            period,
            temperature,
          } = rest;
          if (lang.locale !== "en") {
            const translateKeysObj = {
              name,
              title,
              description,
              eventOccasions,
              period,
              temperature,
            };
            await translateObj(
              translateKeysObj,
              "en",
              lang.locale,
              translateService
            );
            await prisma.seasonToVisitTranslation.create({
              data: {
                ...translateKeysObj,
                seasonToVisit: {
                  connect: { id: newSeason.id },
                },
                language: {
                  connect: {
                    id: lang.id,
                  },
                },
              },
            });
          } else {
            await prisma.seasonToVisitTranslation.create({
              data: {
                name,
                title,
                description,
                eventOccasions,
                period,
                temperature,
                seasonToVisit: {
                  connect: { id: newSeason.id },
                },
                language: {
                  connect: {
                    id: lang.id,
                  },
                },
              },
            });
          }
        });
      });

      return new NextResponse(
        JSON.stringify({
          data: seasonResponse,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const destinationCount = await prisma.destinations.count({
      where: {
        isDeleted: false,
        seasonToVisit: {
          some: { id: { not: undefined } },
        },

        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
          ],
        }),
      },
    });
    const destinationsWithSeasons = await prisma.destinations.findMany({
      include: { seasonToVisit: true },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),

      where: {
        isDeleted: false,
        ...(searchParams && {
          OR: [
            {
              name: {
                contains: searchParams,
              },
            },
          ],
        }),
        seasonToVisit: {
          some: { id: { not: undefined } },
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: destinationsWithSeasons,
        status: "success",
        count: destinationCount,
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
