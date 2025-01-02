import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      reviews,
      attraction,
      media,
      destinationId,
      seoMeta,
      seoMetaId,
      ...rest
    } = await req.json();

    let newSeoMeta: any;
    if (!seoMetaId) {
      newSeoMeta = await prisma.seoMeta.create({
        data: seoMeta,
      });
    }
    const highestSortIdPlace = await prisma.placeToVisit.findFirst({
      where: {
        destinationId: Number(destinationId),
      },
      orderBy: { sortId: "desc" },
    });
    const newPlace = await prisma.placeToVisit.create({
      data: {
        ...rest,
        sortId: highestSortIdPlace?.sortId ? highestSortIdPlace.sortId + 1 : 1,
        destination: { connect: { id: Number(destinationId) } },
        media: {
          create: media,
        },
        caughtAllRoutes: {
          create: {
            route: seoMeta.slug,
            layout: "place",
          },
        },
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
        reviews: {
          create: reviews.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
        attraction: {
          create: attraction.map((ele: any, index: any) => ({
            ...ele,
            sortId: index + 1,
            media: {
              create: ele.media,
            },
          })),
        },
      },
      include: {
        attraction: {
          include: {
            media: true,
          },
        },
      },
    });

    const languages = await prisma.languages.findMany({});

    languages.forEach(async (lang) => {
      const { title, description, attractionTitle, attractionDescription } =
        rest;
      if (lang.locale !== "en") {
        const translateKeysObj = {
          title,
          description,
          attractionTitle,
          attractionDescription,
        };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.placeToVisitTranslation.create({
          data: {
            ...translateKeysObj,
            placeToVisit: {
              connect: { id: newPlace.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.placeToVisitTranslation.create({
          data: {
            title,
            description,
            attractionTitle,
            attractionDescription,

            placeToVisit: {
              connect: { id: newPlace.id },
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

    newPlace.attraction.forEach((element: any) => {
      languages.forEach(async (lang) => {
        const { title, description } = element;
        if (lang.locale !== "en") {
          const translateKeysObj = { title, description };

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
          await prisma.attractionTranslation.create({
            data: {
              title,
              description,
              attraction: {
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

    return new NextResponse(
      JSON.stringify({
        data: newPlace,
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
    const destinationCount = await prisma.destinations.count({
      where: {
        isDeleted: false,
        placeToVisit: {
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
            {
              placeToVisit: {
                some: {
                  title: {
                    contains: searchParams,
                  },
                },
              },
            },
          ],
        }),
      },
    });

    const destinations = await prisma.destinations.findMany({
      include: {
        placeToVisit: {
          where: {
            isDeleted: false,
          },
          orderBy: {
            sortId: "asc",
          },
        },
      },
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),
      where: {
        isDeleted: false,
        placeToVisit: {
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
            {
              placeToVisit: {
                some: {
                  title: {
                    contains: searchParams,
                  },
                },
              },
            },
          ],
        }),
      },
      orderBy: {
        id: "desc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        count: destinationCount,
        data: destinations,
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
      const draggedPlace = await prisma.placeToVisit.findUnique({
        where: {
          id: sourceId,
          destinationId: destinationId,
        },
      });

      await tx.placeToVisit.update({
        where: {
          id: draggedPlace?.id,
          destinationId: destinationId,
        },
        data: {
          sortId: destinationIdSortId,
        },
      });

      await tx.placeToVisit.updateMany({
        where: {
          AND: {
            NOT: {
              id: sourceId,
            },
            destinationId: destinationId,
            sortId: {
              gte: Math.min(
                draggedPlace?.sortId as number,
                destinationIdSortId
              ),
              lte: Math.max(
                draggedPlace?.sortId as number,
                destinationIdSortId
              ),
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
