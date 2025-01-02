import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import {
  TestimonialInput,
  TestimonialSchema,
} from "@utils/validations/testimonial.schema";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { translateObj, translateService } from "@utils/translate";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TestimonialInput;
    const {
      clientImageMedia,
      destinationImageMedia,
      clientImageId,
      destinationImageId,
      destinationId,
      ...rest
    } = TestimonialSchema.parse(body);
    const languages = await prisma.languages.findMany({});
    let destination: any;
    if (destinationId) {
      await prisma.destinations.findFirst({
        where: {
          id: Number(destinationId),
        },
        include: {
          Testimonial: {
            orderBy: {
              destinationSortId: "desc",
            },
          },
        },
      });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        ...rest,
        clientImageMedia: {
          create: { desktopMediaUrl: clientImageMedia?.desktopMediaUrl },
        },
        destinationImageMedia: {
          create: destinationImageMedia,
        },
        ...(destinationId && {
          destination: {
            connect: {
              id: Number(destinationId),
            },
          },
          ...(destinationId && {
            destinationSortId: destination?.Testimonial.length
              ? Number(destination?.Testimonial?.[0]?.destinationSortId) + 1
              : 1,
          }),
        }),
      },
      include: {
        destinationImageMedia: true,
        clientImageMedia: true,
        destination: true,
      },
    });
    languages.forEach(async (lang) => {
      const { description, clientName, clientLocation } = rest;
      if (lang.locale !== "en") {
        const translateKeysObj = { description, clientName, clientLocation };
        await translateObj(
          translateKeysObj,
          "en",
          lang.locale,
          translateService
        );
        await prisma.testimonialTranslation.create({
          data: {
            ...translateKeysObj,
            testimonial: {
              connect: { id: newTestimonial.id },
            },
            language: {
              connect: {
                id: lang.id,
              },
            },
          },
        });
      } else {
        await prisma.testimonialTranslation.create({
          data: {
            description,
            clientName,
            clientLocation,
            testimonial: {
              connect: { id: newTestimonial.id },
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
   
    const testimonialMediaResponse = await convertMediaIdsResponseIntoMediaUrl(
      newTestimonial,
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const pageSize = url.searchParams.get("pageSize");
  const pageNum = url.searchParams.get("pageNum");
  const groupBy = url.searchParams.get("groupBy");
  const searchParams = url.searchParams.get("searchParams");
  // test
  try {
    if (groupBy === "destination") {
      const destinationCount = await prisma.destinations.count({
        where: {
          Testimonial: {
            some: {
              isDeleted: false,
            },
          },
          isDeleted: false,
          ...(searchParams && {
            OR: [
              {
                name: {
                  contains: searchParams,
                },
              },
              {
                Testimonial: {
                  some: {
                    OR: [
                      {
                        clientLocation: {
                          contains: searchParams,
                        },
                      },
                      {
                        clientName: {
                          contains: searchParams,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }),
        },
      });
      const destinations = await prisma.destinations.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),

        include: {
          Testimonial: {
            orderBy: {
              destinationSortId: "asc",
            },
            where: {
              isDeleted: false,
            },
            include: {
              destination: true,
              clientImageMedia: true,
              destinationImageMedia: true,
            },
          },
        },
        where: {
          isDeleted: false,
          Testimonial: {
            some: {
              isDeleted: false,
            },
          },
          ...(searchParams && {
            OR: [
              {
                name: {
                  contains: searchParams,
                },
              },
              {
                Testimonial: {
                  some: {
                    OR: [
                      {
                        clientLocation: {
                          contains: searchParams,
                        },
                      },
                      {
                        clientName: {
                          contains: searchParams,
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }),
        },
        orderBy: {
          id: "asc",
        },
      });
      const destinationResponse = await Promise.all([
        ...destinations.map(async (element) => {
          const testimonialResponse = await convertMediaIdsResponseIntoMediaUrl(
            element.Testimonial,
            ["clientImageMedia", "destinationImageMedia"]
          );
          return { ...element, Testimonial: testimonialResponse };
        }),
      ]);
      return new NextResponse(
        JSON.stringify({
          count: destinationCount,
          data: destinationResponse,
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const testimonials = await prisma.testimonial.findMany({
        where: {
          isDeleted: false,
          destinationId: null,
        },
        orderBy: {
          sortId: "desc",
        },
        include: {
          clientImageMedia: true,
          destinationImageMedia: true,
        },
      });

      const testimonialMediaResponse =
        await convertMediaIdsResponseIntoMediaUrl(testimonials, [
          "clientImageMedia",
          "destinationImageMedia",
        ]);
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
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sourceId, sortPosition, destinationIdSortId, destinationId } =
      await req.json();

    if (!sourceId || !sortPosition || destinationIdSortId === undefined) {
      return getErrorResponse(400, "failed validations");
    }
    if (destinationId) {
      const testimonial = await prisma.$transaction(async (tx) => {
        const draggedPlace = await prisma.testimonial.findFirst({
          where: {
            id: sourceId,
            destination: {
              id: destinationId,
            },
          },
        });

        await tx.testimonial.updateMany({
          where: {
            id: draggedPlace?.id,
            destination: {
              id: destinationId,
            },
          },
          data: {
            destinationSortId: destinationIdSortId,
          },
        });

        await tx.testimonial.updateMany({
          where: {
            AND: {
              NOT: {
                id: sourceId,
              },
              destination: {
                id: destinationId,
              },
              destinationSortId: {
                gte: Math.min(
                  draggedPlace?.destinationSortId as number,
                  destinationIdSortId
                ),
                lte: Math.max(
                  draggedPlace?.destinationSortId as number,
                  destinationIdSortId
                ),
              },
            },
          },
          data: {
            ...(sortPosition > 0
              ? { destinationSortId: { increment: 1 } }
              : { destinationSortId: { decrement: 1 } }),
          },
        });
      });
      return new NextResponse(
        JSON.stringify({
          status: "success",
          data: testimonial,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const testimonials = await prisma.$transaction(async (tx) => {
        const draggedTestimonial = await prisma.testimonial.findUnique({
          where: {
            id: sourceId,
          },
        });
        await tx.testimonial.update({
          where: {
            id: sourceId,
          },
          data: {
            sortId: destinationIdSortId,
          },
        });

        await tx.testimonial.updateMany({
          where: {
            AND: {
              NOT: {
                id: sourceId,
              },
              sortId: {
                gte: Math.min(
                  draggedTestimonial?.sortId as number,
                  destinationIdSortId
                ),
                lte: Math.max(
                  draggedTestimonial?.sortId as number,
                  destinationIdSortId
                ),
              },
            },
          },
          data: {
            ...(sortPosition > 0
              ? { sortId: { decrement: 1 } }
              : { sortId: { increment: 1 } }),
          },
        });

        return await tx.testimonial.findMany({
          where: {
            isDeleted: false,
          },
          include: {
            clientImageMedia: true,
            destinationImageMedia: true,
          },
          orderBy: {
            sortId: "desc",
          },
        });
      });
      const testimonialMediaResponse =
        await convertMediaIdsResponseIntoMediaUrl(testimonials, [
          "clientImageMedia",
          "destinationImageMedia",
        ]);

      return new NextResponse(
        JSON.stringify({
          status: "success",
          data: testimonialMediaResponse,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }
}
