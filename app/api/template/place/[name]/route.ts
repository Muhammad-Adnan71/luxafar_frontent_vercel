import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const locale =
    request.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  revalidatePath(path);
  try {
    const place = await prisma.placeToVisit.findFirstOrThrow({
      where: {
        isDeleted: false,
        isActive: true,
        seoMeta: {
          slug: params?.name,
        },
      },
      include: {
        seoMeta: true,
        PlaceToVisitTranslation: {
          where: {
            language: {
              locale,
            },
          },
        },
        destination: {
          include: {
            DestinationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
            content: {
              include: {
                ContentTranslation: {
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
        media: true,
        reviews: {
          include: {
            media: true,
          },
        },
        attraction: {
          include: {
            media: true,
            AttractionTranslation: {
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

    const [tours, inspirations, inspirationsCount, places] =
      await prisma.$transaction([
        prisma.tours.findMany({
          where: {
            isActive: true,
            isDeleted: false,
            AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
            tourDestinations: {
              some: {
                destination: {
                  id: place?.destinationId,
                },
              },
            },
          },
          take: 2,
          orderBy: {
            id: "desc",
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
            // destination: true,
            seoMeta: true,
            tourDestinations: {
              include: {
                destination: true,
              },
            },
          },
        }),
        prisma.inspirations.findMany({
          where: {
            isDeleted: false,
            destination: {
              some: {
                id: place?.destinationId,
              },
            },
            isActive: true,
          },
          take: 3,
          orderBy: {
            id: "desc",
          },
          include: {
            InspirationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
            seoMeta: true,
            destination: true,
            media: true,
          },
        }),
        prisma.inspirations.count({
          where: {
            isDeleted: false,
            destination: {
              some: {
                id: place?.destinationId,
              },
            },
            isActive: true,
          },
        }),
        prisma.placeToVisit.findMany({
          where: {
            isDeleted: false,
            isActive: true,
            destinationId: place?.destinationId,
            seoMeta: {
              slug: {
                not: params?.name,
              },
            },
          },

          take: 3,
          include: {
            seoMeta: true,
            media: true,
            destination: true,
            PlaceToVisitTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        }),
      ]);

    const [
      placeResponse,
      attractionsResponse,
      reviewsResponse,
      toursResponse,
      inspirationsResponse,
      placesResponse,
      placeContentResponse,
    ]: any = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(place),
      convertMediaIdsResponseIntoMediaUrl(place?.attraction),
      convertMediaIdsResponseIntoMediaUrl(place?.reviews),
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
      convertMediaIdsResponseIntoMediaUrl(places),
      convertMediaIdsResponseIntoMediaUrl(place.destination?.content),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          place: {
            ...placeResponse,
            ...placeResponse.PlaceToVisitTranslation?.[0],
            destination: {
              ...place.destination,
              ...place.destination?.DestinationsTranslation?.[0],

              content: placeContentResponse.map((ele: any) => ({
                ...ele,
                ...ele.ContentTranslation?.[0],
              })),
            },
            reviews: reviewsResponse,
            attraction: attractionsResponse.map((ele: any) => ({
              ...ele,
              ...ele.AttractionTranslation?.[0],
            })),
          },
          recommendedTours: toursResponse.map((ele: any) => ({
            ...ele,
            ...ele.ToursTranslation?.[0],
          })),
          inspirations: inspirationsResponse.map((ele: any) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
          })),
          places: placesResponse.map((ele: any) => ({
            ...ele,
            ...ele.PlaceToVisitTranslation?.[0],
          })),
          inspirationsCount,
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
