import InspirationDestinationComponent from "../components/inspirationDestinationComponent";
import { Metadata } from "next";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { apiGetTemplateConfiguration } from "@utils/services/configuration";
import { apiGetTemplateInspirationByDestinationName } from "@utils/services/inspirations";
import { getDictionary } from "@utils/dictionary";
import { Locale, i18n } from "i18n.config";
import { WEB_ROUTES } from "@utils/constant";
import { notFound } from "next/navigation";
import { prisma } from "@utils/prisma";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: string;
    destinationName: string;
  }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, destinationName } = resolvedParams;
  // const {
  //   data: { configuration },
  // } = await apiGetTemplateConfiguration();
  console.log(params);
  const configuration = await prisma.configuration.findFirst(
    {
      select: {
        siteDescription: true,
      },
    },
    {
      timeout: 120000,
    }
  );
  const metaDescription = removeParaTagsFromString(
    configuration?.siteDescription as string
  );

  return {
    title: `${capitalizeFirstLetter("Inspiration")} - ${capitalizeFirstLetter(
      destinationName.replaceAll("-", " ")
    )} - Luxafar`,
    description: metaDescription,
    alternates: {
      canonical:
        lang === "en"
          ? `/${WEB_ROUTES.INSPIRATIONS}/${destinationName}`
          : `/${lang}/${WEB_ROUTES.INSPIRATIONS}/${destinationName}`,
      // languages: {
      //   "en-US": `/inspirations/${params.destinationName}`,
      //   fr: `/fr/inspirations/${params.destinationName}`,
      //   it: `/it/inspirations/${params.destinationName}`,
      //   es: `/es/inspirations/${params.destinationName}`,
      //   ru: `/ru/inspirations/${params.destinationName}`,
      //   zh: `/zh/inspirations/${params.destinationName}`,
      // },
    },
    openGraph: {
      title: `${capitalizeFirstLetter("Inspiration")} - ${capitalizeFirstLetter(
        destinationName.replaceAll("-", " ")
      )} - Luxafar`,
      url: `/inspirations/${destinationName}`,
      images: "/template/logo.png",
      description: metaDescription,
    },
  };
}
async function InspirationsDestination({
  params,
}: {
  params: Promise<{
    lang: string;
    pageNum?: string;
    pageSize?: string;
    destinationName: string;
  }>;
}) {
  const resolvedParams = await params;
  const { lang, destinationName } = resolvedParams;
  const name = destinationName.replaceAll("-", " "); //In Prisma searching Api from destination name, not by slug
  const pageSize = "9";
  const pageNum = "1";
  const [featuredInspiration, inspirationCount, inspirations] =
    await prisma.$transaction(async (tx) => {
      let featuredInspiration = await tx.inspirations.findFirst({
        where: {
          isDeleted: false,
          isFeatured: true,

          ...(destinationName && {
            destination: { some: { name: destinationName } },
          }),
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
      });

      if (!featuredInspiration) {
        featuredInspiration = await tx.inspirations.findFirst({
          where: {
            isDeleted: false,
            ...(name && {
              destination: { some: { name: name } },
            }),
            sortId: 1,
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
        });
      }
      console.log(destinationName, "asgdjagsasdasjdgjasgd");
      const inspirationCount = await tx.inspirations.count({
        where: {
          isDeleted: false,
          isFeatured: false,
          isActive: true,

          ...(name && {
            destination: { some: { name: name } },
          }),
        },
      });
      const inspirations = await tx.inspirations.findMany(
        {
          ...(pageNum && {
            skip: (Number(pageNum) - 1) * Number(pageSize),
          }),
          ...(pageSize && { take: Number(pageSize) }),
          where: {
            isDeleted: false,
            isFeatured: false,

            id: {
              not: featuredInspiration?.id,
            },
            isActive: true,
            ...(name && {
              destination: { some: { name: name } },
            }),
          },

          orderBy: {
            id: "asc",
          },

          include: {
            media: true,
            seoMeta: true,
            destination: true,
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
        },
        {
          timeout: 120000,
        }
      );
      return [featuredInspiration, inspirationCount, inspirations];
    });

  const [inspirationsResponse, featuredInspirationResponse] = await Promise.all(
    [
      convertMediaIdsResponseIntoMediaUrl(inspirations),
      convertMediaIdsResponseIntoMediaUrl(featuredInspiration),
    ]
  );

  const inspiration = {
    count: inspirationCount,
    data: {
      inspirations: inspirationsResponse.map((ele: any) => ({
        ...ele,
        ...ele.InspirationsTranslation?.[0],
        inspirationDetail: ele.inspirationDetail.map((item: any) => ({
          ...item,
          ...item.InspirationDetailTranslation?.[0],
        })),
      })),
      featuredInspiration: {
        ...featuredInspirationResponse,
        ...featuredInspirationResponse?.InspirationsTranslation?.[0],
      },
    },
  };

  // const locale = getLocaleFromServer(lang);
  // const inspirations = await apiGetTemplateInspirationByDestinationName({
  //   pageSize: "9",
  //   pageNum: "1",
  //   destinationName: destinationName,
  //   locale,
  // });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://luxafar.com/inspirations/${destinationName}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Emirates Tower, Level 33 PO-23548",
      addressLocality: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    name: "Inspirations",
    logo: "https://luxafar.com/template/logo.png",
    telephone: "+442034682356",
    email: "contact@luxafar.com",
    url: `https://luxafar.com/inspirations/${destinationName}`,
    image: "https://luxafar.com/template/logo.png",
    description: "metaDescription",
    sameAs: [
      "https://www.facebook.com/luxafarofficial",
      "https://www.instagram.com/luxafar",
    ],
  };

  const {
    planContactBanner,
    button,
    sectionHeadings,
    breadCrumb,
    inspirationPage,
  } = await getDictionary(lang);

  console.log(inspirationCount, "asdbajkshdkhasd");
  console.log(inspiration);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InspirationDestinationComponent
        dictionary={{
          planContactBanner,
          button,
          sectionHeadings,
          inspirationPage,
          breadCrumb,
        }}
        locale={lang}
        featuredInspiration={inspiration?.data?.featuredInspiration}
        inspirations={inspiration.data.inspirations}
        rowCount={inspiration.count}
        destinationName={destinationName}
      />
    </>
  );
}

export default InspirationsDestination;

export async function generateStaticParams() {
  // Get all supported languages
  const languages = await prisma.languages.findMany({});

  // Get all possible routes that need to be pre-rendered

  const inspirationDestinations = await prisma.destinations.findMany({
    select: { seoMeta: { select: { slug: true } } },
    where: {
      inspirations: {
        some: {},
      },
    },
  });

  // Create an array of all possible route combinations
  const params = [];

  for (const language of languages) {
    // For inspirationDestination
    for (const inspirationDestination of inspirationDestinations) {
      if (inspirationDestination.name) {
        params.push({
          lang: language.locale,
          destinationName: inspirationDestination.name,
        });
      }
    }
  }

  return params;
}
