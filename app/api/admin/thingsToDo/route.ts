import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const checkExistingThings = await prisma.thingsToDo.findMany({
      where: { destinationId: Number(body.destinationId) },
    });
    if (checkExistingThings?.length > 0) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "ThingsToDo is created with this destination",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const thingsResponse = body.thingsTodo.map(
      async (element: any, index: number) => {
        const { destinationId, media, ...rest } = element;
        const languages = await prisma.languages.findMany({});

        const newThings = await prisma.thingsToDo.create({
          data: {
            ...rest,
            sortId: index + 1,
            media: {
              create: media,
            },
            destination: { connect: { id: destinationId } },
          },
          include: {
            media: true,
          },
        });

        languages.forEach(async (lang) => {
          const { title, description } = rest;
          if (lang.locale !== "en") {
            const translateKeysObj = {
              title,
              description,
            };
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
                  connect: { id: newThings.id },
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
                  connect: { id: newThings.id },
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
    );

    return new NextResponse(
      JSON.stringify({
        data: thingsResponse,
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");

  try {
    const [destinationCount, destinationsWithThingsToDo] =
      await prisma.$transaction([
        prisma.destinations.count({
          where: {
            isDeleted: false,
            thingsToDo: {
              some: {
                isDeleted: false,
              },
            },
            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
              ],
            }),
          },
        }),
        prisma.destinations.findMany({
          ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
          ...(pageSize && { take: Number(pageSize) }),

          where: {
            isDeleted: false,
            thingsToDo: {
              some: {
                isDeleted: false,
              },
            },
            ...(searchParams && {
              OR: [
                {
                  name: {
                    contains: searchParams,
                  },
                },
              ],
            }),
          },
          orderBy: {
            id: "desc",
          },
          include: {
            thingsToDo: {
              orderBy: {
                sortId: "asc",
              },
            },
          },
        }),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: destinationCount,
        data: destinationsWithThingsToDo,
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

export async function PUT(req: NextRequest) {
  try {
    const { sourceId, sortPosition, destinationIdSortId, destinationId } =
      await req.json();
    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }

    await prisma.$transaction(async (tx) => {
      const draggedTour = await prisma.thingsToDo.findUnique({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
      });

      await tx.thingsToDo.updateMany({
        where: {
          id: draggedTour?.id,
          destinationId: destinationId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.thingsToDo.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            destinationId: destinationId,
            sortId: {
              gte: Math.min(draggedTour?.sortId as number, destinationIdSortId),
              lte: Math.max(draggedTour?.sortId as number, destinationIdSortId),
            },
          },
        },
        data: {
          ...(sortPosition > 0
            ? { sortId: { increment: 1 } }
            : { sortId: { decrement: 1 } }),
        },
      });
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        data: "updated successfully",
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
