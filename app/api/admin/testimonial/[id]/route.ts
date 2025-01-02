import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import {
  convertMediaIdsResponseIntoMediaUrl,
  isNumeric,
} from "@utils/functions";
import { TestimonialSchema } from "@utils/validations/testimonial.schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  getDifferentValues,
  translateObj,
  translateService,
} from "@utils/translate";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isNumeric(params.id)) return getErrorResponse(400, "Id is required");

    const id = Number(params.id);
    const body = await req.json();

    const {
      clientImageMedia,
      destinationImageMedia,
      clientImageId,
      destinationImageId,
      destinationId,
      ...rest
    } = TestimonialSchema.parse(body);
    const oldTestimonial = await prisma.testimonial.findFirst({
      where: {
        id,
      },
      select: {
        description: true,
        clientName: true,
        clientLocation: true,
      },
    });
    const updatedTestimonial = await prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        ...rest,
        clientImageMedia: {
          update: {
            desktopMediaUrl: clientImageMedia?.desktopMediaUrl,
          },
        },
        destinationImageMedia: {
          update: {
            desktopMediaUrl: destinationImageMedia?.desktopMediaUrl,
          },
        },
        ...(destinationId && {
          destination: {
            connect: {
              id: Number(destinationId),
            },
          },
        }),
      },
      include: {
        clientImageMedia: true,
        destinationImageMedia: true,
        ...(destinationId && { destination: true }),
      },
    });

    const { description, clientName, clientLocation } = rest;
    const translateKeysObj = { description, clientName, clientLocation };
    const diffValues = getDifferentValues(oldTestimonial, translateKeysObj);
    if (Object.keys(diffValues).length) {
      const testimonialTranslation =
        await prisma.testimonialTranslation.findMany({
          where: { testimonialId: id },
          include: {
            language: true,
          },
        });
      testimonialTranslation.forEach(
        async ({ language: { locale }, id }: any) => {
          if (locale !== "en") {
            await translateObj(diffValues, "en", locale, translateService);
            await prisma.testimonialTranslation.update({
              where: {
                id: id,
              },
              data: {
                ...diffValues,
              },
            });
          } else {
            await prisma.testimonialTranslation.update({
              where: {
                id: id,
              },
              data: {
                description,
                clientName,
                clientLocation,
              },
            });
          }
        }
      );
    }
    const testimonialMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      updatedTestimonial,
      ["clientImageMedia", "destinationImageMedia"]
    );

    return new NextResponse(
      JSON.stringify({
        data: testimonialMediaResponse,
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

    const deletedTestimonial = await prisma.testimonial.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        data: deletedTestimonial,
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
