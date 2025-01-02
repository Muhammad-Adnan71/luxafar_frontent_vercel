import { Metadata } from "next";
import React from "react";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetToursPageService } from "@utils/services/pages";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import ToursPage from "./components/toursPage";
import { Locale } from "i18n.config";
import { WEB_ROUTES } from "@utils/constant";
import { notFound } from "next/navigation";
import { prisma } from "@utils/prisma";
export const dynamic = "force-static";
export const revalidate = false;

// export const runtime = "edge";
export async function generateMetadata({
  params: { lang, params },
}: {
  params: { lang: Locale; params: any };
}): Promise<Metadata> {
  const page = await prisma.pages.findFirst({
    where: {
      name: "tours",
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
        lang === "en" ? `/${WEB_ROUTES.TOURS}` : `/${lang}/${WEB_ROUTES.TOURS}`,
      // languages: {
      //   "en-US": `/tours`,
      //   fr: `/fr/tours`,
      //   it: `/it/tours`,
      //   es: `/es/tours`,
      //   ru: `/ru/tours`,
      //   zh: `/zh/tours`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter(title)} - Luxafar`,
      url: "/tours",
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}

async function Tours({
  params,
}: {
  params: Promise<{
    lang: string;
    holidayTypeId?: string;
    destinationId?: string;
  }>;
}) {
  const resolvedParams = await params;
  const { lang, holidayTypeId, destinationId } = resolvedParams;
  const pageSize = "8";
  const pageNum = "1";

  const [
    toursCount,
    tours,
    featuredTours,
    upcomingTours,
    page,
    inspirations,
    bespokeQuestion,
  ] = await prisma.$transaction([
    prisma.tours.count({
      where: {
        isActive: true,
        isDeleted: false,

        AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
        ...(destinationId && {
          tourDestinations: {
            some: {
              destinationId: Number(destinationId),
            },
          },
        }),

        ...(holidayTypeId && {
          tourHoliDayType: {
            some: {
              holidayTypeId: Number(holidayTypeId),
            },
          },
        }),
      },
    }),
    prisma.tours.findMany({
      ...(pageNum && { skip: (Number(pageNum) - 1) * Number(pageSize) }),
      ...(pageSize && { take: Number(pageSize) }),
      where: {
        isActive: true,

        isDeleted: false,
        AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
        ...(destinationId && {
          tourDestinations: {
            some: {
              destinationId: Number(destinationId),
            },
          },
        }),
        ...(holidayTypeId && {
          tourHoliDayType: {
            some: {
              holidayTypeId: Number(holidayTypeId),
            },
          },
        }),
      },

      orderBy: {
        sortId: "desc",
      },

      include: {
        ToursTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
        bannerImageMedia: true,
        tourDestinations: {
          include: {
            destination: true,
          },
        },
        seoMeta: true,
      },
    }),
    prisma.tours.findMany({
      where: {
        isFeatured: true,
        isDeleted: false,
        isActive: true,
        AND: [{ NOT: { price: null } }, { price: { gt: 0 } }],
      },
      include: {
        bannerImageMedia: true,
        tourDestinations: {
          include: {
            destination: true,
          },
        },
        ToursTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
        seoMeta: true,
      },
    }),
    prisma.tours.findMany({
      where: {
        OR: [{ price: null }, { price: { lte: 0 } }],
        isDeleted: false,
        isActive: true,
      },
      include: {
        bannerImageMedia: true,
        tourDestinations: true,
        seoMeta: true,
        ToursTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
      },
    }),
    prisma.pages.findFirst({
      where: {
        name: "tours",
      },
      include: {
        seoMeta: true,
        content: {
          include: {
            media: true,
            ContentTranslation: {
              where: {
                language: {
                  locale: lang,
                },
              },
            },
          },
        },
      },
    }),
    prisma.inspirations.findMany({
      skip: 0,
      take: 3,
      where: {
        isActive: true,
        isDeleted: false,
      },

      orderBy: {
        inspirationSortId: "desc",
      },

      include: {
        InspirationsTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
        media: true,
        destination: true,
        seoMeta: true,
        inspirationDetail: {
          include: {
            media: true,
            InspirationDetailTranslation: {
              where: {
                language: {
                  locale: lang,
                },
              },
            },
          },
        },
      },
    }),
    prisma.bespokeQuestion.findMany({
      where: {
        formType: "bespoke",
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
    }),
  ]);
  const [
    toursResponse,
    featuredToursResponse,
    upcomingToursResponse,
    contentResponse,
    inspirationsResponse,
  ] = await Promise.all([
    convertMediaIdsResponseIntoMediaUrl(tours, "bannerImageMedia"),
    convertMediaIdsResponseIntoMediaUrl(featuredTours, "bannerImageMedia"),
    convertMediaIdsResponseIntoMediaUrl(upcomingTours, "bannerImageMedia"),
    convertMediaIdsResponseIntoMediaUrl(page?.content),
    convertMediaIdsResponseIntoMediaUrl(inspirations),
  ]);
  // console.log(page?.content[1], "contentResponse");

  const data = {
    page: {
      ...page,
      content: contentResponse.map((ele: any) => ({
        ...ele,
        ...ele.ContentTranslation?.[0],
      })),
    },
    count: toursCount,
    tours: toursResponse.map((item: any) => ({
      ...item,
      ...item.ToursTranslation?.[0],
      destination: item.tourDestinations?.[0]?.destination,
    })),

    featuredTours: featuredToursResponse.map((ele: any) => ({
      ...ele,
      ...ele.ToursTranslation?.[0],
    })),
    upcomingTours: upcomingToursResponse.map((ele: any) => ({
      ...ele,
      ...ele.ToursTranslation?.[0],
    })),
    inspirations: inspirationsResponse.map((ele: any) => ({
      ...ele,
      ...ele.InspirationsTranslation?.[0],
      inspirationDetail: ele.inspirationDetail.map((item: any) => ({
        ...item,
        ...item.InspirationDetailTranslation?.[0],
      })),
    })),
    bespokeQuestion: bespokeQuestion.map((ele) => ({
      ...ele,
      ...ele.BespokeQuestionTranslation[0],
      bespokeQuestionOptions: ele.bespokeQuestionOptions.map((item) => ({
        ...item,
        ...item.BespokeQuestionOptionsTranslation[0],
      })),
    })),
  };
  // const {
  //   data: {
  //     page,
  //     featuredTours,
  //     tours,
  //     upcomingTours,
  //     count,
  //     inspirations,
  //     bespokeQuestion,
  //   },
  // } = await apiGetToursPageService({ pageSize: "8", pageNum: "1", locale });

  return (
    <ToursPage
      locale={lang}
      page={data?.page}
      featuredTours={data?.featuredTours}
      tours={data?.tours}
      upcomingTours={data?.upcomingTours}
      inspirations={data?.inspirations}
      rowCount={data?.count}
      questions={data?.bespokeQuestion}
    />
  );
}
export default Tours;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang) => ({
    lang: lang.locale,
  }));
}
