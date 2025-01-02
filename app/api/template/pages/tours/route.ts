import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const destinationId = url.searchParams.get("destinationId");
  const holidayTypeId = url.searchParams.get("holidayTypeId");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const path = request.nextUrl.searchParams.get("path") || "/";
  const locale =
    request.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  try {
    revalidatePath(path);

    const [
      toursCount,
      tours,
      featuredTours,
      upcomingTours,
      page,
      inspirations,
      bespokeQuestion,
    ] = await prisma.$transaction([
      prisma.tours.count({
        where: {
          isActive: true,
          isDeleted: false,

          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),

          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },
      }),
      prisma.tours.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        where: {
          isActive: true,

          isDeleted: false,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),
          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },

        orderBy: {
          sortId: "desc",
        },

        include: {
          ToursTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
          bannerImageMedia: true,
          tourDestinations: {
            include: {
              destination: true,
            },
          },
          seoMeta: true,
        },
      }),
      prisma.tours.findMany({
        where: {
          isFeatured: true,
          isDeleted: false,
          isActive: true,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
        },
        include: {
          bannerImageMedia: true,
          tourDestinations: {
            include: {
              destination: true,
            },
          },
          ToursTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
          seoMeta: true,
        },
      }),
      prisma.tours.findMany({
        where: {
          OR: [{ price: null }, { price: { lte: 0 } }],
          isDeleted: false,
          isActive: true,
        },
        include: {
          bannerImageMedia: true,
          tourDestinations: true,
          seoMeta: true,
          ToursTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
        },
      }),
      prisma.pages.findFirst({
        where: {
          name: "tours",
        },
        include: {
          seoMeta: true,
          content: {
            include: {
              media: true,
              ContentTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
          },
        },
      }),
      prisma.inspirations.findMany({
        skip: 0,
        take: 3,
        where: {
          isActive: true,
          isDeleted: false,
        },

        orderBy: {
          inspirationSortId: "desc",
        },

        include: {
          InspirationsTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
          media: true,
          destination: true,
          seoMeta: true,
          inspirationDetail: {
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
      }),
      prisma.bespokeQuestion.findMany({
        where: {
          formType: "bespoke",
        },
        include: {
          BespokeQuestionTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
          bespokeQuestionOptions: {
            include: {
              BespokeQuestionOptionsTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
          },
        },
      }),
    ]);
    const [
      toursResponse,
      featuredToursResponse,
      upcomingToursResponse,
      contentResponse,
      inspirationsResponse,
    ] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(featuredTours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(upcomingTours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(page?.content),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
    ]);
    // console.log(page?.content[1], "contentResponse");
    return new NextResponse(
      JSON.stringify({
        data: {
          page: {
            ...page,
            content: contentResponse.map((ele: any) => ({
              ...ele,
              ...ele.ContentTranslation?.[0],
            })),
          },
          count: toursCount,
          tours: toursResponse.map((item: any) => ({
            ...item,
            ...item.ToursTranslation?.[0],
            destination: item.tourDestinations?.[0]?.destination,
          })),

          featuredTours: featuredToursResponse.map((ele: any) => ({
            ...ele,
            ...ele.ToursTranslation?.[0],
          })),
          upcomingTours: upcomingToursResponse.map((ele: any) => ({
            ...ele,
            ...ele.ToursTranslation?.[0],
          })),
          inspirations: inspirationsResponse.map((ele: any) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
            inspirationDetail: ele.inspirationDetail.map((item: any) => ({
              ...item,
              ...item.InspirationDetailTranslation?.[0],
            })),
          })),
          bespokeQuestion: bespokeQuestion.map((ele) => ({
            ...ele,
            ...ele.BespokeQuestionTranslation[0],
            bespokeQuestionOptions: ele.bespokeQuestionOptions.map((item) => ({
              ...item,
              ...item.BespokeQuestionOptionsTranslation[0],
            })),
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
