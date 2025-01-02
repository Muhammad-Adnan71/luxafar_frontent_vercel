import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || i18n.defaultLocale;
  try {
    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Page slug is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    const route = await prisma.caughtAllRoutes.findFirst({
      where: {
        OR: [
          {
            destinations: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            inspirations: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            placeToVisit: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            tours: {
              seoMeta: {
                slug: slug,
              },
            },
          },
        ],
      },
      include: {
        destinations: true,
        inspirations: true,
        placeToVisit: true,
        tours: true,
      },
    });
    if (route?.layout === "destination") {
      try {
        const destinationExists = await prisma.destinations.findFirstOrThrow({
          where: {
            isActive: true,
            isDeleted: false,
            caughtAllRouteId: route.id,
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
                layout: route?.layout,
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
    } else if (route?.layout === "tour") {
      try {
        const tourById = await prisma.tours.findFirstOrThrow({
          where: {
            isDeleted: false,
            seoMeta: {
              slug: slug,
            },
          },
          include: {
            seoMeta: true,
            tourHoliDayType: {
              include: {
                holidayType: true,
              },
            },
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
        const [tours, inspirations, inspirationCount] =
          await prisma.$transaction([
            prisma.tours.findMany({
              where: {
                isActive: true,
                isDeleted: false,
                AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
                NOT: {
                  seoMeta: {
                    slug: slug,
                  },
                },
                tourDestinations: {
                  some: {
                    destination: {
                      name: tourById.tourDestinations[0].destination.name,
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
                    name: tourById.tourDestinations[0].destination.name,
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
                destinationId: tourById?.tourDestinations[0]
                  .destinationId as number,
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
          convertMediaIdsResponseIntoMediaUrl(
            tourById,
            "accommodationImageMedia"
          ),
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
              layout: route?.layout,
              tour: {
                ...tourById,
                ...tourById.ToursTranslation?.[0],
                dayToDayItinerary: tourById.dayToDayItinerary.map(
                  (ele: any) => ({
                    ...ele,
                    ...ele.DayToDayItineraryTranslation?.[0],
                  })
                ),
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
    } else if (route?.layout === "place") {
      try {
        const place = await prisma.placeToVisit.findFirstOrThrow({
          where: {
            isDeleted: false,
            isActive: true,
            seoMeta: {
              slug: slug,
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
                    not: slug,
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
              layout: route?.layout,
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
    } else if (route?.layout === "inspiration") {
      try {
        const [inspiration, tours] = await prisma.$transaction(async (tx) => {
          const inspiration = await prisma.inspirations.findFirstOrThrow({
            where: {
              isActive: true,
              isDeleted: false,

              AND: [
                {
                  seoMeta: {
                    slug: {
                      contains: slug,
                    },
                  },
                },
              ],
            },
            include: {
              seoMeta: true,
              media: true,
              holidayType: true,
              destination: true,
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
              layout: route?.layout,
              inspiration: {
                ...inspirationResponse,
                ...inspirationResponse.InspirationsTranslation?.[0],
                inspirationDetail: inspirationDetailResponse.map(
                  (item: any) => ({
                    ...item,
                    ...item.InspirationDetailTranslation?.[0],
                  })
                ),
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
    return new NextResponse(
      JSON.stringify({
        message: "Slug not found",
        status: "Error",
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
