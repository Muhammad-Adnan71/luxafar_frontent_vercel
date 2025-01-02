import React from "react";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetPageByIdTemplateService } from "@utils/services/pages";
import { apiTemplateGetAllHolidayTypes } from "@utils/services/holidayTypes";
import { Metadata } from "next";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";

import HolidayPage from "./components/holidayPage";
import { Locale } from "i18n.config";
import { WEB_ROUTES } from "@utils/constant";
import { notFound } from "next/navigation";
import { prisma } from "@utils/prisma";
// export const runtime = "edge";
export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata({
  params: { lang, params },
}: {
  params: { lang: Locale; params: any };
}): Promise<Metadata> {
  const page = await prisma.pages.findFirst({
    where: {
      name: "holiday type",
    },
    include: {
      seoMeta: true,
    },
  });
  const description = page?.seoMeta?.description;
  const title = page?.seoMeta?.title;
  const keywords = page?.seoMeta?.keywords;

  const metaDescription = removeParaTagsFromString(description as string);

  return {
    title: `${capitalizeFirstLetter(title)} - Luxafar`,
    description: metaDescription,
    keywords: keywords,
    alternates: {
      canonical:
        lang === "en"
          ? `/${WEB_ROUTES.HOLIDAY_TYPES}`
          : `/${lang}/${WEB_ROUTES.HOLIDAY_TYPES}`,
      // languages: {
      //   "en-US": `/holiday-types`,
      //   fr: `/fr/holiday-types`,
      //   it: `/it/holiday-types`,
      //   es: `/es/holiday-types`,
      //   ru: `/ru/holiday-types`,
      //   zh: `/zh/holiday-types`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/holiday-types",
      description: metaDescription,
    },
  };
}
async function HolidayTypes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const page = await prisma.pages.findFirst({
    where: {
      name: "holiday type",
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
                locale: lang,
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

  const response = {
    data: {
      page: {
        ...page,
        content: contentResponse.map((ele: any) => ({
          ...ele,
          ...ele.ContentTranslation[0],
        })),
      },
    },
  };
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
            language: { locale: lang },
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
              locale: lang,
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

  const responseHolidayType = {
    data: {
      holidayTypes: holidayResponse.map((ele: any) => ({
        ...ele,
        name: ele.HolidayTypeTranslation?.[0].name,
        description: ele.HolidayTypeTranslation?.[0].description,
        mainSectionHeading: ele.HolidayTypeTranslation?.[0].mainSectionHeading,
        mainSectionDescription:
          ele.HolidayTypeTranslation?.[0].mainSectionDescription,
      })),
      inspirations: inspirationResponse.map((ele: any) => ({
        ...ele,
        ...ele.InspirationsTranslation?.[0],
      })),
    },
  };

  // const response = await apiGetPageByIdTemplateService({
  //   name: "holiday type",
  //   locale,
  // });
  // const responseHolidayType = await apiTemplateGetAllHolidayTypes({ locale });

  return (
    <HolidayPage
      locale={lang}
      response={response}
      responseHolidayType={responseHolidayType}
    />
  );
}

export default HolidayTypes;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
