import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { MediaResponse } from "@utils/types";
import {
  convertMediaIdsResponseIntoMediaUrl,
  isNumeric,
} from "@utils/functions";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import {
  getDifferentValues,
  translateObj,
  translateService,
} from "@utils/translate";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const tourById = await prisma.tours.findFirst({
      where: {
        id: id,
      },
      include: {
        seoMeta: true,
        highlights: {
          include: {
            media: true,
          },
        },
        dayToDayItinerary: true,
        privatePlan: true,
        supplementPolicy: true,
        planService: {
          include: {
            planService: true,
          },
        },
        tourDestinations: {
          include: {
            destination: true,
          },
        },
        tourHoliDayType: {
          include: {
            holidayType: true,
          },
        },
        accommodationImageMedia: true,
        bannerImageMedia: true,
      },
    });

    const [
      bannerImageMediaResponse,
      accommodationImageMediaResponse,
      highlightsResponse,
    ] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tourById, "bannerImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById, "accommodationImageMedia"),
      convertMediaIdsResponseIntoMediaUrl(tourById?.highlights),
    ]);
    // let highlightsResponse;

    // if (tourById?.highlights) {
    //   highlightsResponse = await Promise.all(
    //     tourById?.highlights.map(async (highlight: any) => {
    //       const highlightResponse = await convertMediaIdsResponseIntoMediaUrl(
    //         highlight
    //       );
    //       return {
    //         ...highlightResponse,
    //       };
    //     })
    //   );
    // }

    return new NextResponse(
      JSON.stringify({
        data: {
          ...tourById,
          highlights: highlightsResponse,
          bannerImageMedia: bannerImageMediaResponse.bannerImageMedia,
          accommodationImageMedia:
            accommodationImageMediaResponse.accommodationImageMedia,
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

// this route needs to refactor
export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const languages = await prisma.languages.findMany({});

    if (id) {
      if (
        body.highlights?.length ||
        body.dayToDayItinerary?.length ||
        body.privatePlan?.length ||
        body.supplementPolicy?.length
      ) {
        const {
          highlights,
          dayToDayItinerary,
          privatePlan,
          supplementPolicy,
          planService,
          accommodationImageMedia,
          bannerImageMedia,
          destinationId,
          bannerImageId,
          accommodationImageId,
          holidayTypeId,
          id,
          destinations,
          caughtAllRouteId,
          holidayType,
          seoMeta,
          seoMetaId,
          ...rest
        } = body;

        const highlightsDB = await prisma.highlights.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const highlightIds = highlights.map((item: any) => item.id);

        const deleteHighlightIds = highlightsDB
          .filter((item: any) => !highlightIds.includes(item.id))
          .map((item) => item.id);

        const dayToDayItineraryDB = await prisma.dayToDayItinerary.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const dayToDayItineraryIds = dayToDayItinerary.map(
          (item: any) => item.id
        );

        const deleteDayToDayItineraryIds = dayToDayItineraryDB
          .filter((item: any) => !dayToDayItineraryIds.includes(item.id))
          .map((item) => item.id);

        const privatePlanDB = await prisma.privatePlan.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const privatePlanIds = privatePlan.map((item: any) => item.id);

        const deletePrivatePlanIds = privatePlanDB
          .filter((item: any) => !privatePlanIds.includes(item.id))
          .map((item) => item.id);

        const supplementPolicyDB = await prisma.supplementPolicy.findMany({
          where: { tourId: id },
          select: {
            id: true,
          },
        });

        const supplementPolicyIds = supplementPolicy.map(
          (item: any) => item.id
        );

        const deleteSupplementPolicyIds = supplementPolicyDB
          .filter((item: any) => !supplementPolicyIds.includes(item.id))
          .map((item) => item.id);

        const addTourId = await planService.map((item: any) => ({
          ...item,
          tourId: id,
        }));
        const addTourIdOnDestination = await destinations.map((des: any) => ({
          ...des,
          tourId: id,
        }));
        const addTourIdOnHolidayType = await holidayType.map((des: any) => ({
          ...des,
          tourId: id,
        }));
        let newSeoMeta;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        const oldTour = await prisma.tours.findFirst({
          where: {
            id: id,
          },
          select: {
            title: true,
            description: true,
            meetingPoint: true,
            departurePoint: true,
            travelingFromDescription: true,
            weatherDescription: true,
            whenToGoDescription: true,
            cuisineDescription: true,
            overviewTitle: true,
            overviewDescription: true,
            pricingTitle: true,
            pricingDescription: true,
            physicalActivityDescription: true,
            makeItPrivateDescription: true,
          },
        });
        const updatedTour = await prisma.tours.update({
          where: {
            id: id,
          },
          data: {
            ...rest,
            ...(seoMetaId
              ? {
                  seoMeta: {
                    update: {
                      data: seoMeta,
                    },
                  },
                }
              : {
                  seoMeta: {
                    connect: { id: newSeoMeta?.id },
                  },
                }),
            accommodationImageMedia: {
              update: accommodationImageMedia,
            },
            bannerImageMedia: {
              update: bannerImageMedia,
            },
          },
          include: {
            highlights: true,
            dayToDayItinerary: true,
            privatePlan: true,
            supplementPolicy: true,
            accommodationImageMedia: true,
            bannerImageMedia: true,
          },
        });
        const {
          title,
          description,
          meetingPoint,
          departurePoint,
          travelingFromDescription,
          weatherDescription,
          whenToGoDescription,
          cuisineDescription,
          overviewTitle,
          overviewDescription,
          pricingTitle,
          pricingDescription,
          physicalActivityDescription,
          makeItPrivateDescription,
        } = rest;
        const translateKeysObj = {
          title,
          description,
          meetingPoint,
          departurePoint,
          travelingFromDescription,
          weatherDescription,
          whenToGoDescription,
          cuisineDescription,
          overviewTitle,
          overviewDescription,
          pricingTitle,
          pricingDescription,
          physicalActivityDescription,
          makeItPrivateDescription,
        };
        const diffValues = getDifferentValues(oldTour, translateKeysObj);
        if (Object.keys(diffValues).length) {
          const tourTranslation = await prisma.toursTranslation.findMany({
            where: { tourId: id },
            include: {
              language: true,
            },
          });
          tourTranslation.map(async ({ language: { locale }, id }: any) => {
            if (locale !== "en") {
              await translateObj(diffValues, "en", locale, translateService);
              await prisma.toursTranslation.update({
                where: {
                  id: id,
                },
                data: {
                  ...diffValues,
                },
              });
            } else {
              await prisma.toursTranslation.update({
                where: {
                  id: id,
                },
                data: {
                  title,
                  description,
                  meetingPoint,
                  departurePoint,
                  travelingFromDescription,
                  weatherDescription,
                  whenToGoDescription,
                  cuisineDescription,
                  overviewTitle,
                  overviewDescription,
                  pricingTitle,
                  pricingDescription,
                  physicalActivityDescription,
                  makeItPrivateDescription,
                },
              });
            }
          });
        }

        highlights.map(async (element: any) => {
          const {
            media: elementMedia,
            id: elementId,
            imageId: elementImageId,
            holidayTypeId,
            tourId,
            ...restElement
          } = element;
          if (elementId) {
            const oldHighlight = await prisma.highlights.findFirst({
              where: {
                id: element.id,
              },
              select: {
                description: true,
              },
            });
            await prisma.highlights.update({
              where: {
                id: element.id,
              },
              data: { ...restElement, media: { update: elementMedia } },
            });
            const { description } = restElement;
            const translateKeysObj = { description };
            const diffValues = getDifferentValues(
              oldHighlight,
              translateKeysObj
            );
            if (Object.keys(diffValues).length) {
              const highlightTranslation =
                await prisma.highlightsTranslation.findMany({
                  where: { highlightId: elementId },
                  include: {
                    language: true,
                  },
                });
              highlightTranslation.forEach(
                async ({ language: { locale }, id }: any) => {
                  if (locale !== "en") {
                    await translateObj(
                      diffValues,
                      "en",
                      locale,
                      translateService
                    );
                    await prisma.highlightsTranslation.update({
                      where: { id },
                      data: { ...diffValues },
                    });
                  } else {
                    await prisma.highlightsTranslation.update({
                      where: { id },
                      data: {
                        description,
                      },
                    });
                  }
                }
              );
            }
          } else {
            const newHighlight = await prisma.highlights.create({
              data: {
                tour: {
                  tourId,
                  connect: {
                    id: id,
                  },
                },
                ...restElement,
                media: {
                  create: elementMedia,
                },
              },
            });
            languages.forEach(async (lang) => {
              const { description } = restElement;
              if (lang.locale !== "en") {
                const translateKeysObj = { description };
                await translateObj(
                  translateKeysObj,
                  "en",
                  lang.locale,
                  translateService
                );

                await prisma.highlightsTranslation.create({
                  data: {
                    ...translateKeysObj,
                    Highlights: {
                      connect: { id: newHighlight.id },
                    },
                    language: {
                      connect: {
                        id: lang.id,
                      },
                    },
                  },
                });
              } else {
                await prisma.highlightsTranslation.create({
                  data: {
                    description,
                    Highlights: {
                      connect: { id: newHighlight.id },
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
          }
        });

        dayToDayItinerary.map(async (element: any) => {
          const {
            id: elementId,
            holidayTypeId,
            tourId,
            ...restElement
          } = element;
          if (elementId) {
            const oldDayToDay = await prisma.dayToDayItinerary.findFirst({
              where: {
                id: elementId,
              },
              select: {
                description: true,
                destination: true,
                accommodation: true,
              },
            });

            await prisma.dayToDayItinerary.update({
              where: {
                id: elementId,
              },
              data: { ...restElement },
            });
            const { description, destination, accommodation } = restElement;
            const translateKeysObj = {
              description,
              destination,
              accommodation,
            };
            const diffValues = getDifferentValues(
              oldDayToDay,
              translateKeysObj
            );

            if (Object.keys(diffValues).length) {
              const dayToDayTranslation =
                await prisma.dayToDayItineraryTranslation.findMany({
                  where: { dayTodayItineraryId: elementId },
                  include: {
                    language: true,
                  },
                });
              dayToDayTranslation.forEach(
                async ({ language: { locale }, id }: any) => {
                  if (locale !== "en") {
                    await translateObj(
                      diffValues,
                      "en",
                      locale,
                      translateService
                    );
                    await prisma.dayToDayItineraryTranslation.update({
                      where: { id },
                      data: { ...diffValues },
                    });
                  } else {
                    await prisma.dayToDayItineraryTranslation.update({
                      where: { id },
                      data: {
                        description,
                        destination,
                        accommodation,
                      },
                    });
                  }
                }
              );
            }
          } else {
            const newDayToDay = await prisma.dayToDayItinerary.create({
              data: {
                tours: {
                  tourId,
                  connect: {
                    id: id,
                  },
                },
                ...restElement,
              },
            });
            languages.forEach(async (lang) => {
              const { description, destination, accommodation } = restElement;
              if (lang.locale !== "en") {
                const translateKeysObj = {
                  description,
                  destination,
                  accommodation,
                };
                await translateObj(
                  translateKeysObj,
                  "en",
                  lang.locale,
                  translateService
                );

                await prisma.dayToDayItineraryTranslation.create({
                  data: {
                    ...translateKeysObj,
                    dayToDayItinerary: {
                      connect: { id: newDayToDay.id },
                    },
                    language: {
                      connect: {
                        id: lang.id,
                      },
                    },
                  },
                });
              } else {
                await prisma.dayToDayItineraryTranslation.create({
                  data: {
                    description,
                    destination,
                    accommodation,
                    dayToDayItinerary: {
                      connect: { id: newDayToDay.id },
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
          }
        });

        privatePlan.map(async (element: any) => {
          const {
            id: elementId,
            holidayTypeId,
            tourId,
            ...restElement
          } = element;
          if (elementId) {
            await prisma.privatePlan.update({
              where: {
                id: elementId,
              },
              data: { ...restElement },
            });
          } else {
            await prisma.privatePlan.create({
              data: {
                tours: {
                  tourId,
                  connect: {
                    id: id,
                  },
                },
                ...restElement,
              },
            });
          }
        });

        supplementPolicy.map(async (element: any) => {
          const {
            id: elementId,
            holidayTypeId,
            tourId,
            ...restElement
          } = element;
          if (elementId) {
            const oldSupplementPolicy = await prisma.supplementPolicy.findFirst(
              {
                where: {
                  id: elementId,
                },
                select: {
                  description: true,
                  subTitle: true,
                  title: true,
                },
              }
            );
            await prisma.supplementPolicy.update({
              where: {
                id: elementId,
              },
              data: { ...restElement },
            });
            const { description, subTitle, title } = restElement;
            const translateKeysObj = {
              description,
              subTitle,
              title,
            };
            const diffValues = getDifferentValues(
              oldSupplementPolicy,
              translateKeysObj
            );
            if (Object.keys(diffValues).length) {
              const supplementPolicyTranslation =
                await prisma.supplementPolicyTranslation.findMany({
                  where: { supplementryPolicyId: elementId },
                  include: {
                    language: true,
                  },
                });
              supplementPolicyTranslation.forEach(
                async ({ language: { locale }, id }: any) => {
                  if (locale !== "en") {
                    await translateObj(
                      diffValues,
                      "en",
                      locale,
                      translateService
                    );
                    await prisma.supplementPolicyTranslation.update({
                      where: { id },
                      data: { ...diffValues },
                    });
                  } else {
                    await prisma.supplementPolicyTranslation.update({
                      where: { id },
                      data: {
                        description,
                        subTitle,
                        title,
                      },
                    });
                  }
                }
              );
            }
          } else {
            const newSupp = await prisma.supplementPolicy.create({
              data: {
                tours: {
                  tourId,
                  connect: {
                    id: id,
                  },
                },
                ...restElement,
              },
            });
            languages.forEach(async (lang) => {
              const { description, subTitle, title } = restElement;
              if (lang.locale !== "en") {
                const translateKeysObj = {
                  description,
                  subTitle,
                  title,
                };
                await translateObj(
                  translateKeysObj,
                  "en",
                  lang.locale,
                  translateService
                );

                await prisma.supplementPolicyTranslation.create({
                  data: {
                    ...translateKeysObj,
                    supplementPolicy: {
                      connect: { id: newSupp.id },
                    },
                    language: {
                      connect: {
                        id: lang.id,
                      },
                    },
                  },
                });
              } else {
                await prisma.supplementPolicyTranslation.create({
                  data: {
                    description,
                    subTitle,
                    title,
                    supplementPolicy: {
                      connect: { id: newSupp.id },
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
          }
        });
        await prisma.highlights.deleteMany({
          where: {
            id: {
              in: deleteHighlightIds,
            },
          },
        });
        await prisma.privatePlan.deleteMany({
          where: {
            id: {
              in: deletePrivatePlanIds,
            },
          },
        });
        await prisma.dayToDayItinerary.deleteMany({
          where: {
            id: {
              in: deleteDayToDayItineraryIds,
            },
          },
        });
        await prisma.supplementPolicy.deleteMany({
          where: {
            id: {
              in: deleteSupplementPolicyIds,
            },
          },
        });

        await prisma.toursToPlanService.deleteMany({
          where: { tourId: id },
        });

        await prisma.toursToPlanService.createMany({
          data: [...addTourId],
        });

        await prisma.tourDestinations.deleteMany({
          where: { tourId: id },
        });

        await prisma.tourDestinations.createMany({
          data: [...addTourIdOnDestination],
        });
        await prisma.tourHolidayType.deleteMany({
          where: { tourId: id },
        });

        await prisma.tourHolidayType.createMany({
          data: [...addTourIdOnHolidayType],
        });

        const [bannerImageMediaResponse, accommodationImageMediaResponse] =
          await Promise.all([
            convertMediaIdsResponseIntoMediaUrl(
              updatedTour,
              "bannerImageMedia"
            ),
            convertMediaIdsResponseIntoMediaUrl(
              updatedTour,
              "accommodationImageMedia"
            ),
          ]);
        return new NextResponse(
          JSON.stringify({
            data: {
              ...updatedTour,

              bannerImageMedia: bannerImageMediaResponse,
              accommodationImageMedia: accommodationImageMediaResponse,
            },
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        if (body.isActive !== undefined) {
          const tour = await prisma.tours.update({
            where: {
              id,
            },
            data: { ...body },
          });
          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: tour,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else {
          await prisma.tours.updateMany({
            where: {
              // destinationId: Number(body.destinationId),
              tourDestinations: {
                some: {
                  destination: { id: { in: body.destinationId } },
                },
              },
            },
            data: { isFeatured: false },
          });
          const tour = await prisma.tours.update({
            where: {
              id,
              // destinationId: Number(body.destinationId),
              tourDestinations: {
                some: {
                  destination: { id: { in: body.destinationId } },
                },
              },
            },
            data: { isFeatured: body.isFeatured },
          });

          return new NextResponse(
            JSON.stringify({
              status: "success",
              // data: tour,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "tour id is required",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    if (!isNumeric(id)) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "tour id is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const tour = await prisma.tours.update({
      where: {
        id: Number(id),
      },
      data: {
        isDeleted: true,
      },
      include: {
        highlights: true,
        dayToDayItinerary: true,
        privatePlan: true,
        supplementPolicy: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: tour,
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
