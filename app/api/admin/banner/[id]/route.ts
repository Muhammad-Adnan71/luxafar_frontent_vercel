import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import {
  convertMediaIdsResponseIntoMediaUrl,
  isNumeric,
} from "@utils/functions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
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
    const banner = await prisma.banner.findFirst({
      where: {
        id,
      },
      include: {
        media: true,
      },
    });

    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      banner
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");

    const body = await req.json();
    const { id: _id, media, imageId, ...rest } = body;
    const id = Number(params.id);
    const oldBanner = await prisma.banner.findFirst({
      where: { id },
      select: {
        title: true,
        description: true,
        buttonText: true,
      },
    });
    const updatedBanner = await prisma.banner.update({
      where: {
        id,
      },
      data: {
        ...rest,
        media: {
          update: media,
        },
      },
      include: {
        media: true,
      },
    });

    const { title, description, buttonText } = rest;
    const translateKeysObj = { title, description, buttonText };
    const diffValues = getDifferentValues(oldBanner, translateKeysObj);

    if (Object.keys(diffValues).length) {
      const bannerTranslation = await prisma.bannerTranslation.findMany({
        where: { bannerId: id },
        include: {
          language: true,
        },
      });
      bannerTranslation.map(async ({ language: { locale }, id }: any) => {
        if (locale !== "en") {
          await translateObj(diffValues, "en", locale, translateService);
          await prisma.bannerTranslation.update({
            where: {
              id: id,
            },
            data: {
              ...diffValues,
            },
          });
        } else {
          await prisma.bannerTranslation.update({
            where: {
              id: id,
            },
            data: {
              title,
              description,
              buttonText,
            },
          });
        }
      });
    }
    const bannerMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      updatedBanner
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
    if (error instanceof ZodError) {
      return getErrorResponse(400, "failed validations", error);
    }
    return getErrorResponse(500, error.message);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");

    const id = Number(params.id);
    const deletedBanner = await prisma.banner.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: deletedBanner,
        status: "success",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    if (error) {
      return getErrorResponse(400, "Error", error.message);
    }

    return getErrorResponse(500, error.message);
  }
}
