import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(request: NextRequest, { params }: any) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "/";
    const locale =
      request.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
    revalidatePath(path);
    const destinationNameForSearch = params?.params?.[0]?.replaceAll("-", " ");
    const nameForSearch = params?.params?.[1];
    const tourById = await prisma.tours.findFirstOrThrow({
      where: {
        isDeleted: false,
        seoMeta: {
          slug: nameForSearch,
        },
      },
      include: {
        seoMeta: true,
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
        highlights: {
          where: {
            // languages: {
            //   locale,
            // },
          },
          include: {
            media: true,
            HighlightsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        },
        dayToDayItinerary: {
          include: {
            DayToDayItineraryTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        },
        privatePlan: true,
        supplementPolicy: {
          include: {
            SupplementPolicyTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        },
        planService: {
          include: {
            planService: {
              include: {
                PlanServiceTranslation: {
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
        },
        accommodationImageMedia: true,
        bannerImageMedia: true,
      },
    });
    const [tours, inspirations, inspirationCount] = await prisma.$transaction([
      prisma.tours.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          NOT: {
            seoMeta: {
              slug: nameForSearch,
            },
          },
          tourDestinations: {
            some: {
              destination: {
                name: destinationNameForSearch,
              },
            },
          },
        },
        skip: 0,
        take: 2,
        include: {
          bannerImageMedia: true,
          seoMeta: true,
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
      }),
      prisma.inspirations.findMany({
        where: {
          isActive: true,
          isDeleted: false,

          destination: {
            some: {
              name: destinationNameForSearch,
            },
          },
        },
        skip: 0,
        take: 3,
        include: {
          media: true,
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
      }),
      prisma.inspirations.count({
        where: {
          isDeleted: false,
          isActive: true,
          destinationId: tourById?.tourDestinations[0].destinationId as number,
        },
      }),
    ]);

    const [
      bannerImageResponse,
      accommodationImageResponse,
      highlightsResponse,
      toursResponse,
      inspirationsResponse,
    ] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tourById, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById, "accommodationImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById?.highlights),
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
    ]);

    const planServiceResponse = await Promise.all(
      tourById?.planService.map(async (item: any) => {
        const planService = await convertMediaIdsResponseIntoMediaUrl(
          item?.planService
        );
        return {
          ...item,

          planService: {
            ...planService,
            ...planService.PlanServiceTranslation?.[0],
          },
        };
      })
    );
    return new NextResponse(
      JSON.stringify({
        data: {
          tour: {
            ...tourById,
            ...tourById.ToursTranslation?.[0],
            dayToDayItinerary: tourById.dayToDayItinerary.map((ele: any) => ({
              ...ele,
              ...ele.DayToDayItineraryTranslation?.[0],
            })),
            highlights: highlightsResponse.map((ele: any) => ({
              ...ele,
              ...ele.HighlightsTranslation?.[0],
            })),
            supplementPolicy: tourById.supplementPolicy.map((ele) => ({
              ...ele,
              ...ele.SupplementPolicyTranslation?.[0],
            })),
            planService: planServiceResponse,
            bannerImageMedia: bannerImageResponse.bannerImageMedia,
            accommodationImageMedia:
              accommodationImageResponse.accommodationImageMedia,
          },
          relatedTours: toursResponse.map((ele: any) => ({
            ...ele,
            ...ele.ToursTranslation?.[0],
          })),
          inspirations: inspirationsResponse.map((ele: any) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
          })),

          inspirationCount,
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
