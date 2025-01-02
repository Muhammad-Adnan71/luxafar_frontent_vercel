import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { ZodError } from "zod";
import { translateObj, translateService } from "@utils/translate";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { i18n } from "i18n.config";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { media, id: _id, imageId, ...rest } = body;

    const updatedFeature = await prisma.destinationFeatures.update({
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
    const featuresTranslation =
      await prisma.destinationFeaturesTranslation.findMany({
        where: { destinationFeatureId: id },
        include: {
          language: true,
        },
      });
    featuresTranslation.forEach(async ({ language: { locale }, id }: any) => {
      const { name } = rest;
      if (locale !== "en") {
        const translateKeysObj = { name };
        await translateObj(translateKeysObj, "en", locale, translateService);
        await prisma.destinationFeaturesTranslation.update({
          where: {
            id: id,
          },
          data: {
            ...translateKeysObj,
          },
        });
      } else {
        await prisma.destinationFeaturesTranslation.update({
          where: {
            id: id,
          },
          data: {
            name,
          },
        });
      }
    });
    const featureResponse = await convertMediaIdsResponseIntoMediaUrl(
      updatedFeature
    );
    return new NextResponse(
      JSON.stringify({
        data: {
          ...featureResponse,
        },
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
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const destinationFeature = await prisma.destinationFeatures.delete({
      where: { id: id },
    });

    return new NextResponse(
      JSON.stringify({
        data: destinationFeature,
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
