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
    const response = await prisma.thingsToDo.findMany({
      orderBy: {
        sortId: "asc",
      },
      where: {
        destinationId: id,
      },
      include: { media: true, destination: true },
    });

    const thingsToDoResponse = await convertMediaIdsResponseIntoMediaUrl(
      response
    );

    return new NextResponse(
      JSON.stringify({
        data: thingsToDoResponse,
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

    const thingsToDoDB = await prisma.thingsToDo.findMany({
      where: { destinationId: id },
      select: {
        id: true,
      },
    });

    const thingsToDoIds = body.thingsToDo.map((item: any) => item.id);

    const deleteThingsToDoIds = thingsToDoDB
      .filter((item: any) => !thingsToDoIds.includes(item.id))
      .map((item: any) => item.id)
      .filter((ele) => ele);

    const highestSortIdThing = await prisma.thingsToDo.findFirst({
      where: {
        destinationId: Number(id),
      },
      orderBy: { sortId: "desc" },
    });
    const languages = await prisma.languages.findMany({});

    body.thingsToDo.map(async (element: any, index: number) => {
      const { destinationId, media, id: elementId, imageId, ...rest } = element;
      if (element.id) {
        const oldThings = await prisma.thingsToDo.findFirst({
          where: {
            id: elementId,
          },
          select: {
            title: true,
            description: true,
          },
        });
        const updatedThings = await prisma.thingsToDo.update({
          where: {
            id: elementId,
          },
          data: {
            ...rest,
            media: {
              update: media,
            },
            destination: { connect: { id: destinationId } },
          },
        });
        const { title, description, ...restPayload } = rest;
        const translateKeysObj = { title, description };
        const diffValues = getDifferentValues(oldThings, translateKeysObj);
        if (Object.keys(diffValues).length) {
          const thingsTranslation = await prisma.thingsToDoTranslation.findMany(
            {
              where: { thingToDoId: updatedThings.id },
              include: {
                language: true,
              },
            }
          );
          thingsTranslation.map(async ({ language: { locale }, id }: any) => {
            if (locale !== "en") {
              await translateObj(diffValues, "en", locale, translateService);
              await prisma.thingsToDoTranslation.update({
                where: {
                  id: id,
                },
                data: {
                  ...diffValues,
                },
              });
            } else {
              await prisma.thingsToDoTranslation.update({
                where: {
                  id: id,
                },
                data: { title, description },
              });
            }
          });
        }
      } else {
        const newThing = await prisma.thingsToDo.create({
          data: {
            ...rest,
            sortId: highestSortIdThing?.sortId
              ? highestSortIdThing.sortId + 1
              : 1,
            destination: { connect: { id: destinationId } },
            media: {
              create: media,
            },
          },
        });

        languages.forEach(async (lang) => {
          const { title, description } = rest;
          if (lang.locale !== "en") {
            const translateKeysObj = { title, description };
            await translateObj(
              translateKeysObj,
              "en",
              lang.locale,
              translateService
            );

            await prisma.thingsToDoTranslation.create({
              data: {
                ...translateKeysObj,
                thingsToDo: {
                  connect: { id: newThing.id },
                },
                language: {
                  connect: {
                    id: lang.id,
                  },
                },
              },
            });
          } else {
            await prisma.thingsToDoTranslation.create({
              data: {
                title,
                description,
                thingsToDo: {
                  connect: { id: newThing.id },
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

    await prisma.thingsToDo.deleteMany({
      where: {
        id: {
          in: deleteThingsToDoIds,
        },
      },
    });
    const thingsTodo = await prisma.thingsToDo.findMany({
      where: { destinationId: id },
    });
    const thingsToDoResponse = await convertMediaIdsResponseIntoMediaUrl(
      thingsTodo
    );

    return new NextResponse(
      JSON.stringify({
        data: thingsToDoResponse,
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
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);

    const response = await prisma.thingsToDo.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
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
