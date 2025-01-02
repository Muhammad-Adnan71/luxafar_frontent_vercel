import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";

import React from "react";
import { apiGetPageByIdTemplateService } from "@utils/services/pages";

import { Metadata } from "next";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import PrivacyPage from "./components/privacyPage";
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
      name: "privacy policy",
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
          ? `/${WEB_ROUTES.PRIVACY_POLICY}`
          : `/${lang}/${WEB_ROUTES.PRIVACY_POLICY}`,
      // languages: {
      //   "en-US": `/privacy-policy`,
      //   fr: `/fr/privacy-policy`,
      //   it: `/it/privacy-policy`,
      //   es: `/es/privacy-policy`,
      //   ru: `/ru/privacy-policy`,
      //   zh: `/zh/privacy-policy`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/privacy-policy",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

const PrivacyPolicy = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const page = await prisma.pages.findFirst({
    where: {
      name: "privacy policy",
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

  const data = {
    page: {
      ...page,
      content: contentResponse.map((ele: any) => ({
        ...ele,
        ...ele.ContentTranslation[0],
      })),
    },
  };

  // const {
  //   data: { page },
  // } = await apiGetPageByIdTemplateService({
  //   name: "privacy policy",
  //   locale,
  // });

  return <PrivacyPage page={data?.page} locale={lang} />;
};
export default PrivacyPolicy;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
