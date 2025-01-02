import React from "react";
import { apiGetAllBespokeQuestionTemplate } from "@utils/services/bespoke";

import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";

import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import BespokeHolidayPage from "./components/bespokeHolidayPage";
import { Locale } from "i18n.config";
import { WEB_ROUTES } from "@utils/constant";
import { notFound } from "next/navigation";
import { prisma } from "@utils/prisma";
export const dynamic = "force-static";
export const revalidate = false;
export async function generateMetadata({
  params: { lang, params },
}: {
  params: { lang: Locale; params: any };
}): Promise<Metadata> {
  const page = await prisma.pages.findFirst({
    where: {
      name: "bespoke holiday",
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
    alternates: {
      canonical:
        lang === "en"
          ? `/${WEB_ROUTES.BESPOKE_HOLIDAY}`
          : `/${lang}/${WEB_ROUTES.BESPOKE_HOLIDAY}`,
      // languages: {
      //   "en-US": `/bespoke-holiday`,
      //   fr: `/fr/bespoke-holiday`,
      //   it: `/it/bespoke-holiday`,
      //   es: `/es/bespoke-holiday`,
      //   ru: `/ru/bespoke-holiday`,
      //   zh: `/zh/bespoke-holiday`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/bespoke-holiday",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

const BespokePlane = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const bespokeQuestions = await prisma.bespokeQuestion.findMany({
    where: {
      formType: "bespoke",
    },
    orderBy: { sortId: "asc" },
    include: {
      BespokeQuestionTranslation: {
        where: {
          language: {
            locale: lang,
          },
        },
        select: {
          question: true,
          textPlaceholder: true,
        },
      },
      bespokeQuestionOptions: {
        include: {
          BespokeQuestionOptionsTranslation: {
            where: {
              language: {
                locale: lang,
              },
            },
          },
        },
      },
    },
  });

  const data = {
    data: bespokeQuestions.map((ele) => ({
      ...ele,
      ...ele.BespokeQuestionTranslation[0],
      bespokeQuestionOptions: ele.bespokeQuestionOptions.map((item) => ({
        ...item,
        ...item.BespokeQuestionOptionsTranslation[0],
      })),
    })),
  };
  // const { data } = await apiGetAllBespokeQuestionTemplate({ locale });

  return <BespokeHolidayPage questions={data?.data} locale={lang} />;
};
export default BespokePlane;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
