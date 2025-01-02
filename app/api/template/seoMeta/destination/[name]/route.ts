import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { i18n } from "i18n.config";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const path = req.nextUrl.searchParams.get("path") || "/";
  revalidatePath(path);

  if (!params.name) {
    return new NextResponse(
      JSON.stringify({
        status: "errors",
        message: "Destination name is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const destinationExists = await prisma.destinations.findFirstOrThrow({
      where: {
        isActive: true,

        name: params?.name?.toLowerCase()?.replaceAll("-", " "),
      },
      select: {
        id: true,

        // tourDestinations: {
        //   where: {
        //     tour: {
        //       isDeleted: false,
        //       isActive: true,
        //     },
        //   },
        // },
        placeToVisit: {
          where: {
            isDeleted: false,
            isActive: true,
          },
        },
      },
    });

    if (destinationExists.placeToVisit.length) {
      const destination = await prisma.destinations.findFirstOrThrow({
        where: {
          isActive: true,

          id: Number(destinationExists?.id),
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
            destination,
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return getErrorResponse(500, "Destination has no tours");
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
