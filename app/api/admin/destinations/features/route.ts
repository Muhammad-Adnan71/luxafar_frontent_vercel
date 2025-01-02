import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";

export async function POST(req: NextRequest) {
  try {
    const { media, ...rest } = await req.json();
    const languages = await prisma.languages.findMany({});

    const newFeature = await prisma.destinationFeatures.create({
      data: {
        ...rest,
        media: {
          create: media,
        },
      },
      include: {
        media: true,
      },
    });
    languages.forEach(async (lang) => {
      const { name } = rest;
      if (lang.locale !== "en") {
        const translateKeysObj = { name };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.destinationFeaturesTranslation.create({
          data: {
            ...translateKeysObj,
            destinationFeatures: {
              connect: { id: newFeature.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.destinationFeaturesTranslation.create({
          data: {
            name,
            destinationFeatures: {
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
    const featured = await convertMediaIdsResponseIntoMediaUrl(newFeature);
    return new NextResponse(
      JSON.stringify({
        data: featured,
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const isActive = url.searchParams.get("active");

  try {
    const destinationFeatures = await prisma.destinationFeatures.findMany({
      include: {
        media: true,
      },
      where: {
        ...(isActive && { isActive: true }),
      },
      orderBy: {
        id: "desc",
      },
    });
    const response = await convertMediaIdsResponseIntoMediaUrl(
      destinationFeatures
    );

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
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }

    return getErrorResponse(500, error.message);
  }
}
