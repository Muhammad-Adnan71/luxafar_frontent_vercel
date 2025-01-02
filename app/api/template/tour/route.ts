import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const destinationId = url.searchParams.get("destinationId");
  const holidayTypeId = url.searchParams.get("holidayTypeId");
  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const locale = url.searchParams.get("locale") || "";
  const path = req.nextUrl.searchParams.get("path") || i18n.defaultLocale;
  revalidatePath(path);

  try {
    const [toursCount, tours] = await prisma.$transaction([
      prisma.tours.count({
        where: {
          isActive: true,
          isDeleted: false,

          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),

          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },
      }),
      prisma.tours.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        where: {
          isActive: true,
          isDeleted: false,

          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          ...(destinationId && {
            tourDestinations: {
              some: {
                destinationId: Number(destinationId),
              },
            },
          }),
          ...(holidayTypeId && {
            tourHoliDayType: {
              some: {
                holidayTypeId: Number(holidayTypeId),
              },
            },
          }),
        },

        orderBy: {
          sortId: "desc",
        },

        include: {
          bannerImageMedia: true,
          ToursTranslation: {
            where: {
              language: { locale },
            },
          },
          tourDestinations: {
            include: {
              destination: true,
            },
          },
          seoMeta: true,
        },
      }),
    ]);
    const [toursResponse] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          count: toursCount,
          tours: toursResponse.map((item: any) => ({
            ...item,
            ...item.ToursTranslation?.[0],
            destination: item.tourDestinations?.[0]?.destination,
          })),
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
