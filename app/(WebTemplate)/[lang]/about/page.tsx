/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetPageByIdTemplateService } from "@utils/services/pages";

import { Metadata } from "next";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";

import AboutComponent from "./components/aboutComponent";
import { Locale } from "i18n.config";
import routes from "@utils/routes/sidebar";
import { WEB_ROUTES } from "@utils/constant";
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
      name: "about us",
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
        lang === "en" ? `/${WEB_ROUTES.ABOUT}` : `/${lang}/${WEB_ROUTES.ABOUT}`,
      // languages: {
      //   "en-US": `/about`,
      //   fr: `/fr/about`,
      //   it: `/it/about`,
      //   es: `/es/about`,
      //   ru: `/ru/about`,
      //   zh: `/zh/about`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/about",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const page = await prisma.pages.findFirst({
    where: {
      name: "about us",
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
  // } = await apiGetPageByIdTemplateService({ name: "about us", locale });

  return <AboutComponent page={data?.page} locale={lang} />;
}

export default About;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
