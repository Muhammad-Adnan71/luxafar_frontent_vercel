import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: { formType: "becomePartner" },
      select: {
        id: true,
      },
    });
    const bespokeQuestionIds = body.question.map((item: any) => item?.id);
    const languages = await prisma.languages.findMany({});

    const deleteBespokeQuestionIds = bespokeQuestions
      .filter((item: any) => !bespokeQuestionIds.includes(item.id))
      .map((item) => item.id)
      .filter((ele) => ele);
    await prisma.bespokeQuestion.deleteMany({
      where: {
        id: {
          in: deleteBespokeQuestionIds,
        },
      },
    });
    for (const item of body.question) {
      const { bespokeQuestionOptions, ...rest } = item;
      if (item.id) {
        const updatedBespokeQuestion = await prisma.bespokeQuestion.update({
          where: { id: item.id },
          data: rest,

          include: {
            bespokeQuestionOptions: true,
          },
        });
        const bespokeQuestionTranslation =
          await prisma.bespokeQuestionTranslation.findMany({
            where: { bespokeQuestionId: item.id },
            include: {
              language: true,
            },
          });
        bespokeQuestionTranslation.map(
          async ({ language: { locale }, id }: any) => {
            const { question, textPlaceholder, ...restPayload } = rest;
            if (locale !== "en") {
              const translateKeysObj = { question, textPlaceholder };
              await translateObj(
                translateKeysObj,
                "en",
                locale,
                translateService
              );
              await prisma.bespokeQuestionTranslation.update({
                where: {
                  id: id,
                },
                data: {
                  ...translateKeysObj,
                },
              });
            } else {
              await prisma.bespokeQuestionTranslation.update({
                where: {
                  id: id,
                },
                data: { question, textPlaceholder },
              });
            }
          }
        );

        const bespokeQuestionOptionsIds = bespokeQuestionOptions.map(
          (item: any) => item.id
        );

        const deleteBespokeQuestionOptionsIds =
          updatedBespokeQuestion.bespokeQuestionOptions
            .filter((item: any) => !bespokeQuestionOptionsIds.includes(item.id))
            .map((item) => item.id);

        await prisma.bespokeQuestionOptions.deleteMany({
          where: {
            id: {
              in: deleteBespokeQuestionOptionsIds,
            },
          },
        });

        for (const option of bespokeQuestionOptions) {
          if (!option.id) {
            const newOption = await prisma.bespokeQuestionOptions.create({
              data: {
                bespokeQuestionId: item.id,
                label: option.label,
              },
            });
            languages.forEach(async (lang) => {
              const { label } = option;
              if (lang.locale !== "en") {
                const translateKeysObj = { label };
                await translateObj(
                  translateKeysObj,
                  "en",
                  lang.locale,
                  translateService
                );
                await prisma.bespokeQuestionOptionsTranslation.create({
                  data: {
                    ...translateKeysObj,
                    bespokeQuestionOptions: {
                      connect: { id: newOption.id },
                    },
                    language: {
                      connect: {
                        id: lang.id,
                      },
                    },
                  },
                });
              } else {
                await prisma.bespokeQuestionOptionsTranslation.create({
                  data: {
                    label,
                    bespokeQuestionOptions: {
                      connect: { id: newOption.id },
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
          } else {
            await prisma.bespokeQuestionOptions.update({
              where: { id: option.id },
              data: {
                label: option.label,
              },
            });
            const bespokeQuestionOptionsTranslation =
              await prisma.bespokeQuestionOptionsTranslation.findMany({
                where: { bespokeQuestionOptionsId: option.id },
                include: {
                  language: true,
                },
              });
            bespokeQuestionOptionsTranslation.forEach(
              async ({ language: { locale }, id }: any) => {
                const { label } = option;
                if (locale !== "en") {
                  const translateKeysObj = { label };
                  await translateObj(
                    translateKeysObj,
                    "en",
                    locale,
                    translateService
                  );
                  await prisma.bespokeQuestionOptionsTranslation.update({
                    where: { id },
                    data: { ...translateKeysObj },
                  });
                } else {
                  await prisma.bespokeQuestionOptionsTranslation.update({
                    where: { id },
                    data: {
                      label: label,
                    },
                  });
                }
              }
            );
          }
        }
      } else {
        const newBespokeQuestion = await prisma.bespokeQuestion.create({
          data: {
            ...item,
            bespokeQuestionOptions: {
              create: item.bespokeQuestionOptions,
            },
          },
          include: {
            bespokeQuestionOptions: true,
          },
        });
        languages.forEach(async (lang) => {
          const { question, textPlaceholder } = item;
          if (lang.locale !== "en") {
            const translateKeysObj = { question, textPlaceholder };
            await translateObj(
              translateKeysObj,
              "en",
              lang.locale,
              translateService
            );

            await prisma.bespokeQuestionTranslation.create({
              data: {
                ...translateKeysObj,
                bespokeQuestion: {
                  connect: { id: newBespokeQuestion.id },
                },
                language: {
                  connect: {
                    id: lang.id,
                  },
                },
              },
            });
          } else {
            await prisma.bespokeQuestionTranslation.create({
              data: {
                question,
                textPlaceholder,
                bespokeQuestion: {
                  connect: { id: newBespokeQuestion.id },
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
        newBespokeQuestion.bespokeQuestionOptions.forEach((element: any) => {
          languages.forEach(async (lang) => {
            const { label } = element;
            if (lang.locale !== "en") {
              const translateKeysObj = { label };

              await translateObj(
                translateKeysObj,
                "en",
                lang.locale,
                translateService
              );
              await prisma.bespokeQuestionOptionsTranslation.create({
                data: {
                  ...translateKeysObj,
                  bespokeQuestionOptions: {
                    connect: {
                      id: element.id,
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
              await prisma.bespokeQuestionOptionsTranslation.create({
                data: {
                  label,
                  bespokeQuestionOptions: {
                    connect: { id: element.id },
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
        });
      }
    }

    return new NextResponse(
      JSON.stringify({
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

export async function GET() {
  try {
    const response = await prisma.bespokeQuestion.findMany({
      where: {
        formType: "becomePartner",
      },
      include: {
        bespokeQuestionOptions: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: response,
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
