import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { translateObj, translateService } from "@utils/translate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const languages = await prisma.languages.findMany({});

    const pages = await prisma.pages.create({
      data: {
        ...body,
        content: {
          create: [...body.content],
        },
      },
      include: {
        content: true,
      },
    });
    pages.content.forEach((element: any) => {
      languages.forEach(async (lang) => {
        const { title, description, subTitle, buttonText } = element;
        if (lang.locale !== "en") {
          const translateKeysObj = { title, description, subTitle, buttonText };

          await translateObj(
            translateKeysObj,
            "en",
            lang.locale,
            translateService
          );
          await prisma.contentTranslation.create({
            data: {
              ...translateKeysObj,
              content: {
                connect: {
                  id: element.id,
                },
              },
              language: {
                connect: {
                  id: lang.id,
                },
              },
            },
          });
        } else {
          await prisma.contentTranslation.create({
            data: {
              title,
              description,
              subTitle,
              buttonText,
              content: {
                connect: { id: element.id },
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
    });

    return new NextResponse(
      JSON.stringify({
        data: pages,
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

export async function GET() {
  try {
    const pages = await prisma.pages.findMany({
      where: {
        showInPages: true,
      },
      orderBy: {
        sortId: "asc",
      },
      include: {
        content: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: pages,
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
