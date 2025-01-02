import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { MediaResponse } from "@utils/types";
import { NextResponse } from "next/server";
import { getUploadsUrl } from "@utils/services/uploads";
import { i18n } from "i18n.config";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import {
  getDifferentValues,
  translateObj,
  translateService,
} from "@utils/translate";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const response = await prisma.seasonToVisit.findMany({
      where: {
        destinationId: id,
      },
      include: { media: true },
    });
    const seasonResponse = await convertMediaIdsResponseIntoMediaUrl(response);

    return new NextResponse(
      JSON.stringify({
        data: seasonResponse,
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
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const response = body.seasonToVisit.map(async (element: any) => {
      const { destinationId, media, id: elementId, imageId, ...rest } = element;
      const oldSeason = await prisma.seasonToVisit.findFirst({
        where: {
          id: elementId,
        },
        select: {
          name: true,
          title: true,
          description: true,
          eventOccasions: true,
          period: true,
          temperature: true,
        },
      });
      const updatedSeason = await prisma.seasonToVisit.update({
        where: {
          id: elementId,
        },
        data: {
          ...rest,
          media: {
            update: media,
          },
          destination: { connect: { id: destinationId } },
        },
      });
      const { name, title, description, eventOccasions, period, temperature } =
        rest;
      const translateKeysObj = {
        name,
        title,
        description,
        eventOccasions,
        period,
        temperature,
      };
      const diffValues = getDifferentValues(oldSeason, translateKeysObj);
      if (Object.keys(diffValues).length) {
        const seasonTranslation =
          await prisma.seasonToVisitTranslation.findMany({
            where: { seasonToVisitId: updatedSeason.id },
            include: {
              language: true,
            },
          });
        seasonTranslation.map(async ({ language: { locale }, id }: any) => {
          if (locale !== "en") {
            await translateObj(diffValues, "en", locale, translateService);
            await prisma.seasonToVisitTranslation.update({
              where: {
                id: id,
              },
              data: {
                ...diffValues,
              },
            });
          } else {
            await prisma.seasonToVisitTranslation.update({
              where: {
                id: id,
              },
              data: {
                name,
                title,
                description,
                eventOccasions,
                period,
                temperature,
              },
            });
          }
        });
      }

      const newCreatedSeasons = await prisma.seasonToVisit.findMany({
        where: {
          destinationId: id,
        },
      });
      const seasonResponse = await convertMediaIdsResponseIntoMediaUrl(
        newCreatedSeasons
      );
      return seasonResponse;
    });
    return new NextResponse(
      JSON.stringify({
        data: response,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: number } }
) {
  try {
    const id = Number(params.id);

    const response = await prisma.seasonToVisit.delete({
      where: {
        id: id,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: response,
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
