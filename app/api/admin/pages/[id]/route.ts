import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextResponse } from "next/server";
import { i18n } from "i18n.config";
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
    const page = await prisma.pages.findFirst({
      where: {
        id: id,
      },
      include: {
        seoMeta: true,
        content: {
          include: {
            media: true,
          },

          orderBy: {
            sortId: "asc",
          },
        },
      },
    });
    const contentResponse = await convertMediaIdsResponseIntoMediaUrl(
      page?.content
    );
    return new NextResponse(
      JSON.stringify({
        data: { ...page, content: contentResponse },
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
  if (!params.id)
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: "Page id is required",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  try {
    const id = Number(params.id);
    const { content, seoMeta, seoMetaId, ...rest } = await req.json();
    const languages = await prisma.languages.findMany({});

    if (content) {
      const contents = await prisma.content.findMany({
        where: { pageId: id },
        select: {
          id: true,
        },
      });

      const contentIds = content.map((item: any) => item.id);
      const deleteContentIds: any = contents
        .filter((item: any) => !contentIds.includes(item.id))
        .map((item) => item.id)
        .filter((ele) => ele);
      let newSeoMeta;
      if (!seoMetaId) {
        newSeoMeta = await prisma.seoMeta.create({
          data: seoMeta,
        });
      }

      const updatedPage = await prisma.pages.update({
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
        },
        include: {
          content: true,
        },
      });

      content.map(async (element: any) => {
        const {
          media,
          id,
          referenceId,
          imageId,
          pageId,
          contentId,
          ...contentRest
        } = element;

        if (element.id) {
          const oldContent = await prisma.content.findFirst({
            where: {
              id,
            },
            select: {
              title: true,
              description: true,
              subTitle: true,
              buttonText: true,
            },
          });
          await prisma.content.update({
            where: {
              id,
            },
            data: {
              ...contentRest,
              media: {
                update: media,
              },
            },
          });

          const { title, description, subTitle, buttonText } = contentRest;
          const translateKeysObj = {
            title,
            description,
            subTitle,
            buttonText,
          };
          const diffValues = getDifferentValues(oldContent, translateKeysObj);
          if (Object.keys(diffValues).length) {
            const contentTranslation = await prisma.contentTranslation.findMany(
              {
                where: { contentId: id },
                include: {
                  language: true,
                },
              }
            );

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
              ...contentRest,
              createByDefault: false,
              pages: {
                connect: {
                  id: Number(params.id),
                },
              },

              media: {
                create: media,
              },
            },
          });
          languages.forEach(async (lang) => {
            const { title, description, buttonText, subTitle } = contentRest;
            if (lang.locale !== "en") {
              const translateKeysObj = { title, description };
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
                    connect: { id: newContent.id },
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
                  buttonText,
                  subTitle,
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

      await prisma.content.deleteMany({
        where: {
          id: {
            in: rest.isExpandable ? deleteContentIds : [],
          },
        },
      });

      return new NextResponse(
        JSON.stringify({
          data: updatedPage,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      let newSeoMeta;
      if (!seoMetaId) {
        newSeoMeta = await prisma.seoMeta.create({
          data: seoMeta,
        });
      }
      const response = await prisma.$transaction([
        prisma.pages.update({
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
          },
          include: {
            content: true,
          },
        }),
      ]);

      return new NextResponse(
        JSON.stringify({
          data: response[0],
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
