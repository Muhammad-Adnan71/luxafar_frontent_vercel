import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { ZodError } from "zod";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { media, id: _id, imageId, ...rest } = body;

    const updatedPlan = await prisma.planService.update({
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
    const planServiceTranslation = await prisma.planServiceTranslation.findMany(
      {
        where: { planServiceId: id },
        include: {
          language: true,
        },
      }
    );
    planServiceTranslation.forEach(
      async ({ language: { locale }, id }: any) => {
        const { name } = rest;
        if (locale !== "en") {
          const translateKeysObj = { name };
          await translateObj(translateKeysObj, "en", locale, translateService);
          await prisma.planServiceTranslation.update({
            where: {
              id: id,
            },
            data: {
              ...translateKeysObj,
            },
          });
        } else {
          await prisma.planServiceTranslation.update({
            where: {
              id: id,
            },
            data: {
              name,
            },
          });
        }
      }
    );
    const planResponse = await convertMediaIdsResponseIntoMediaUrl(updatedPlan);
    return new NextResponse(
      JSON.stringify({
        data: planResponse,
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
    const planService = await prisma.planService.delete({
      where: { id: id },
    });

    return new NextResponse(
      JSON.stringify({
        data: { ...planService },
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
