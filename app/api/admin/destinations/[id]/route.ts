import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import {
  convertMediaIdsResponseIntoMediaUrl,
  isNumeric,
} from "@utils/functions";
import { NextResponse } from "next/server";
import {
  getDifferentValues,
  translateObj,
  translateService,
} from "@utils/translate";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");

    const id = Number(params.id);
    const destination = await prisma.destinations.findFirst({
      where: {
        id: id,
        isActive: true,
        isDeleted: false,
      },
      include: {
        seoMeta: true,
        content: {
          orderBy: {
            sortId: "asc",
          },
          include: {
            media: true,
          },
        },
        destinationFeatureOffered: {
          include: {
            destinationFeatures: true,
          },
        },
      },
    });

    const content = await convertMediaIdsResponseIntoMediaUrl(
      destination?.content
    );
    return new NextResponse(
      JSON.stringify({
        data: { ...destination, content },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");
    const id = Number(params.id);
    const destination = await prisma.destinations.update({
      data: {
        isDeleted: true,
      },
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: { ...destination },
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");
    const id = Number(params.id);
    const body = await request.json();
    if (id) {
      if (!body.content?.length) {
        const destination = await prisma.destinations.update({
          data: {
            isActive: body.isActive,
          },
          where: { id: id },
        });

        return new NextResponse(
          JSON.stringify({
            data: destination,
            status: "success",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        const languages = await prisma.languages.findMany({});

        const {
          content,
          destinationFeatureOffered,
          id: _id,
          seoMeta,
          seoMetaId,
          caughtAllRouteId,
          ...rest
        } = body;
        let newSeoMeta: any;
        if (!seoMetaId) {
          newSeoMeta = await prisma.seoMeta.create({
            data: seoMeta,
          });
        }
        try {
          const oldDestination = await prisma.destinations.findFirst({
            where: { id },
            select: {
              description: true,
            },
          });

          const updatedDestination = await prisma.destinations.update({
            where: {
              id: id,
            },
            data: {
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
              ...rest,
            },
            include: {
              content: {
                include: {
                  media: true,
                },
              },
            },
          });
          const { description, ...restPayload } = rest;
          const translateKeysObj = { description };
          const diffValues = getDifferentValues(
            oldDestination,
            translateKeysObj
          );
          if (Object.keys(diffValues).length) {
            const destinationTranslation =
              await prisma.destinationsTranslation.findMany({
                where: { destinationId: id },
                include: {
                  language: true,
                },
              });
            destinationTranslation.map(
              async ({ language: { locale }, id }: any) => {
                if (locale !== "en") {
                  await translateObj(
                    diffValues,
                    "en",
                    locale,
                    translateService
                  );
                  await prisma.destinationsTranslation.update({
                    where: {
                      id: id,
                    },
                    data: {
                      ...diffValues,
                    },
                  });
                } else {
                  await prisma.destinationsTranslation.update({
                    where: {
                      id: id,
                    },
                    data: { description },
                  });
                }
              }
            );
          }
          content?.map(async (element: any) => {
            const {
              media: elementMedia,
              id: elementId,
              imageId: elementImageId,
              langId,
              pageId,
              referenceId,
              contentId,
              ...restElement
            } = element;
            if (elementId) {
              const oldContent = await prisma.content.findFirst({
                where: { id: elementId },
                select: {
                  description: true,
                  title: true,
                  subTitle: true,
                  buttonText: true,
                },
              });
              await prisma.content.update({
                where: {
                  id: elementId,
                },
                data: {
                  ...restElement,
                  media: {
                    update: elementMedia,
                  },
                },
              });
              const { title, description, subTitle, buttonText } = restElement;
              const translateKeysObj = {
                title,
                description,
                subTitle,
                buttonText,
              };
              const diffValues = getDifferentValues(
                oldContent,
                translateKeysObj
              );
              if (Object.keys(diffValues).length) {
                const contentTranslation =
                  await prisma.contentTranslation.findMany({
                    where: { contentId: elementId },
                    include: {
                      language: true,
                    },
                  });
                contentTranslation.forEach(
                  async ({ language: { locale }, id }: any) => {
                    if (locale !== "en") {
                      await translateObj(
                        diffValues,
                        "en",
                        locale,
                        translateService
                      );
                      await prisma.contentTranslation.update({
                        where: { id },
                        data: { ...diffValues },
                      });
                    } else {
                      await prisma.contentTranslation.update({
                        where: { id },
                        data: {
                          title,
                          description,
                          subTitle,
                          buttonText,
                        },
                      });
                    }
                  }
                );
              }
            } else {
              const newContent = await prisma.content.create({
                data: {
                  ...restElement,
                  destinations: {
                    connect: {
                      id: Number(params.id),
                    },
                  },
                  media: {
                    create: elementMedia,
                  },
                },
              });
              languages.forEach(async (lang) => {
                const { title, description, subTitle, buttonText } = element;
                if (lang.locale !== "en") {
                  const translateKeysObj = {
                    title,
                    description,
                    subTitle,
                    buttonText,
                  };
                  await translateObj(
                    translateKeysObj,
                    "en",
                    lang.locale,
                    translateService
                  );
                  await prisma.contentTranslation.create({
                    data: {
                      ...translateKeysObj,
                      content: {
                        connect: {
                          id: newContent.id,
                        },
                      },
                      language: {
                        connect: {
                          id: lang.id,
                        },
                      },
                    },
                  });
                } else {
                  await prisma.contentTranslation.create({
                    data: {
                      title,
                      description,
                      subTitle,
                      buttonText,
                      content: {
                        connect: { id: newContent.id },
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

          const destinationFeatures =
            await prisma.destinationFeatureOffered.findMany({
              where: { destinations: { id: Number(params.id) } },
              select: {
                id: true,
              },
            });

          const destinationFeaturesIds = destinationFeatureOffered.map(
            (item: any) => item.id
          );
          const deleteFeaturesIds: any = destinationFeatures
            .filter((item: any) => !destinationFeaturesIds.includes(item.id))
            .map((item) => item.id)
            .filter((ele) => ele);

          await prisma.destinationFeatureOffered.deleteMany({
            where: {
              id: {
                in: deleteFeaturesIds,
              },
            },
          });
          destinationFeatureOffered?.map(async (element: any) => {
            const { destinationFeatureId, id: elementId, ...rest } = element;
            if (elementId) {
              const oldFeature =
                await prisma.destinationFeatureOffered.findFirst({
                  where: {
                    id: elementId,
                  },
                  select: {
                    description: true,
                  },
                });
              const updatedFeature =
                await prisma.destinationFeatureOffered.update({
                  where: {
                    id: elementId,
                  },
                  data: {
                    ...rest,
                    destinationId: id,
                    destinationFeatureId,
                  },
                });

              const { description } = rest;
              const translateKeysObj = {
                description,
              };
              const diffValues = getDifferentValues(
                oldFeature,
                translateKeysObj
              );

              if (Object.keys(diffValues).length) {
                const featureTranslation =
                  await prisma.destinationFeatureOfferedTranslation.findMany({
                    where: { destinationFeatureOfferedId: elementId },
                    include: {
                      language: true,
                    },
                  });
                featureTranslation.forEach(
                  async ({ language: { locale }, id }: any) => {
                    if (locale !== "en") {
                      await translateObj(
                        diffValues,
                        "en",
                        locale,
                        translateService
                      );
                      await prisma.destinationFeatureOfferedTranslation.update({
                        where: { id },
                        data: { ...diffValues },
                      });
                    } else {
                      await prisma.destinationFeatureOfferedTranslation.update({
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
              const newFeature = await prisma.destinationFeatureOffered.create({
                data: {
                  ...rest,
                  destinationId: id,
                  destinationFeatureId,
                },
              });
              languages.forEach(async (lang) => {
                const { description } = element;
                if (lang.locale !== "en") {
                  const translateKeysObj = { description };
                  await translateObj(
                    translateKeysObj,
                    "en",
                    lang.locale,
                    translateService
                  );
                  await prisma.destinationFeatureOfferedTranslation.create({
                    data: {
                      ...translateKeysObj,
                      destinationFeatureOffered: {
                        connect: {
                          id: newFeature.id,
                        },
                      },
                      language: {
                        connect: {
                          id: lang.id,
                        },
                      },
                    },
                  });
                } else {
                  await prisma.destinationFeatureOfferedTranslation.create({
                    data: {
                      description,
                      destinationFeatureOffered: {
                        connect: { id: newFeature.id },
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

          return new NextResponse(
            JSON.stringify({
              data: "response[0]",
              status: "success",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (e) {
          console.log(e, "error");
        }
      }
    }
  } catch (error: any) {
    if (error) {
      return getErrorResponse(400, "Error", error);
    }

    return getErrorResponse(500, error.message);
  }
}
