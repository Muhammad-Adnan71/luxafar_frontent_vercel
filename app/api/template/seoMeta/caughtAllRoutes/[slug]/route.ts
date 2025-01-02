import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  request: NextRequest,
  { params: { slug } }: { params: { slug: string } }
) {
  const url = new URL(request.url);
  try {
    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Page slug is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    const route = await prisma.caughtAllRoutes.findFirst({
      where: {
        OR: [
          {
            destinations: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            inspirations: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            placeToVisit: {
              seoMeta: {
                slug: slug,
              },
            },
          },
          {
            tours: {
              seoMeta: {
                slug: slug,
              },
            },
          },
        ],
      },
      include: {
        destinations: true,
        inspirations: true,
        placeToVisit: true,
        tours: true,
      },
    });

    if (route?.layout === "destination") {
      try {
        const destination = await prisma.destinations.findFirstOrThrow({
          where: {
            isActive: true,
            seoMeta: {
              slug: slug,
            },
          },
          include: {
            content: {
              include: {
                media: true,
              },
            },
            seoMeta: true,
          },
        });

        return new NextResponse(
          JSON.stringify({
            data: {
              layout: "destination",
              destination,
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
    } else if (route?.layout === "tour") {
      try {
        const tourById = await prisma.tours.findFirstOrThrow({
          where: {
            isDeleted: false,
            seoMeta: {
              slug: slug,
            },
          },
          include: {
            seoMeta: true,
          },
        });

        return new NextResponse(
          JSON.stringify({
            data: {
              layout: "tour",
              tour: tourById,
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
    } else if (route?.layout === "place") {
      try {
        const placeById = await prisma.placeToVisit.findFirstOrThrow({
          where: {
            isDeleted: false,
            seoMeta: {
              slug: slug,
            },
          },
          include: {
            seoMeta: true,
          },
        });

        return new NextResponse(
          JSON.stringify({
            data: {
              layout: "place",
              place: placeById,
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
    } else if (route?.layout === "inspiration") {
      try {
        const inspiration = await prisma.inspirations.findFirstOrThrow({
          where: {
            isActive: true,
            isDeleted: false,

            AND: [
              {
                seoMeta: {
                  slug: {
                    contains: slug,
                  },
                },
              },
            ],
          },
          include: {
            seoMeta: true,
            media: true,
            destination: true,
            inspirationDetail: {
              orderBy: [
                {
                  sortId: "asc",
                },
                { id: "desc" },
              ],
              include: {
                media: true,
              },
            },
          },
        });

        return new NextResponse(
          JSON.stringify({
            data: {
              layout: "inspiration",
              inspiration,
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
    return new NextResponse(
      JSON.stringify({
        message: "Slug not found",
        status: "Error",
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
