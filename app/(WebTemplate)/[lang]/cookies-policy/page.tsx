import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
// export const runtime = "edge";
import React from "react";
import { apiGetPageByIdTemplateService } from "@utils/services/pages";

import { Metadata } from "next";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import CookiePage from "./components/cookiePage";
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
      name: "cookie policy",
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
          ? `/${WEB_ROUTES.COOKIE_POLICY}`
          : `/${lang}/${WEB_ROUTES.COOKIE_POLICY}`,
      // languages: {
      //   "en-US": `/cookies-policy`,
      //   fr: `/fr/cookies-policy`,
      //   it: `/it/cookies-policy`,
      //   es: `/es/cookies-policy`,
      //   ru: `/ru/cookies-policy`,
      //   zh: `/zh/cookies-policy`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/cookies-policy",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

const CookiePolicy = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;
  const page = await prisma.pages.findFirst({
    where: {
      name: "cookie policy",
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
  // } = await apiGetPageByIdTemplateService({ name: "cookie policy", locale });

  return <CookiePage page={data?.page} locale={lang} />;
};

export default CookiePolicy;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
