import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { FaqSchema } from "@utils/validations/faqs.schema";
import { i18n } from "i18n.config";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = FaqSchema.parse(body);
    const languages = await prisma.languages.findMany({});
    const newFaqs = await prisma.faqs.create({
      data: {
        ...data,
      },
    });
    languages.forEach(async (lang) => {
      const { question, answer } = data;
      if (lang.locale !== "en") {
        const translateKeysObj = { question, answer };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.faqsTranslation.create({
          data: {
            ...translateKeysObj,
            faqs: {
              connect: { id: newFaqs.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.faqsTranslation.create({
          data: {
            question,
            answer,
            faqs: {
              connect: { id: newFaqs.id },
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

    return new NextResponse(
      JSON.stringify({
        data: newFaqs,
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
    const faqs = await prisma.faqs.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        isDeleted: false,
      },
    });
    return new NextResponse(
      JSON.stringify({
        data: faqs,
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
