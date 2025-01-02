import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Holiday type name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const path = req.nextUrl.searchParams.get("path") || "/";
  const locale = req.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  revalidatePath(path);
  try {
    const [holidayType, tours, inspirations] = await prisma.$transaction(
      async (tx) => {
        const holidayType = await tx.holidayType.findFirstOrThrow({
          where: {
            isActive: true,
            seoMeta: {
              slug: params.name,
            },
          },
          include: {
            HolidayTypeTranslation: { 
              where: {
                language: {
                  locale,
                },
              },
            },
            media: true,
            seoMeta: true,
            highlights: {
              include: {
                HighlightsTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
                media: true,
              },
            },
          },
        });
        const tours = await tx.tours.findMany({
          where: {
            isActive: true,
            isDeleted: false,

            AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
            tourHoliDayType: {
              some: {
                holidayType: {
                  id: holidayType.id,
                },
              },
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 2,
          include: {
            seoMeta: true,
            bannerImageMedia: true,
            ToursTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
            tourDestinations: {
              include: {
                destination: true,
              },
            },
          },
        });
        const inspirations = await tx.inspirations.findMany({
          where: {
            isActive: true,
            isDeleted: false,

            holidayType: {
              some: {
                id: holidayType.id,
              },
            },
          },
          take: 3,
          orderBy: {
            id: "desc",
          },
          include: {
            seoMeta: true,
            destination: true,
            media: true,
            InspirationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        });

        return [holidayType, tours, inspirations];
      }
    );

    const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(holidayType);
    const [highlights, toursResponse, inspirationsResponse] = await Promise.all(
      [
        convertMediaIdsResponseIntoMediaUrl(holidayType?.highlights),
        convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
      ]
    );

    return new NextResponse(
      JSON.stringify({
        data: {
          holidayType: {
            ...holidayType,
            ...holidayType.HolidayTypeTranslation?.[0],
            highlights: highlights.map((ele: any) => ({
              ...ele,
              ...ele.HighlightsTranslation?.[0],
            })),
            media: {
              ...holidayType?.media,
              ...mediaUrls.media,
            },
          },
          tours: toursResponse.map((item: any) => {
            const { tourDestinations, ToursTranslation, ...rest } = item;
            return {
              ...rest,
              ...ToursTranslation?.[0],
              destination: tourDestinations[0].destination,
            };
          }),
          inspirations: inspirationsResponse.map((ele: any) => ({
              ...ele,
              ...ele.InspirationsTranslation?.[0],
            })),
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
