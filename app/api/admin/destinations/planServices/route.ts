import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { MediaResponse } from "@utils/types";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { ZodError } from "zod";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { translateObj, translateService } from "@utils/translate";
import { i18n } from "i18n.config";

export async function POST(req: NextRequest) {
  try {
    const { media, ...rest } = await req.json();
    const languages = await prisma.languages.findMany({});

    const newPlan = await prisma.planService.create({
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
        await prisma.planServiceTranslation.create({
          data: {
            ...translateKeysObj,
            planService: {
              connect: { id: newPlan.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.planServiceTranslation.create({
          data: {
            name,
            planService: {
              connect: { id: newPlan.id },
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

    const planServiceResponse = await convertMediaIdsResponseIntoMediaUrl(
      newPlan
    );

    return new NextResponse(
      JSON.stringify({
        data: planServiceResponse,
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
  try {
    const planServices = await prisma.planService.findMany({
      include: { media: true },
      orderBy: {
        id: "desc",
      },
    });
    const planResponse = await convertMediaIdsResponseIntoMediaUrl(
      planServices
    );
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
