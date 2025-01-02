import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextResponse } from "next/server";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
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
    const tourById = await prisma.placeToVisit.findFirst({
      where: {
        id: id,
        isDeleted: false,
      },
      include: {
        media: true,
        seoMeta: true,
        reviews: {
          include: {
            media: true,
          },
        },
        attraction: {
          orderBy: {
            id: "asc",
          },
          include: { media: true },
        },
      },
    });
    const [tour, attraction] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tourById),
      convertMediaIdsResponseIntoMediaUrl(tourById?.attraction),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          ...tour,
          reviews: tourById?.reviews,
          attraction: attraction,
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

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const languages = await prisma.languages.findMany({});

    const {
      attraction,
      reviews,
      media,
      destinationId,
      imageId,
      seoMeta,
      isActive,
      seoMetaId,
      id: _id,
      status,
      caughtAllRouteId,
      ...rest
    } = body;

    if (status !== undefined) {
      const updatedPlace = await prisma.placeToVisit.update({
        where: {
          id: id,
        },
        data: {
          isActive: status,
        },
      });
      return new NextResponse(
        JSON.stringify({
          data: updatedPlace,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const attractionDB = await prisma.attraction.findMany({
        where: { placeId: id },
        select: {
          id: true,
        },
      });

      const attractionIds = attraction?.map((item: any) => item.id);

      const deleteAttractionIds: any = attractionDB
        ?.filter((item: any) => !attractionIds?.includes(item.id))
        ?.map((item) => item.id)
        .filter((ele) => ele);
      const oldPlace = await prisma.placeToVisit.findFirst({
        where: {
          id,
        },
        select: {
          title: true,
          description: true,
          attractionTitle: true,
          attractionDescription: true,
        },
      });
      const updatedPlace = await prisma.placeToVisit.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
          isActive,
          seoMeta: {
            update: {
              data: seoMeta,
            },
          },

          ...(media && {
            media: {
              update: media,
            },
          }),
          destination: { connect: { id: Number(destinationId) } },
        },
      });

      const { title, description, attractionTitle, attractionDescription } =
        rest;
      const translateKeysObj = {
        title,
        description,
        attractionTitle,
        attractionDescription,
      };
      const diffValues = getDifferentValues(oldPlace, translateKeysObj);
      if (Object.keys(diffValues).length) {
        const placeTranslation = await prisma.placeToVisitTranslation.findMany({
          where: { placeToVisitId: id },
          include: {
            language: true,
          },
        });
        placeTranslation.map(async ({ language: { locale }, id }: any) => {
          if (locale !== "en") {
            await translateObj(diffValues, "en", locale, translateService);
            await prisma.placeToVisitTranslation.update({
              where: {
                id: id,
              },
              data: {
                ...diffValues,
              },
            });
          } else {
            await prisma.placeToVisitTranslation.update({
              where: {
                id: id,
              },
              data: {
                title,
                description,
                attractionTitle,
                attractionDescription,
              },
            });
          }
        });
      }
      attraction?.map(async (element: any) => {
        const {
          media: elementMedia,
          id: elementId,
          imageId: elementImageId,
          placeId,
          attractionId,
          ...restElement
        } = element;
        if (elementId) {
          const oldAttraction = await prisma.attraction.findFirst({
            where: {
              id: elementId,
            },
            select: { description: true, title: true },
          });

          await prisma.attraction.update({
            where: {
              id: elementId,
            },
            data: { ...restElement, media: { update: elementMedia } },
          });
          const { description, title } = restElement;
          const translateKeysObj = { description, title };
          const diffValues = getDifferentValues(
            oldAttraction,
            translateKeysObj
          );
          if (Object.keys(diffValues).length) {
            const attractionTranslation =
              await prisma.attractionTranslation.findMany({
                where: { attractionId: elementId },
                include: {
                  language: true,
                },
              });
            attractionTranslation.forEach(
              async ({ language: { locale }, id }: any) => {
                if (locale !== "en") {
                  await translateObj(
                    diffValues,
                    "en",
                    locale,
                    translateService
                  );
                  await prisma.attractionTranslation.update({
                    where: { id },
                    data: { ...diffValues },
                  });
                } else {
                  await prisma.attractionTranslation.update({
                    where: { id },
                    data: {
                      title,
                      description,
                    },
                  });
                }
              }
            );
          }
        } else {
          const newAttraction = await prisma.attraction.create({
            data: {
              ...restElement,
              placeToVisit: {
                connect: {
                  id: updatedPlace.id,
                },
              },

              media: {
                create: elementMedia,
              },
            },
          });
          languages.forEach(async (lang) => {
            const { description, title } = restElement;
            if (lang.locale !== "en") {
              const translateKeysObj = { description, title };
              await translateObj(
                translateKeysObj,
                "en",
                lang.locale,
                translateService
              );

              await prisma.attractionTranslation.create({
                data: {
                  ...translateKeysObj,
                  attraction: {
                    connect: { id: newAttraction.id },
                  },
                  language: {
                    connect: {
                      id: lang.id,
                    },
                  },
                },
              });
            } else {
              await prisma.attractionTranslation.create({
                data: {
                  description,
                  title,
                  attraction: {
                    connect: { id: newAttraction.id },
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
      }),
        await prisma.attraction.deleteMany({
          where: {
            id: {
              in: deleteAttractionIds,
            },
          },
        });
      return new NextResponse(
        JSON.stringify({
          data: updatedPlace,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);

    if (id) {
      const place = await prisma.placeToVisit.updateMany({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: place,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Place id is required",
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
