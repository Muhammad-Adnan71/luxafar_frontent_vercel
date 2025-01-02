import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";
import { convertMediaIdsResponseIntoMediaUrl } from "@utils/functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { i18n } from "i18n.config";

export async function GET(
  request: NextRequest,
  { params: { name } }: { params: { name: string } }
) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || i18n.defaultLocale;
  try {
    if (!name) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Page Name is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const path = request.nextUrl.searchParams.get("path") || "/";
    revalidatePath(path);

    if (name.toLowerCase() === "home") {
      const [partners, banners, faqs, testimonials, inspirations, pages] =
        await prisma.$transaction([
          prisma.partners.findMany({
            where: {
              isDeleted: false,
              isActive: true,
            },
            orderBy: {
              sortId: "asc",
            },
            include: {
              media: true,
            },
          }),
          prisma.banner.findMany({
            where: {
              isActive: true,
              isDeleted: false,
            },
            include: {
              media: true,
              bannerTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
            orderBy: {
              id: "asc",
            },
          }),
          prisma.faqs.findMany({
            where: {
              isActive: true,
              isDeleted: false,
            },
            include: {
              faqsTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
            orderBy: {
              id: "desc",
            },
          }),
          prisma.testimonial.findMany({
            where: {
              isActive: true,
              isDeleted: false,
              destinationId: null,
            },
            orderBy: { sortId: "asc" },
            include: {
              TestimonialTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
              clientImageMedia: true,
              destinationImageMedia: true,
            },
          }),
          prisma.inspirations.findMany({
            where: {
              isActive: true,
              isDeleted: false,
              isHomePageSort: true,
            },
            orderBy: {
              homePageSortId: "asc",
            },

            select: {
              id: true,
              title: true,
              description: true,
              media: {
                select: {
                  desktopMediaUrl: true,
                  mobileMediaUrl: true,
                },
              },
              seoMeta: {
                select: {
                  slug: true,
                  title: true,
                  description: true,
                  keywords: true,
                },
              },
              destination: {
                select: {
                  name: true,
                },
              },
              InspirationsTranslation: {
                where: {
                  language: {
                    locale,
                  },
                },
              },
            },
          }),
          prisma.pages.findFirst({
            where: {
              name,
            },
            select: {
              description: true,
              title: true,
              seoMeta: {
                select: {
                  slug: true,
                  title: true,
                  description: true,
                  keywords: true,
                },
              },
              content: {
                include: {
                  media: true,
                  ContentTranslation: {
                    where: {
                      language: {
                        locale,
                      },
                    },
                  },
                },

                orderBy: {
                  sortId: "asc",
                },
              },
            },
          }),
        ]);

      const [
        partnerResponse,
        bannerResponse,
        inspirationsResponse,
        contentResponse,
        testimonialsResponse,
      ] = await Promise.all([
        convertMediaIdsResponseIntoMediaUrl(partners),
        convertMediaIdsResponseIntoMediaUrl(banners),
        convertMediaIdsResponseIntoMediaUrl(inspirations),
        convertMediaIdsResponseIntoMediaUrl(pages?.content),
        convertMediaIdsResponseIntoMediaUrl(testimonials, [
          "clientImageMedia",
          "destinationImageMedia",
        ]),
      ]);
      return new NextResponse(
        JSON.stringify({
          data: {
            page: {
              ...pages,
              content: contentResponse.map((ele: any) => ({
                ...ele,
                ...ele.ContentTranslation[0],
              })),
            },
            banners: bannerResponse.map((ele: any) => ({
              ...ele,
              ...ele.bannerTranslation[0],
            })),
            partners: partnerResponse,
            testimonials: testimonialsResponse.map((ele: any) => ({
              ...ele,
              ...ele.TestimonialTranslation[0],
            })),
            faqs: faqs.map((ele: any) => ({
              ...ele,
              ...ele.faqsTranslation[0],
            })),
            inspirations: inspirationsResponse.map((ele: any) => ({
              ...ele,
              ...ele.InspirationsTranslation[0],
            })),
          },
          status: "success",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      const page = await prisma.pages.findFirst({
        where: {
          name,
        },
        select: {
          description: true,
          title: true,
          seoMeta: {
            select: {
              slug: true,
              title: true,
              description: true,
              keywords: true,
            },
          },
          content: {
            orderBy: {
              sortId: "asc",
            },
            include: {
              ContentTranslation: {
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
      const contentResponse = await convertMediaIdsResponseIntoMediaUrl(
        page?.content
      );
      return new NextResponse(
        JSON.stringify({
          data: {
            page: {
              ...page,
              // content: {
              //   ...contentResponse,
              //   ...contentResponse.ContentTranslation,
              // },
              content: contentResponse.map((ele: any) => ({
                ...ele,
                ...ele.ContentTranslation[0],
              })),
            },
          },
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
