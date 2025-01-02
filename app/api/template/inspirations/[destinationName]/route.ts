import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "@utils/api-helpers";
import { i18n } from "i18n.config";

export async function GET(
  req: NextRequest,
  { params }: { params: { destinationName: string } }
) {
  try {
    if (!params?.destinationName) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Destination Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const path = req.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);
    const url = new URL(req.url);
    const pageSize = url.searchParams.get("pageSize");
    const pageNum = url.searchParams.get("pageNum");
    const locale = url.searchParams.get("locale") || i18n.defaultLocale;
    const destinationName = params?.destinationName?.replaceAll("-", " ");

    const [featuredInspiration, inspirationCount, inspirations] =
      await prisma.$transaction(async (tx) => {
        let featuredInspiration = await tx.inspirations.findFirst({
          where: {
            isDeleted: false,
            isFeatured: true,

            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },
          include: {
            media: true,
            destination: true,
            seoMeta: true,
            InspirationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
          },
        });

        if (!featuredInspiration) {
          featuredInspiration = await tx.inspirations.findFirst({
            where: {
              isDeleted: false,
              ...(destinationName && {
                destination: { some: { name: destinationName } },
              }),

              sortId: 1,
            },

            include: {
              media: true,
              destination: true,
              seoMeta: true,
              InspirationsTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
          });
        }
        const inspirationCount = await tx.inspirations.count({
          where: {
            isDeleted: false,
            isFeatured: false,
            isActive: true,

            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },
        });
        const inspirations = await tx.inspirations.findMany({
          ...(pageNum && {
            skip: (Number(pageNum) - 1) * Number(pageSize),
          }),
          ...(pageSize && { take: Number(pageSize) }),
          where: {
            isDeleted: false,
            isFeatured: false,

            id: {
              not: featuredInspiration?.id,
            },
            isActive: true,
            ...(destinationName && {
              destination: { some: { name: destinationName } },
            }),
          },

          orderBy: {
            id: "asc",
          },

          include: {
            media: true,
            seoMeta: true,
            destination: true,
            InspirationsTranslation: {
              where: {
                language: {
                  locale,
                },
              },
            },
            inspirationDetail: {
              include: {
                InspirationDetailTranslation: {
                  where: {
                    language: {
                      locale,
                    },
                  },
                },
                media: true,
              },
            },
          },
        });
        return [featuredInspiration, inspirationCount, inspirations];
      });

    const [inspirationsResponse, featuredInspirationResponse] =
      await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(inspirations),
        convertMediaIdsResponseIntoMediaUrl(featuredInspiration),
      ]);

    return new NextResponse(
      JSON.stringify({
        count: inspirationCount,
        data: {
          inspirations: inspirationsResponse.map((ele: any) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
            inspirationDetail: ele.inspirationDetail.map((item: any) => ({
              ...item,
              ...item.InspirationDetailTranslation?.[0],
            })),
          })),
          featuredInspiration: {
            ...featuredInspirationResponse,
            ...featuredInspirationResponse.InspirationsTranslation?.[0],
          },
        },
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
