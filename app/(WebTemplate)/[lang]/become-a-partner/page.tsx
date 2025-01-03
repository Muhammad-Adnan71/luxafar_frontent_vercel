import React from "react";
import { apiGetAllBecomePartnerQuestionTemplate } from "@utils/services/becomePartner";

import { Metadata } from "next";

import {
  capitalizeFirstLetter,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import BecomePartnerPage from "./components/becomePartnerPage";
import { Locale } from "i18n.config";
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
      name: "become a partner",
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
          ? `/${WEB_ROUTES.BECOME_A_PARTNER}`
          : `/${lang}/${WEB_ROUTES.BECOME_A_PARTNER}`,
      // languages: {
      //   "en-US": `/become-a-partner`,
      //   fr: `/fr/become-a-partner`,
      //   it: `/it/become-a-partner`,
      //   es: `/es/become-a-partner`,
      //   ru: `/ru/become-a-partner`,
      //   zh: `/zh/become-a-partner`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: `/become-a-partner`,
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

const BecomePartner = async ({
  params,
}: {
  params: Promise<{ lang: string }>;
}) => {
  const { lang } = await params;

  const bespokeQuestions = await prisma.bespokeQuestion.findMany({
    where: {
      formType: "becomePartner",
    },
    include: {
      BespokeQuestionTranslation: {
        where: {
          language: {
            locale: lang,
          },
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
    data: bespokeQuestions.map((ele: any) => ({
      ...ele,
      ...ele.BespokeQuestionTranslation[0],
      bespokeQuestionOptions: ele.bespokeQuestionOptions.map((item: any) => ({
        ...item,
        ...item.BespokeQuestionOptionsTranslation[0],
      })),
    })),
  };

  // const { data } = await apiGetAllBecomePartnerQuestionTemplate({ locale });
  return <BecomePartnerPage questions={data?.data} locale={lang} />;
};

export default BecomePartner;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang: any) => ({
    lang: lang.locale,
  }));
}
