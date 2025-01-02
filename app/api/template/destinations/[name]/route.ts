import { languages } from "@utils/constant";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { i18n } from "i18n.config";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  const locale = req.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  revalidatePath(path);

  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Destination name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const destinationExists = await prisma.destinations.findFirstOrThrow({
      where: {
        isActive: true,
        isDeleted: false,
        name: params?.name?.toLowerCase()?.replaceAll("-", " "),
      },
      include: {
        placeToVisit: true,
      },
    });
    if (destinationExists.placeToVisit.length) {
      const [destination, holidayTypes] = await prisma.$transaction([
        prisma.destinations.findFirstOrThrow({
          where: {
            isActive: true,
            isDeleted: false,
            id: Number(destinationExists?.id),
          },
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
            seoMeta: true,
            tourDestinations: {
              where: {
                tour: {
                  isActive: true,
                  isDeleted: false,
                  AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
                  tourDestinations: {
                    some: {
                      destination: {
                        id: Number(destinationExists?.id),
                      },
                    },
                  },
                },
              },
              include: {
                destination: true,

                tour: {
                  include: {
                    ToursTranslation: {
                      where: {
                        language: {
                          locale,
                        },
                      },
                    },
                    bannerImageMedia: true,
                    accommodationImageMedia: true,
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
                    seoMeta: true,
                  },
                },
              },
            },
            thingsToDo: {
              orderBy: {
                sortId: "asc",
              },
              where: {
                isDeleted: false,
                isActive: true,
                destinationId: Number(destinationExists?.id),
              },
              include: {
                media: true,
                ThingsToDoTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
              },
            },
            Testimonial: {
              orderBy: {
                destinationSortId: "asc",
              },
              where: {
                isDeleted: false,
                isActive: true,
                destinationId: Number(destinationExists?.id),
              },
              include: {
                clientImageMedia: true,
                destinationImageMedia: true,
                TestimonialTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
              },
            },
            seasonToVisit: {
              where: {
                destinationId: Number(destinationExists?.id),
              },
              include: {
                destination: true,
                media: true,
                SeasonToVisitTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
              },
            },
            placeToVisit: {
              orderBy: {
                sortId: "asc",
              },
              where: {
                isDeleted: false,
                destinationId: Number(destinationExists?.id),
                isActive: true,
              },
              include: {
                destination: true,
                seoMeta: true,
                media: true,
                PlaceToVisitTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
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
            },
            inspirations: {
              where: {
                isDeleted: false,
                isActive: true,

                destination: {
                  some: {
                    id: destinationExists.id,
                  },
                },
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
                media: true,
                destination: true,
              },
            },
            destinationFeatureOffered: {
              where: {
                destinationId: Number(destinationExists?.id),
              },
              include: {
                DestinationFeatureOfferedTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
                destinationFeatures: {
                  include: {
                    DestinationFeaturesTranslation: {
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
            gallery: {
              where: { destinationId: Number(destinationExists?.id) },
              include: {
                media: true,
              },
            },
          },
        }),
        prisma.holidayType.findMany({
          where: {
            isActive: true,
          },
          include: {
            media: true,
            seoMeta: true,
            HolidayTypeTranslation: {
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
        content,
        thingsToDo,
        seasonToVisit,
        placeToVisit,
        inspirations,
        gallery,
        holidayTypesResponse,
        testimonial,
      ] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(destination.content),
        convertMediaIdsResponseIntoMediaUrl(destination.thingsToDo),
        convertMediaIdsResponseIntoMediaUrl(destination?.seasonToVisit),
        convertMediaIdsResponseIntoMediaUrl(destination?.placeToVisit),
        convertMediaIdsResponseIntoMediaUrl(destination?.inspirations),
        convertMediaIdsResponseIntoMediaUrl(destination?.gallery),
        convertMediaIdsResponseIntoMediaUrl(holidayTypes),
        convertMediaIdsResponseIntoMediaUrl(destination?.Testimonial, [
          "clientImageMedia",
          "destinationImageMedia",
        ]),
      ]);
      const destinationTours = destination.tourDestinations
        .map((item: any) => {
          return {
            ...item.tour,
            destination: item.destination,
          };
        })
        .sort((a: any, b: any) => a.sortId - b.sortId);
      const tours = await convertMediaIdsResponseIntoMediaUrl(
        destinationTours,
        ["bannerImageMedia"]
      );

      const destinationFeaturesResponse = await Promise.all(
        destination.destinationFeatureOffered.map(async (item: any) => {
          const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(
            item.destinationFeatures
          );
          return { ...item, destinationFeatures: mediaUrls };
        })
      );

      return new NextResponse(
        JSON.stringify({
          data: {
            destination: {
              ...destination,
              ...destination.DestinationsTranslation?.[0],
              destinationFeatureOffered: destinationFeaturesResponse.map(
                (ele) => ({
                  ...ele,
                  ...ele.DestinationFeatureOfferedTranslation?.[0],
                  destinationFeatures: {
                    ...ele.destinationFeatures,
                    ...ele.destinationFeatures
                      .DestinationFeaturesTranslation?.[0],
                  },
                })
              ),
              content: content.map((ele: any) => ({
                ...ele,
                ...ele.ContentTranslation?.[0],
              })),
              tours: tours.map((ele: any) => ({
                ...ele,
                ...ele.ToursTranslation?.[0],
              })),
              thingsToDo: thingsToDo.map((ele: any) => ({
                ...ele,
                ...ele.ThingsToDoTranslation?.[0],
              })),
              testimonial: testimonial.map((ele: any) => ({
                ...ele,
                ...ele.TestimonialTranslation?.[0],
              })),
              seasonToVisit: seasonToVisit.map((ele: any) => ({
                ...ele,
                ...ele.SeasonToVisitTranslation?.[0],
              })),
              placeToVisit: placeToVisit.map((ele: any) => ({
                ...ele,
                ...ele.PlaceToVisitTranslation?.[0],
              })),
              inspirations: inspirations.map((ele: any) => ({
                ...ele,
                ...ele.InspirationsTranslation?.[0],
              })),
              gallery,
            },
            holidayTypes: holidayTypesResponse.map((ele: any) => ({
              ...ele,
              ...ele.HolidayTypeTranslation?.[0],
            })),
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return getErrorResponse(500, "Destination has no tours");
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
