import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  const locale = req.nextUrl.searchParams.get("locale") || i18n.defaultLocale;
  revalidatePath(path);

  try {
    const [holidayTypes, inspirations] = await prisma.$transaction([
      prisma.holidayType.findMany({
        where: {
          isActive: true,
        },
        include: {
          media: true,
          seoMeta: true,
          HolidayTypeTranslation: {
            where: {
              language: { locale },
            },
          },
        },
      }),
      prisma.inspirations.findMany({
        where: {
          isDeleted: false,
          isActive: true,
        },
        take: 3,
        orderBy: {
          id: "desc",
        },
        include: {
          seoMeta: true,
          destination: true,
          media: true,
          InspirationsTranslation: {
            where: {
              language: {
                locale,
              },
            },
          },
        },
      }),
    ]);

    const [holidayResponse, inspirationResponse] = await Promise.all([
      convertMediaIdsResponseIntoMediaUrl(holidayTypes),
      convertMediaIdsResponseIntoMediaUrl(inspirations),
    ]);

    return new NextResponse(
      JSON.stringify({
        data: {
          holidayTypes: holidayResponse.map((ele: any) => ({
            ...ele,
            name: ele.HolidayTypeTranslation?.[0].name,
            description: ele.HolidayTypeTranslation?.[0].description,
            mainSectionHeading:
              ele.HolidayTypeTranslation?.[0].mainSectionHeading,
            mainSectionDescription:
              ele.HolidayTypeTranslation?.[0].mainSectionDescription,
          })),
          inspirations: inspirationResponse.map((ele: any) => ({
            ...ele,
            ...ele.InspirationsTranslation?.[0],
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
