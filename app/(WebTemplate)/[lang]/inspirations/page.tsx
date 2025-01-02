import { apiGetTemplateInspirations } from "@utils/services/inspirations";
import { Metadata } from "next";
import { apiGetTemplateConfiguration } from "@utils/services/configuration";
import {
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import InspirationPage from "./components/inspirationPage";
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
  // const {
  //   data: { configuration },
  // } = await apiGetTemplateConfiguration();
  const configuration = await prisma.configuration.findFirst({
    select: {
      siteDescription: true,
    },
  });

  const metaDescription = removeParaTagsFromString(
    configuration?.siteDescription as string
  );

  return {
    title: "Inspirations - " + "Luxafar",
    description: metaDescription,
    alternates: {
      canonical:
        lang === "en"
          ? `/${WEB_ROUTES.INSPIRATIONS}`
          : `/${lang}/${WEB_ROUTES.INSPIRATIONS}`,
      // languages: {
      //   "en-US": `/inspirations`,
      //   fr: `/fr/inspirations`,
      //   it: `/it/inspirations`,
      //   es: `/es/inspirations`,
      //   ru: `/ru/inspirations`,
      //   zh: `/zh/inspirations`,
      // },
    },
    openGraph: {
      title: "Inspirations - " + "Luxafar",
      url: "/inspirations",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}
async function Inspirations({
  params,
}: {
  params: Promise<{
    lang: string;
    pageNum?: string;
    pageSize?: string;
    holidayTypeId?: string;
    destinationId?: string;
  }>;
}) {
  const resolvedParams = await params;
  const { lang, holidayTypeId, destinationId } = resolvedParams;
  const pageSize = "9";
  const pageNum = "1";
  const [inspirationCount, inspirations, featuredInspirations] =
    await prisma.$transaction([
      prisma.inspirations.count({
        where: {
          isFeatured: false,
          isActive: true,
          isDeleted: false,
          ...(destinationId && { destinationId: Number(destinationId) }),
          ...(holidayTypeId && { holidayTypeId: Number(holidayTypeId) }),
        },
      }),
      prisma.inspirations.findMany({
        ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
        ...(pageSize && { take: Number(pageSize) }),
        where: {
          isFeatured: false,
          isActive: true,
          isDeleted: false,

          ...(destinationId && {
            destination: { some: { id: Number(destinationId) } },
          }),
          ...(holidayTypeId && {
            holidayType: { some: { id: Number(holidayTypeId) } },
          }),
        },

        orderBy: {
          inspirationSortId: "desc",
        },

        include: {
          media: true,
          destination: true,
          seoMeta: true,
          InspirationsTranslation: {
            where: {
              language: {
                locale: lang,
              },
            },
          },
          inspirationDetail: {
            include: {
              InspirationDetailTranslation: {
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
      }),
      prisma.inspirations.findMany({
        where: {
          isFeatured: true,
          isDeleted: false,
          isActive: true,
        },
        include: {
          media: true,
          destination: true,
          seoMeta: true,
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
  const [inspirationResponse, featuredInspirationsResponse] = await Promise.all(
    [
      convertMediaIdsResponseIntoMediaUrl(inspirations),
      convertMediaIdsResponseIntoMediaUrl(featuredInspirations),
    ]
  );
  const inspiration = {
    count: inspirationCount,
    data: {
      inspirations: inspirationResponse.map((ele: any) => ({
        ...ele,
        ...ele.InspirationsTranslation?.[0],
        inspirationDetail: ele.inspirationDetail.map((item: any) => ({
          ...item,
          ...item.InspirationDetailTranslation?.[0],
        })),
      })),
      ...(featuredInspirations.length && {
        featuredInspirations: featuredInspirationsResponse.map((ele: any) => ({
          ...ele,
          ...ele.InspirationsTranslation?.[0],
        })),
      }),
    },
  };

  // const inspirations = await apiGetTemplateInspirations({
  //   pageSize: "9",
  //   pageNum: "1",
  //   locale,
  // });
  console.log;

  return <InspirationPage inspirations={inspiration} locale={lang} />;
}
export default Inspirations;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
