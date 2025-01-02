import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { isNumeric } from "@utils/functions";
import { FaqSchema } from "@utils/validations/faqs.schema";
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
    const faqs = await prisma.faqs.findFirst({
      where: {
        id: id,
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");

    const id = Number(params.id);
    const body = await req.json();
    const data = FaqSchema.parse(body);
    const oldFaq = await prisma.faqs.findFirst({
      where: { id },
      select: {
        question: true,
        answer: true,
      },
    });
    const updatedFaq = await prisma.faqs.update({
      where: {
        id,
      },
      data: data,
    });
    const { question, answer } = data;
    const translateKeysObj = { question, answer };
    const diffValues = getDifferentValues(oldFaq, translateKeysObj);
    if (Object.keys(diffValues).length) {
      const faqsTranslation = await prisma.faqsTranslation.findMany({
        where: { faqId: id },
        include: {
          language: true,
        },
      });
      faqsTranslation.map(async ({ language: { locale }, id }: any) => {
        if (locale !== "en") {
          await translateObj(diffValues, "en", locale, translateService);
          await prisma.faqsTranslation.update({
            where: {
              id: id,
            },
            data: {
              ...diffValues,
            },
          });
        } else {
          await prisma.faqsTranslation.update({
            where: {
              id: id,
            },
            data: {
              question,
              answer,
            },
          });
        }
      });
    }

    return new NextResponse(
      JSON.stringify({
        data: updatedFaq,
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

    const deletedFaq = await prisma.faqs.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: deletedFaq,
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
