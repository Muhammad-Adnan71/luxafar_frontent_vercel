import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  request: NextRequest,
  { params }: { params: { destinationName: string; inspirationName: string } }
) {
  try {
    if (!params?.destinationName && !params?.inspirationName) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Destination Name and Inspiration Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const path = request.nextUrl.searchParams.get("path") || "/";
    const locale =
      request.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
    revalidatePath(path);
    const destinationName = params?.destinationName?.replaceAll("-", " ");
    const inspirationTitle = params?.inspirationName;
    const [inspiration, tours] = await prisma.$transaction(async (tx) => {
      const inspiration = await prisma.inspirations.findFirstOrThrow({
        where: {
          isActive: true,
          isDeleted: false,

          AND: [
            {
              seoMeta: {
                slug: {
                  contains: inspirationTitle,
                },
              },
            },
            {
              destination: { some: { name: destinationName } },
            },
          ],
        },
        include: {
          seoMeta: true,
          media: true,
          destination: true,
          holidayType: true,
          InspirationsTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
          inspirationDetail: {
            orderBy: [
              {
                sortId: "asc",
              },
              { id: "desc" },
            ],
            include: {
              media: true,
              InspirationDetailTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
          },
        },
      });
      const tours = await prisma.tours.findMany({
        where: {
          isActive: true,
          isDeleted: false,

          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          tourDestinations: {
            some: {
              destination: {
                name: {
                  contains: destinationName,
                },
              },
            },
          },
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
      return [inspiration, tours];
    });

    const [inspirationDetailResponse, tourResponse, inspirationResponse] =
      await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspiration.inspirationDetail),
        convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
        convertMediaIdsResponseIntoMediaUrl(inspiration),
      ]);
    return new NextResponse(
      JSON.stringify({
        data: {
          inspiration: {
            ...inspirationResponse,
            ...inspirationResponse.InspirationsTranslation?.[0],
            inspirationDetail: inspirationDetailResponse.map((item: any) => ({
              ...item,
              ...item.InspirationDetailTranslation?.[0],
            })),
          },

          tours: tourResponse.map((item: any) => {
            const { tourDestinations, ToursTranslation, ...rest } = item;
            return {
              ...rest,
              ...ToursTranslation?.[0],
              destination: tourDestinations[0].destination,
            };
          }),
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
