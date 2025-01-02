import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Holiday type name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);
  try {
    const holidayType = await prisma.holidayType.findFirstOrThrow({
      where: {
        isActive: true,

        seoMeta: {
          slug: params.name,
        },
      },
      include: {
        seoMeta: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: {
          holidayType,
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
