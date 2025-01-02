import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextResponse } from "next/server";
import {
  getDifferentValues,
  translateObj,
  translateService,
} from "@utils/translate";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const inspiration = await prisma.inspirations.findFirst({
      where: {
        isDeleted: false,
        id: id,
      },
      include: {
        seoMeta: true,
        media: true,
        destination: true,
        holidayType: true,
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
    });

    const [inspirationResponse, inspirationDetail] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(inspiration),
      convertMediaIdsResponseIntoMediaUrl(inspiration?.inspirationDetail),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          ...inspirationResponse,
          inspirationDetail,
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
      if (body.inspirationDetail?.length) {
        const {
          inspirationDetail,
          id: _id,
          imageId,
          media,
          destination,
          caughtAllRouteId,
          holidayType,
          seoMeta: { id: __id, ...seoRest },
          seoMetaId,
          ...rest
        } = body;

        const inspirationDetailDB = await prisma.inspirationDetail.findMany({
          where: { inspirationId: id },
          select: {
            id: true,
          },
        });

        const inspirationDetailIds = inspirationDetail.map(
          (item: any) => item.id
        );

        const deleteInspirationDetailIds: any = inspirationDetailDB
          .filter((item: any) => !inspirationDetailIds.includes(item.id))
          .map((item) => item.id)
          .filter((ele) => ele);
        const oldInspiration = await prisma.inspirations.findFirst({
          where: { id },
          select: {
            title: true,
            description: true,
          },
        });
        const updatedInspiration = await prisma.inspirations.update({
          where: {
            id,
          },
          data: {
            ...rest,
            destination: {
              set: destination,
            },
            holidayType: {
              set: holidayType,
            },
            seoMeta: {
              update: {
                data: seoRest,
              },
            },
            media: {
              update: {
                data: media,
              },
            },
          },
        });

        const { title, description, ...restPayload } = rest;
        const translateKeysObj = { title, description };
        const diffValues = getDifferentValues(oldInspiration, translateKeysObj);
        if (Object.keys(diffValues).length) {
          const inspirationTranslation =
            await prisma.inspirationsTranslation.findMany({
              where: { inspirationId: id },
              include: {
                language: true,
              },
            });
          inspirationTranslation.map(
            async ({ language: { locale }, id }: any) => {
              if (locale !== "en") {
                await translateObj(diffValues, "en", locale, translateService);
                await prisma.inspirationsTranslation.update({
                  where: {
                    id: id,
                  },
                  data: {
                    ...diffValues,
                  },
                });
              } else {
                await prisma.inspirationsTranslation.update({
                  where: {
                    id: id,
                  },
                  data: { title, description },
                });
              }
            }
          );
        }
        inspirationDetail?.map(async (element: any) => {
          const {
            media: elementMedia,
            id: elementId,
            imageId: elementImageId,
            inspirationId,
            inspirationDetailId,
            ...restElement
          } = element;
          if (elementId) {
            const oldInspirationDetail =
              await prisma.inspirationDetail.findFirst({
                where: { id: elementId },
                select: {
                  title: true,
                  description: true,
                },
              });
            await prisma.inspirationDetail.update({
              where: {
                id: elementId,
              },
              data: { ...restElement, media: { update: elementMedia } },
            });

            const { title, description } = restElement;
            const translateKeysObj = { title, description };
            const diffValues = getDifferentValues(
              oldInspirationDetail,
              translateKeysObj
            );
            if (Object.keys(diffValues).length) {
              const inspirationDetailTranslation =
                await prisma.inspirationDetailTranslation.findMany({
                  where: { inspirationDetailId: elementId },
                  include: {
                    language: true,
                  },
                });
              inspirationDetailTranslation.forEach(
                async ({ language: { locale }, id }: any) => {
                  if (locale !== "en") {
                    await translateObj(
                      diffValues,
                      "en",
                      locale,
                      translateService
                    );
                    await prisma.inspirationDetailTranslation.update({
                      where: { id },
                      data: { ...diffValues },
                    });
                  } else {
                    await prisma.inspirationDetailTranslation.update({
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
            const newDetail = await prisma.inspirationDetail.create({
              data: {
                ...restElement,
                inspirations: {
                  connect: {
                    id: updatedInspiration.id,
                  },
                },

                media: {
                  create: elementMedia,
                },
              },
            });
            languages.forEach(async (lang) => {
              const { title, description } = restElement;
              if (lang.locale !== "en") {
                const translateKeysObj = { title, description };
                await translateObj(
                  translateKeysObj,
                  "en",
                  lang.locale,
                  translateService
                );

                await prisma.inspirationDetailTranslation.create({
                  data: {
                    ...translateKeysObj,
                    inspirationDetail: {
                      connect: { id: newDetail.id },
                    },
                    language: {
                      connect: {
                        id: lang.id,
                      },
                    },
                  },
                });
              } else {
                await prisma.inspirationDetailTranslation.create({
                  data: {
                    title,
                    description,
                    inspirationDetail: {
                      connect: { id: newDetail.id },
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

        await prisma.inspirationDetail.deleteMany({
          where: {
            id: {
              in: deleteInspirationDetailIds,
            },
          },
        });

        return new NextResponse(
          JSON.stringify({
            data: "",
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        if (body?.isFeatured !== undefined) {
          const featuredInspiration = await prisma.inspirations.findFirst({
            where: {
              isFeatured: true,
              destination: { some: { id: body.destinationId } },
            },
          });
          if (featuredInspiration?.id)
            await prisma.inspirations.updateMany({
              where: {
                id: featuredInspiration?.id,
                destination: { some: { id: body.destinationId } },
              },
              data: {
                isFeatured: false,
              },
            });
          const inspiration = await prisma.inspirations.update({
            where: {
              id: id,
              destination: { some: { id: body.destinationId } },
            },
            data: {
              isFeatured: body?.isFeatured,
            },
          });
          const updatedInspiration = await prisma.inspirations.findFirst({
            where: {
              id: id,
            },
            include: {
              destination: true,
              inspirationDetail: true,
            },
          });
          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: updatedInspiration,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } else if (body?.isHomePageSort !== undefined) {
          if (body?.isHomePageSort == false) {
            const inspiration = await prisma.inspirations.updateMany({
              where: {
                id: id,
              },
              data: {
                isHomePageSort: false,
              },
            });
            const updatedInspiration = await prisma.inspirations.findFirst({
              where: {
                id: id,
              },
              include: {
                destination: true,
                inspirationDetail: true,
              },
            });
            return new NextResponse(
              JSON.stringify({
                status: "success",
                data: updatedInspiration,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            );
          } else {
            const highestSortIdInspiration =
              await prisma.inspirations.findFirst({
                orderBy: {
                  homePageSortId: "desc",
                },
              });

            const inspiration = await prisma.inspirations.updateMany({
              where: {
                id: id,
              },
              data: {
                isHomePageSort: body?.isHomePageSort,
                homePageSortId: highestSortIdInspiration?.homePageSortId
                  ? highestSortIdInspiration?.homePageSortId + 1
                  : 1,
              },
            });
            const updatedInspiration = await prisma.inspirations.findFirst({
              where: {
                id: id,
              },
              include: {
                destination: true,
                inspirationDetail: true,
              },
            });

            return new NextResponse(
              JSON.stringify({
                status: "success",
                data: updatedInspiration,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        } else {
          const inspiration = await prisma.inspirations.update({
            where: {
              id: id,
            },
            data: { isActive: body.isActive },
          });
          const updatedInspiration = await prisma.inspirations.findFirst({
            where: {
              id: id,
            },
            include: {
              destination: true,
              inspirationDetail: true,
            },
          });
          return new NextResponse(
            JSON.stringify({
              status: "success",
              data: updatedInspiration,
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
          message: "inspiration id is required",
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
      const inspiration = await prisma.inspirations.update({
        where: {
          id: id,
        },
        data: {
          isDeleted: true,
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: inspiration,
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
          message: "Inspiration id is required",
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
