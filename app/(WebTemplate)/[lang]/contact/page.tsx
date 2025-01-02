import React from "react";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetPageByIdTemplateService } from "@utils/services/pages";

// export const runtime = "edge";
import { Metadata } from "next";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";

import ContactPage from "./components/contactPage";
import { Locale, i18n } from "i18n.config";
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
      name: "contact",
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
          ? `/${WEB_ROUTES.CONTACT}`
          : `/${lang}/${WEB_ROUTES.CONTACT}`,
      // languages: {
      //   "en-US": `/contact`,
      //   fr: `/fr/contact`,
      //   it: `/it/contact`,
      //   es: `/es/contact`,
      //   ru: `/ru/contact`,
      //   zh: `/zh/contact`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/contact",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

const Contact = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;
  const page = await prisma.pages.findFirst({
    where: {
      name: "contact",
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
  // } = await apiGetPageByIdTemplateService({ name: "contact", locale });

  return <ContactPage page={data?.page} locale={lang} />;
};

export default Contact;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}