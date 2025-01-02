import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { NextResponse } from "next/server";
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
    const holidayType = await prisma.holidayType.findFirst({
      where: {
        id: id,
      },
      include: {
        media: true,
        seoMeta: true,
        highlights: {
          include: {
            media: true,
          },
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    const [holidayTypeResponse, holidayTypeHighlights] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(holidayType),
      convertMediaIdsResponseIntoMediaUrl(holidayType?.highlights),
    ]);
    return new NextResponse(
      JSON.stringify({
        data: {
          ...holidayTypeResponse,
          highlights: holidayTypeHighlights,
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

    if (id) {
      if (body.highlights?.length) {
        const {
          highlights,
          id: _id,
          langId,
          imageId,
          media: restMedia,
          holidayType,
          holidayTypeId,
          seoMeta,
          seoMetaId,
          ...rest
        } = body;

        const highlightsDB = await prisma.highlights.findMany({
          where: { holidayTypeId: id },
          select: {
            id: true,
          },
        });

        const highlightIds = highlights.map((item: any) => item.id);

        const deleteHighlightIds: any = highlightsDB
          .filter((item: any) => !highlightIds.includes(item.id))
          .map((item) => item.id)
          .filter((ele) => ele);
        const oldHolidayType = await prisma.holidayType.findFirst({
          where: {
            id: id,
          },
          select: {
            name: true,
            description: true,
            mainSectionHeading: true,
            mainSectionDescription: true,
          },
        });
        const updatedHolidayType = await prisma.holidayType.update({
          where: {
            id: id,
          },
          data: {
            ...rest,

            seoMeta: {
              update: {
                data: seoMeta,
              },
            },

            media: {
              update: restMedia,
            },
          },
        });

        const {
          name,
          description,
          mainSectionHeading,
          mainSectionDescription,
        } = rest;
        const translateKeysObj = {
          name,
          description,
          mainSectionHeading,
          mainSectionDescription,
        };

        const diffValues = getDifferentValues(oldHolidayType, translateKeysObj);
        if (Object.keys(diffValues).length) {
          const holidayTypeTranslation =
            await prisma.holidayTypeTranslation.findMany({
              where: { holidayId: id },
              include: {
                language: true,
              },
            });
          holidayTypeTranslation.map(
            async ({ language: { locale }, id }: any) => {
              if (locale !== "en") {
                await translateObj(diffValues, "en", locale, translateService);
                await prisma.holidayTypeTranslation.update({
                  where: {
                    id: id,
                  },
                  data: {
                    ...diffValues,
                  },
                });
              } else {
                await prisma.holidayTypeTranslation.update({
                  where: {
                    id: id,
                  },
                  data: {
                    name,
                    description,
                    mainSectionHeading,
                    mainSectionDescription,
                  },
                });
              }
            }
          );
        }

        highlights?.map(async (element: any) => {
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
              where: { id: elementId },
              select: {
                description: true,
              },
            });
            await prisma.highlights.update({
              where: {
                id: elementId,
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
                ...restElement,
                holidayType: {
                  connect: { id: updatedHolidayType?.id },
                },
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
        }),
          await prisma.highlights.deleteMany({
            where: {
              id: {
                in: deleteHighlightIds,
              },
            },
          });
        const updatedHoliday = await prisma.holidayType.findFirst({
          where: {
            id,
          },
          include: {
            highlights: true,
          },
        });
        return new NextResponse(
          JSON.stringify({
            data: updatedHoliday,
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const holidayType = await prisma.holidayType.update({
          where: {
            id: id,
          },
          data: { isActive: body.isActive },
        });
        return new NextResponse(
          JSON.stringify({
            status: "success",
            data: holidayType,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "holiday id is required",
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
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);

    if (id) {
      const holiday = await prisma.holidayType.delete({
        where: {
          id,
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: holiday,
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
          message: "holiday id is required",
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
