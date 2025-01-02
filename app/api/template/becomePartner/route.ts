import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { verifyCaptchaAction } from "libraries/recaptcha";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { i18n } from "i18n.config";

export async function POST(req: NextRequest) {
  const { gReCaptchaToken, becomePartnerFormQuestionAndAnswer, ...rest } =
    await req.json();
  const verify = await verifyCaptchaAction(gReCaptchaToken);

  if (!verify) {
    return new NextResponse(
      JSON.stringify({
        message: "recaptcha token is not verify",
        status: "error",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const form = await prisma.becomePartner.create({
      data: {
        ...rest,
        gReCaptchaToken,
        becomePartnerFormQuestionAndAnswer: {
          createMany: {
            data: [...becomePartnerFormQuestionAndAnswer],
          },
        },
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: form,
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
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") || i18n.defaultLocale;
  try {
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: {
        formType: "becomePartner",
      },
      include: {
        BespokeQuestionTranslation: {
          where: {
            language: {
              locale,
            },
          },
        },
        bespokeQuestionOptions: {
          include: {
            BespokeQuestionOptionsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: bespokeQuestions.map((ele) => ({
          ...ele,
          ...ele.BespokeQuestionTranslation[0],
          bespokeQuestionOptions: ele.bespokeQuestionOptions.map((item) => ({
            ...item,
            ...item.BespokeQuestionOptionsTranslation[0],
          })),
        })),
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
