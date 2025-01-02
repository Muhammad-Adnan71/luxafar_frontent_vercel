import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { highlights, media, seoMeta, seoMetaId, ...rest } = await req.json();

    const newHolidayType = await prisma.holidayType.create({
      data: {
        ...rest,
        media: {
          create: media,
        },

        seoMeta: {
          create: seoMeta,
        },

        highlights: {
          create: highlights.map((ele: any) => ({
            ...ele,
            media: {
              create: ele.media,
            },
          })),
        },
      },
      include: {
        highlights: {
          include: {
            media: true,
          },
        },
      },
    });
    const languages = await prisma.languages.findMany({});

    languages.forEach(async (lang) => {
      const { name, description, mainSectionHeading, mainSectionDescription } =
        rest;
      if (lang.locale !== "en") {
        const translateKeysObj = {
          name,
          description,
          mainSectionHeading,
          mainSectionDescription,
        };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.holidayTypeTranslation.create({
          data: {
            ...translateKeysObj,
            holidayType: {
              connect: { id: newHolidayType.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.holidayTypeTranslation.create({
          data: {
            name,
            description,
            mainSectionHeading,
            mainSectionDescription,

            holidayType: {
              connect: { id: newHolidayType.id },
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
    newHolidayType.highlights.forEach((element: any) => {
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
          await prisma.highlightsTranslation.create({
            data: {
              ...translateKeysObj,
              Highlights: {
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
          await prisma.highlightsTranslation.create({
            data: {
              description,
              Highlights: {
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
        data: newHolidayType,
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
  const isActive = url.searchParams.get("active");

  try {
    const holidayTypes = await prisma.holidayType.findMany({
      where: {
        ...(isActive && { isActive: true }),
      },
      orderBy: {
        id: "desc",
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: holidayTypes,
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
