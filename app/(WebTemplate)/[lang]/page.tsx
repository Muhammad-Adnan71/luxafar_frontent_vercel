import { apiGetPageByIdTemplateService } from "@utils/services/pages";
import {
  capitalizeFirstLetter,
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
  removeParaTagsFromString,
} from "@utils/functions";
import { Metadata } from "next";
import HomePage from "components/template/homePage";
import { apiGetPageSeoMeta } from "@utils/services/seoMeta";
import { Locale, i18n } from "i18n.config";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { prisma } from "@utils/prisma";

// export const runtime = "edge";
export const dynamic = "force-static";
export const revalidate = false;

// export async function generateMetadata({
//   params: { lang, params },
// }: {
//   params: { lang: Locale; params: any };
// }): Promise<Metadata> {
//   try {
//     const {
//       data: { page },
//     } = await apiGetPageSeoMeta("home");

//     const metaDescription = removeParaTagsFromString(
//       page?.seoMeta?.description as string
//     );
//     return {
//       title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
//       description: metaDescription,
//       keywords: page?.seoMeta?.keywords,
//       alternates: {
//         canonical: lang === "en" ? `/` : `/${lang}/`,
//         // languages: {
//         //   "en-US": `/`,
//         //   fr: `/fr`,
//         //   it: `/it`,
//         //   es: `/es`,
//         //   ru: `/ru`,
//         //   zh: `/zh`,
//         // },
//       },
//       openGraph: {
//         title: `${capitalizeFirstLetter(page?.seoMeta?.title)} - Luxafar`,
//         url: "/",
//         images: "/template/logo.png",
//         description: metaDescription,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return notFound();
//   }
// }

const Home = async ({ params }: { params: Promise<{ lang: string }> }) => {
  const { lang } = await params;

  const partners = await prisma.partners.findMany({
    where: {
      isDeleted: false,
      isActive: true,
    },
    orderBy: {
      sortId: "asc",
    },
    include: {
      media: true,
    },
  });
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
    include: {
      media: true,
      bannerTranslation: {
        where: {
          language: {
            lang,
          },
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
  const faqs = await prisma.faqs.findMany({
    where: {
      isActive: true,
      isDeleted: false,
    },
    include: {
      faqsTranslation: {
        where: {
          language: {
            lang,
          },
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });
  const testimonials = await prisma.testimonial.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      destinationId: null,
    },
    orderBy: { sortId: "asc" },
    include: {
      TestimonialTranslation: {
        where: {
          language: {
            lang,
          },
        },
      },
      clientImageMedia: true,
      destinationImageMedia: true,
    },
  });
  const inspirations = await prisma.inspirations.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      isHomePageSort: true,
    },
    orderBy: {
      homePageSortId: "asc",
    },

    select: {
      id: true,
      title: true,
      description: true,
      media: {
        select: {
          desktopMediaUrl: true,
          mobileMediaUrl: true,
        },
      },
      seoMeta: {
        select: {
          slug: true,
          title: true,
          description: true,
          keywords: true,
        },
      },
      destination: {
        select: {
          name: true,
        },
      },
      InspirationsTranslation: {
        where: {
          language: {
            lang,
          },
        },
      },
    },
  });
  const pages = await prisma.pages.findFirst({
    where: {
      name: "home",
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
        include: {
          media: true,
          ContentTranslation: {
            where: {
              language: {
                lang,
              },
            },
          },
        },

        orderBy: {
          sortId: "asc",
        },
      },
    },
  });

  const [
    partnerResponse,
    bannerResponse,
    inspirationsResponse,
    contentResponse,
    testimonialsResponse,
  ] = await Promise.all([
    convertMediaIdsResponseIntoMediaUrl(partners),
    convertMediaIdsResponseIntoMediaUrl(banners),
    convertMediaIdsResponseIntoMediaUrl(inspirations),
    convertMediaIdsResponseIntoMediaUrl(pages?.content),
    convertMediaIdsResponseIntoMediaUrl(testimonials, [
      "clientImageMedia",
      "destinationImageMedia",
    ]),
  ]);

  const data = {
    page: {
      ...pages,
      content: contentResponse.map((ele: any) => ({
        ...ele,
        ...ele.ContentTranslation[0],
      })),
    },
    banners: bannerResponse.map((ele: any) => ({
      ...ele,
      ...ele.bannerTranslation[0],
    })),
    partners: partnerResponse,
    testimonials: testimonialsResponse.map((ele: any) => ({
      ...ele,
      ...ele.TestimonialTranslation[0],
    })),
    faqs: faqs.map((ele: any) => ({
      ...ele,
      ...ele.faqsTranslation[0],
    })),
    inspirations: inspirationsResponse.map((ele: any) => ({
      ...ele,
      ...ele.InspirationsTranslation[0],
    })),
  };

  return (
    <HomePage
      locale={lang}
      banners={data.banners}
      partners={data.partners}
      page={data.page}
      faqs={data.faqs}
      testimonials={data.testimonials}
      inspirations={data.inspirations}
    />
  );
};

export default Home;

export async function generateStaticParams() {
  const languages = await prisma.languages.findMany({});
  return languages.map((lang: any) => ({
    lang: lang.locale,
  }));
}
