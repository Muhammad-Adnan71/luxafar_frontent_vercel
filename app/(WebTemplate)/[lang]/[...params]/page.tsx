import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetAllBecomePartnerQuestionTemplate } from "@utils/services/becomePartner";
import {
  apiTemplateCaughtAllRoutes,
  apiTemplateCaughtAllRoutesSeo,
} from "@utils/services/caughtAllRoute";
import { Locale, i18n } from "i18n.config";
import React from "react";
import DestinationComponent from "../destination/components/destinationComponent";
import DestinationPage from "../destination/components/destinationPage";
import TourPage from "../destination/components/tourPage";
import InspirationDetailPage from "../inspirations/components/inspirationDetailPage";
import PlacePage from "../destination/components/placePage";
import { Metadata } from "next";
import { apiGetDestinationSeoMeta } from "@utils/services/seoMeta";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@utils/prisma";
import { getErrorResponse } from "@utils/api-helpers";

export const dynamic = "force-static";
export const revalidate = false;
type PageProps = {
  params: {
    lang: string;
    params: string[];
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata | undefined> {
  const { lang, params: routeParams } = await params;
  const slugParam = routeParams[0];
  let response = null;

  try {
    const route = await prisma.caughtAllRoutes.findFirst({
      where: {
        OR: [
          {
            destinations: {
              seoMeta: {
                slug: slugParam,
              },
            },
          },
          {
            inspirations: {
              seoMeta: {
                slug: slugParam,
              },
            },
          },
          {
            placeToVisit: {
              seoMeta: {
                slug: slugParam,
              },
            },
          },
          {
            tours: {
              seoMeta: {
                slug: slugParam,
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
      const destination = await prisma.destinations
        .findFirstOrThrow({
          where: {
            isActive: true,
            seoMeta: {
              slug: slugParam,
            },
          },
          include: {
            content: {
              include: {
                media: true,
              },
            },
            seoMeta: true,
          },
        })
        .catch((err: any): undefined => {
          return undefined; // Return undefined instead of NextResponse
        });

      response = {
        data: {
          layout: "destination",
          destination,
        },
      };

      // const {
      //   seoMeta: { description, title, keywords, slug },
      // } = response?.data?.destination.seoMeta?.description;
      const title = response?.data?.destination.seoMeta?.title;
      const keywords = response?.data?.destination.seoMeta?.keywords;
      const description = response?.data?.destination.seoMeta?.description;
      const slug = response?.data?.destination.seoMeta?.slug;
      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (route?.layout === "tour") {
      const tourById = await prisma.tours
        .findFirstOrThrow({
          where: {
            isDeleted: false,
            seoMeta: {
              slug: slugParam,
            },
          },
          include: {
            seoMeta: true,
          },
        })
        .catch((err: any): undefined => {
          return undefined; // Return undefined instead of NextResponse
        });

      response = {
        data: {
          layout: "tour",
          tour: tourById,
        },
      };

      const title = response?.data?.tour.seoMeta?.title;
      const keywords = response?.data?.tour.seoMeta?.keywords;
      const description = response?.data?.tour.seoMeta?.description;
      const slug = response?.data?.tour.seoMeta?.slug;

      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (route?.layout === "inspiration") {
      const inspiration = await prisma.inspirations
        .findFirstOrThrow({
          where: {
            isActive: true,
            isDeleted: false,
            AND: [
              {
                seoMeta: {
                  slug: {
                    contains: slugParam,
                  },
                },
              },
            ],
          },
          include: {
            seoMeta: true,
            media: true,
            destination: true,
            inspirationDetail: {
              orderBy: [
                {
                  sortId: "asc",
                },
                { id: "desc" },
              ],
              include: {
                media: true,
              },
            },
          },
        })
        .catch((err: any): undefined => {
          return undefined; // Return undefined instead of NextResponse
        });

      response = {
        data: {
          layout: "inspiration",
          inspiration,
        },
      };

      const title = response?.data?.inspiration.seoMeta?.title;
      const keywords = response?.data?.inspiration.seoMeta?.keywords;
      const description = response?.data?.inspiration.seoMeta?.description;
      const slug = response?.data?.inspiration.seoMeta?.slug;

      const metaDescription = removeParaTagsFromString(description as string);

      return {
        title: capitalizeFirstLetter(title) + " " + "- Luxafar",
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: capitalizeFirstLetter(title) + " " + "- Luxafar",
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    } else if (route?.layout === "place") {
      const placeById = await prisma.placeToVisit
        .findFirstOrThrow({
          where: {
            isDeleted: false,
            seoMeta: {
              slug: slugParam,
            },
          },
          include: {
            seoMeta: true,
          },
        })
        .catch((err: any): undefined => {
          return undefined; // Return undefined instead of NextResponse
        });

      response = {
        data: {
          layout: "place",
          place: placeById,
        },
      };

      const title = response?.data?.place.seoMeta?.title;
      const keywords = response?.data?.place.seoMeta?.keywords;
      const description = response?.data?.place.seoMeta?.description;
      const slug = response?.data?.place.seoMeta?.slug;

      const metaDescription = removeParaTagsFromString(description as string);
      return {
        title: `${capitalizeFirstLetter(title)} - Luxafar`,
        description: metaDescription,
        keywords: keywords,
        alternates: {
          canonical: lang === "en" ? `/${slug}` : `/${lang}/${slug}`,
          // languages: {
          //   "en-US": `/${slug}`,
          //   fr: `/fr/${slug}`,
          //   it: `/it/${slug}`,
          //   es: `/es/${slug}`,
          //   ru: `/ru/${slug}`,
          //   zh: `/zh/${slug}`,
          // },
        },
        openGraph: {
          title: `${capitalizeFirstLetter(title)} - Luxafar`,
          url: `/${slug}`,
          images: "/template/logo.png",
          description: metaDescription,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return notFound();
  }
}

async function page({ params }: PageProps) {
  const { lang, params: routeParams } = await params;
  const slug = routeParams[0];
  let response = null;

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
        const destination = await prisma.destinations.findFirstOrThrow({
          where: {
            isActive: true,
            isDeleted: false,
            id: Number(destinationExists?.id),
          },
          include: {
            DestinationsTranslation: {
              where: {
                language: {
                  locale: lang,
                },
              },
            },
            content: {
              include: {
                ContentTranslation: {
                  where: {
                    language: {
                      locale: lang,
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
                          locale: lang,
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
                              locale: lang,
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
                      locale: lang,
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
                      locale: lang,
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
                      locale: lang,
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
                      locale: lang,
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
                          locale: lang,
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
                      locale: lang,
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
                      locale: lang,
                    },
                  },
                },
                destinationFeatures: {
                  include: {
                    DestinationFeaturesTranslation: {
                      where: {
                        language: {
                          locale: lang,
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
        });

        const holidayTypes = await prisma.holidayType.findMany({
          where: {
            isActive: true,
          },
          include: {
            media: true,
            seoMeta: true,
            HolidayTypeTranslation: {
              where: {
                language: {
                  locale: lang,
                },
              },
            },
          },
        });

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
        response = {
          data: {
            layout: route?.layout,
            destination: {
              ...destination,
              ...destination.DestinationsTranslation?.[0],
              destinationFeatureOffered: destinationFeaturesResponse.map(
                (ele: any) => ({
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
        };
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
                locale: lang,
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
                    locale: lang,
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
                    locale: lang,
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
                    locale: lang,
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
                        locale: lang,
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
      // const [tours, inspirations, inspirationCount]
      const tours = await prisma.tours.findMany({
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
                locale: lang,
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

      const inspirations = await prisma.inspirations.findMany({
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
                locale: lang,
              },
            },
          },
        },
      });

      const inspirationCount = await prisma.inspirations.count({
        where: {
          isDeleted: false,
          isActive: true,
          destinationId: tourById?.tourDestinations[0]?.destinationId || 0, // Default to 0 if destinationId is undefined
        },
      });

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
      response = {
        data: {
          layout: route?.layout,
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
      };
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
                locale: lang,
              },
            },
          },
          destination: {
            include: {
              DestinationsTranslation: {
                where: {
                  language: {
                    locale: lang,
                  },
                },
              },
              content: {
                include: {
                  ContentTranslation: {
                    where: {
                      language: {
                        locale: lang,
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
                    locale: lang,
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
                locale: lang,
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
      });

      const inspirations = await prisma.inspirations.findMany({
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
                locale: lang,
              },
            },
          },
          seoMeta: true,
          destination: true,
          media: true,
        },
      });

      const inspirationsCount = await prisma.inspirations.count({
        where: {
          isDeleted: false,
          destination: {
            some: {
              id: place?.destinationId,
            },
          },
          isActive: true,
        },
      });

      const places = await prisma.placeToVisit.findMany({
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
                locale: lang,
              },
            },
          },
        },
      });

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

      response = {
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
      };
    } catch (error: any) {
      return getErrorResponse(500, error.message);
    }
  } else if (route?.layout === "inspiration") {
    try {
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
                locale: lang,
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
                    locale: lang,
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
                locale: lang,
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

      const [inspirationDetailResponse, tourResponse, inspirationResponse] =
        await Promise.all([
          convertMediaIdsResponseIntoMediaUrl(inspiration.inspirationDetail),
          convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
          convertMediaIdsResponseIntoMediaUrl(inspiration),
        ]);
      response = {
        data: {
          layout: route?.layout,
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
      };
    } catch (error: any) {
      return getErrorResponse(500, error.message);
    }
  }

  const layout: Record<string, React.ReactNode> = {
    destination: <DestinationPage response={response} locale={lang} />,
    tour: (
      <TourPage
        locale={lang}
        name={""}
        tourResponse={response}
        destinationNameString={""}
      />
    ),
    inspiration: (
      <InspirationDetailPage
        inspiration={response?.data?.inspiration}
        tours={response?.data?.tours}
        params={{ destinationName: "", inspirationName: "", lang }}
        locale={lang}
      />
    ),
    place: (
      <PlacePage locale={lang} response={response} destinationNameString={""} />
    ),
  };
  console.log(`Generating ${slug} page`);
  try {
    if (response?.data?.layout) {
      return <>{layout[response.data.layout]}</>;
    }
    return notFound();
  } catch (error) {
    console.error("Error generating page:", error);
    return notFound(); // Optionally handle unexpected errors gracefully
  }
}

export default page;

export async function generateStaticParams() {
  // Get all supported languages
  const languages = await prisma.languages.findMany({});

  // Get all possible routes that need to be pre-rendered
  const destinations = await prisma.destinations.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      isActive: true,
      isDeleted: false,
      placeToVisit: {
        some: {
          isActive: true,
          isDeleted: false,
        },
      },
    },
  });
  const tours = await prisma.tours.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      isActive: true,
      isDeleted: false,
    },
  });
  const inspirations = await prisma.inspirations.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      isActive: true,
      isDeleted: false,
    },
  });
  const places = await prisma.placeToVisit.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      isActive: true,
      isDeleted: false,
    },
  });

  // Create an array of all possible route combinations
  const params = [];

  for (const language of languages) {
    // For destinations
    for (const destination of destinations) {
      if (destination.seoMeta?.slug) {
        params.push({
          lang: language.locale,
          params: [destination.seoMeta.slug], // Note: params must be an array for catch-all routes
        });
      }
    }

    // For tours
    for (const tour of tours) {
      if (tour.seoMeta?.slug) {
        params.push({
          lang: language.locale,
          params: [tour.seoMeta.slug],
        });
      }
    }

    // For inspirations
    for (const inspiration of inspirations) {
      if (inspiration.seoMeta?.slug) {
        params.push({
          lang: language.locale,
          params: [inspiration.seoMeta.slug],
        });
      }
    }

    // For places
    for (const place of places) {
      if (place.seoMeta?.slug) {
        params.push({
          lang: language.locale,
          params: [place.seoMeta.slug],
        });
      }
    }
  }

  return params;
}
