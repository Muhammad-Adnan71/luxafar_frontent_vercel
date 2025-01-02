import nodemailer from "nodemailer";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { verifyCaptchaAction } from "libraries/recaptcha";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { emailTemplate } from "@utils/template/contact";
import { bespokeTemplate } from "@utils/template/bespoke";
import { i18n } from "i18n.config";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { sendEmailService } from "@utils/email-config";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") || i18n.defaultLocale;

  try {
    const bespokeQuestions = await prisma.bespokeQuestion.findMany({
      where: {
        formType: "bespoke",
      },
      orderBy: { sortId: "asc" },
      include: {
        BespokeQuestionTranslation: {
          where: {
            language: {
              locale,
            },
          },
          select: {
            question: true,
            textPlaceholder: true,
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
export async function POST(req: NextRequest) {
  const {
    gReCaptchaToken,
    bespokeFormQuestionAndAnswer,
    preferredCountry: country,
    ...rest
  } = await req.json();

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
    const { name, email, countryCode, phoneNumber, tripDays } = rest;

    const form = await prisma.bespokeForm.create({
      data: {
        ...rest,
        phoneNumber: countryCode + phoneNumber,
        preferredCountry: country,
        tripDays,
        gReCaptchaToken,
        bespokeFormQuestionAndAnswer: {
          createMany: {
            data: [...bespokeFormQuestionAndAnswer],
          },
        },
      },
      include: {
        bespokeFormQuestionAndAnswer: {
          include: {
            BespokeQuestion: {
              include: {
                bespokeQuestionOptions: true,
              },
            },
          },
        },
      },
    });

    const questions = form.bespokeFormQuestionAndAnswer.map((item) => {
      return {
        type: item.BespokeQuestion?.type,
        name: item.BespokeQuestion?.question,
        answer:
          item.BespokeQuestion?.type === "2"
            ? item?.answer?.split(",")
            : item?.answer,
        additional_text: item.additionalText,
      };
    });

    await fetch(`http://54.254.236.177:8070/web/bespoke`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        params: {
          name,
          email,
          medium: "Website",
          type_of_form: "Bespoke",
          phone: countryCode + phoneNumber,
          which_country: country,
          start_date: rest.travelingStartDate,
          end_date: rest.travelingEndDate,
          trip_length: tripDays,
          source: rest.whereDidYouHear,
          source_details: rest?.social ?? rest?.referralName ?? rest.other,
          questions: questions,
        },
      }),
    });
    const destinationContent = await prisma.destinations.findFirst({
      where: {
        name: country,
      },
      include: {
        inspirations: true,
        content: {
          include: {
            media: true,
          },
        },
      },
    });
    if (destinationContent?.inspirations.length) {
      const inspirations = await prisma.inspirations.findMany({
        where: {
          isActive: true,
          isDeleted: false,
          destination: {
            some: {
              name: country,
            },
          },
        },
        include: {
          destination: true,
          seoMeta: true,
          media: true,
        },
        orderBy: {
          id: "desc",
        },
        take: 3,
      });

      const [contentResponse, inspirationResponse] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(destinationContent?.content),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
      ]);
      const bannerImage = contentResponse.find(
        (ele: any) => ele.name === "get bespoke plan"
      );

      await sendEmailService(
        email,
        emailTemplate(
          inspirationResponse,
          name,
          bannerImage?.media?.desktopMediaUrl
        )
      );
    } else {
      const destinations = await prisma.destinations.findMany({
        take: 3,
        orderBy: {
          id: "desc",
        },
        where: {
          inspirations: {
            some: {},
          },
        },
        include: {
          inspirations: {
            take: 1,
            include: {
              seoMeta: true,
              media: true,
              destination: true,
            },
          },
        },
      });
      const inspiration = destinations.map((ele: any) => ({
        ...ele.inspirations[0],
      }));
      const [inspirationResponse] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspiration),
      ]);

      await sendEmailService(email, emailTemplate(inspirationResponse, name));
    }

    if (process.env.NEXT_PUBLIC_API_URL === "https://luxafar.com") {
      await sendEmailService(
        "no-reply@luxafar.com",
        bespokeTemplate(
          name,
          email,
          countryCode,
          phoneNumber,
          country,
          tripDays,
          form
        ),
        "Bespoke Form"
      );
    } else {
      await sendEmailService(
        "demo.luxafar@ideabox.pk",
        bespokeTemplate(
          name,
          email,
          countryCode,
          phoneNumber,
          country,
          tripDays,
          form
        ),
        "Bespoke Form"
      );
    }

    return new NextResponse(
      JSON.stringify({
        data: "form",
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
