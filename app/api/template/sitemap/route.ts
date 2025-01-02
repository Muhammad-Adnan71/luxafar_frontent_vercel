import { SeoMeta } from "./../../../../utils/types";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const allActiveInspirationWithTitle = await prisma.inspirations.findMany({
      select: {
        title: true,
        updatedAt: true,
        seoMeta: true,
        destination: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveHolidayTypeWithTitle = await prisma.holidayType.findMany({
      select: { name: true, updatedAt: true, seoMeta: true },
      where: {
        isActive: true,
      },
    });

    const allActivePlacesWithTitle = await prisma.placeToVisit.findMany({
      select: {
        destination: true,
        title: true,
        updatedAt: true,
        seoMeta: true,
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveToursWithTitle = await prisma.tours.findMany({
      include: {
        seoMeta: true,
        tourDestinations: {
          include: {
            destination: true,
          },
        },
      },
      where: {
        isDeleted: false,
        isActive: true,
      },
    });

    const allActiveDestinationWithTitle = await prisma.destinations.findMany({
      select: {
        name: true,
        updatedAt: true,
        seoMeta: {
          select: {
            slug: true,
          },
        },
        tourDestinations: {
          where: {
            tour: {
              isDeleted: false,
              isActive: true,
            },
          },
          include: {
            tour: true,
          },  
        },
      },
      where: {
        isActive: true,
        isDeleted: false,
        placeToVisit: {
          some: {
            // This ensures the destination has at least one related placeToVisit
            isActive: true,
            isDeleted: false,
          },
        },
      },
    });
    console.log(allActiveDestinationWithTitle);

    return new NextResponse(
      JSON.stringify({
        data: {
          allActiveInspirationWithTitle,
          allActiveHolidayTypeWithTitle,
          allActivePlacesWithTitle,
          allActiveToursWithTitle,
          allActiveDestinationWithTitle,
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
