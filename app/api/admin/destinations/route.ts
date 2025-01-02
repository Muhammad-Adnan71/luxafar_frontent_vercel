import { create } from "zustand";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getUploadsUrl } from "@utils/services/uploads";
import { i18n } from "i18n.config";
import { translateObj, translateService } from "@utils/translate";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isActive = url.searchParams.get("active");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const searchParams = url.searchParams.get("searchParams");
  const destinationId = url.searchParams.get("destinationId");
  const sortBy = url.searchParams.get("sortBy");
  try {
    const destinationCount = await prisma.destinations.count({
      where: {
        ...(isActive && { isActive: true }),
        isDeleted: false,
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
    });
    const destinations = await prisma.destinations.findMany({
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),

      where: {
        ...(isActive && { isActive: true }),
        isDeleted: false,
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
      include: {
        content: {
          include: {
            media: true,
          },
        },
      },
      orderBy: {
        ...(sortBy ? { [sortBy]: "asc" } : { id: "desc" }),
      },
    });

    const destinationResponse = await Promise.all(
      destinations.map(async (destination: any) => {
        const mediaUrls = await getUploadsUrl({
          desktopMediaUrl: destination?.content?.[0]?.media?.desktopMediaUrl,
        });
        return {
          ...destination,
          image: mediaUrls?.data?.[0]?.desktopMediaUrl,
        };
      })
    );

    return new NextResponse(
      JSON.stringify({
        data: destinationResponse,
        count: destinationCount,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, destinationFeatureOffered, seoMeta, seoMetaId, ...rest } =
      await req.json();
    const languages = await prisma.languages.findMany({});

    const newDestination = await prisma.destinations.create({
      data: {
        ...rest,
        caughtAllRoutes: {
          create: {
            route: seoMeta.slug,
            layout: "destination",
          },
        },
        content: {
          create: [
            ...content.map(({ media, ...item }: any) => ({
              ...item,
              media: {
                create: media,
              },
            })),
          ],
        },
        seoMeta: {
          create: seoMeta,
        },
        destinationFeatureOffered: {
          create: [
            ...destinationFeatureOffered.map((item: any) => ({
              ...item,
            })),
          ],
        },
      },
      include: {
        content: {
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
    languages.forEach(async (lang) => {
      const { description } = rest;
      if (lang.locale !== "en") {
        const translateKeysObj = { description };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.destinationsTranslation.create({
          data: {
            ...translateKeysObj,
            destination: {
              connect: { id: newDestination.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.destinationsTranslation.create({
          data: {
            description,

            destination: {
              connect: { id: newDestination.id },
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

    newDestination.content.forEach((element: any) => {
      languages.forEach(async (lang) => {
        const { title, description, subTitle, buttonText } = element;
        if (lang.locale !== "en") {
          const translateKeysObj = { title, description, subTitle, buttonText };

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
          await prisma.contentTranslation.create({
            data: {
              title,
              description,
              subTitle,
              buttonText,
              content: {
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

    newDestination.destinationFeatureOffered.forEach((element: any) => {
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
          await prisma.destinationFeatureOfferedTranslation.create({
            data: {
              description,
              destinationFeatureOffered: {
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
        data: newDestination,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
