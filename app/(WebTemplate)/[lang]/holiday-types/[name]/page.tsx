import React from "react";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  removeParaTagsFromString,
} from "@utils/functions";
import { Metadata } from "next";
import HolidayDetailPage from "../components/holidayDetailPage";
import { WEB_ROUTES } from "@utils/constant";
import { prisma } from "@utils/prisma";
export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, name } = resolvedParams;
  const holidayType = await prisma.holidayType.findFirstOrThrow({
    where: {
      isActive: true,

      seoMeta: {
        slug: name,
      },
    },
    include: {
      seoMeta: true,
    },
  });

  const data = {
    holidayType,
  };

  const description = data?.holidayType?.seoMeta?.description;
  const title = data?.holidayType?.seoMeta?.title;
  const keywords = data?.holidayType?.seoMeta?.keywords;
  const slug = data?.holidayType?.seoMeta?.slug;

  const metaDescription = removeParaTagsFromString(description as string);

  return {
    title: `${capitalizeFirstLetter(title)} - Luxafar`,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical:
        lang === "en"
          ? `/${WEB_ROUTES.HOLIDAY_TYPES}/${slug}`
          : `/${lang}/${WEB_ROUTES.HOLIDAY_TYPES}/${slug}`,
      // languages: {
      //   "en-US": `/holiday-types/${slug}`,
      //   fr: `/fr/holiday-types/${slug}`,
      //   it: `/it/holiday-types/${slug}`,
      //   es: `/es/holiday-types/${slug}`,
      //   ru: `/ru/holiday-types/${slug}`,
      //   zh: `/zh/holiday-types/${slug}`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: `/holiday-types/${slug}`,
      description: metaDescription,
    },
  };
}
async function HolidayTypeDetail({
  params,
}: {
  params: Promise<{ lang: string; name: string }>;
}) {
  const resolvedParams = await params;
  const { lang, name } = resolvedParams;
  const [holidayType, tours, inspirations] = await prisma.$transaction(
    async (tx) => {
      const holidayType = await tx.holidayType.findFirstOrThrow({
        where: {
          isActive: true,
          seoMeta: {
            slug: name,
          },
        },
        include: {
          HolidayTypeTranslation: {
            where: {
              language: {
                locale: lang,
              },
            },
          },
          media: true,
          seoMeta: true,
          highlights: {
            include: {
              HighlightsTranslation: {
                where: {
                  language: {
                    locale: lang,
                  },
                },
              },
              media: true,
            },
          },
        },
      });
      const tours = await tx.tours.findMany({
        where: {
          isActive: true,
          isDeleted: false,

          AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
          tourHoliDayType: {
            some: {
              holidayType: {
                id: holidayType.id,
              },
            },
          },
        },
        orderBy: {
          id: "desc",
        },
        take: 2,
        include: {
          seoMeta: true,
          bannerImageMedia: true,
          ToursTranslation: {
            where: {
              language: {
                locale: lang,
              },
            },
          },
          tourDestinations: {
            include: {
              destination: true,
            },
          },
        },
      });
      const inspirations = await tx.inspirations.findMany({
        where: {
          isActive: true,
          isDeleted: false,

          holidayType: {
            some: {
              id: holidayType.id,
            },
          },
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
                locale: lang,
              },
            },
          },
        },
      });

      return [holidayType, tours, inspirations];
    }
  );

  const mediaUrls = await convertMediaIdsResponseIntoMediaUrl(holidayType);
  const [highlights, toursResponse, inspirationsResponse] = await Promise.all([
    convertMediaIdsResponseIntoMediaUrl(holidayType?.highlights),
    convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
    convertMediaIdsResponseIntoMediaUrl(inspirations),
  ]);

  const response = {
    data: {
      holidayType: {
        ...holidayType,
        ...holidayType.HolidayTypeTranslation?.[0],
        highlights: highlights.map((ele: any) => ({
          ...ele,
          ...ele.HighlightsTranslation?.[0],
        })),
        media: {
          ...holidayType?.media,
          ...mediaUrls.media,
        },
      },
      tours: toursResponse.map((item: any) => {
        const { tourDestinations, ToursTranslation, ...rest } = item;
        return {
          ...rest,
          ...ToursTranslation?.[0],
          destination: tourDestinations[0].destination,
        };
      }),
      inspirations: inspirationsResponse.map((ele: any) => ({
        ...ele,
        ...ele.InspirationsTranslation?.[0],
      })),
    },
  };

  // const response = await apiTemplateByNameHolidayType(name, { locale });
  return <HolidayDetailPage response={response} locale={lang} />;
}

export default HolidayTypeDetail;

export async function generateStaticParams() {
  // Get all supported languages
  const languages = await prisma.languages.findMany({});

  // Get all possible routes that need to be pre-rendered

  const HolidayTypes = await prisma.holidayType.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      isActive: true,
    },
  });
  console.log(HolidayTypes, "ashbifakjshdjasojdojasodj");

  // Create an array of all possible route combinations
  const params = [];

  for (const language of languages) {
    // For holidayType
    for (const HolidayType of HolidayTypes) {
      if (HolidayType.seoMeta?.slug) {
        params.push({
          lang: language.locale,
          name: HolidayType.seoMeta.slug,
        });
      }
    }
  }
  console.log(params);

  return params;
}
