import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { BannerSchema } from "@utils/validations/banner.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { translateObj, translateService } from "@utils/translate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { media, ...rest } = body;
    const languages = await prisma.languages.findMany({});
    const newBanner = await prisma.banner.create({
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
      const { title, description, buttonText } = rest;
      if (lang.locale !== "en") {
        const translateKeysObj = { title, description, buttonText };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.bannerTranslation.create({
          data: {
            ...translateKeysObj,
            Banner: {
              connect: { id: newBanner.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.bannerTranslation.create({
          data: {
            title,
            description,
            buttonText,
            Banner: {
              connect: { id: newBanner.id },
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

    

    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      newBanner
    );

    await prisma.banner.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        bannerTranslation: {
          some: {
            language: {
              locale: "en",
            },
          },
        },
      },
      include: {
        media: true,
        bannerTranslation: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: bannerMediaResponse,
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

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        id: "desc",
      },
      include: {
        media: true,
      },
    });
    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      banners
    );
    return new NextResponse(
      JSON.stringify({
        data: bannerMediaResponse,
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
