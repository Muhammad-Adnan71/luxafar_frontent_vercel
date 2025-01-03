import { apiGetTemplateConfiguration } from "@utils/services/configuration";
import "@styles/glassEffect.css";
import type { Metadata, Viewport } from "next";
import { WEB_ROUTES } from "@utils/constant";
import { Locale } from "i18n.config";
import { getDictionary } from "@utils/dictionary";
import { ReactNode, Suspense } from "react";
import {
  convertMediaIdsResponseIntoMediaUrl,
  getLocaleFromServer,
} from "@utils/functions";
import { Montserrat, Playfair_Display } from "next/font/google";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/effect-fade";
import "locomotive-scroll/dist/locomotive-scroll.css";
import WebLayout from "components/template/container/layout";
import RSLProvider from "components/template/container/rslProvider";
import NextTopLoader from "nextjs-toploader";
import Header from "@template-components/header";
import Loader from "@template-components/loader";
import Footer from "@template-components/footer";
import { FacebookPixelEvents } from "components/template/container/pixel-event";
import { getErrorResponse } from "@utils/api-helpers";
import { prisma } from "@utils/prisma";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.METADATA_BASE_URL as string),
  alternates: {
    canonical: "/",
    // languages: {
    //   "en-US": "/",
    //   fr: "/fr",
    //   it: "/it",
    //   es: "/es",
    //   ru: "/ru",
    //   zh: "/zh",
    // },
  },
  // viewport: { width: "device-width", initialScale: 1, maximumScale: 1 },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Travel",
  openGraph: {
    url: "/",
    siteName: "Luxafar",
    images: [
      {
        url: `${WEB_ROUTES.HOME}/template/luxafarlogo.png`,
        width: 400,
        height: 300,
      },
      {
        url: `${WEB_ROUTES.HOME}/template/luxafarlogo.png`,
        width: 1000,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
// export const runtime = "edge";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});
const playfair = Playfair_Display({
  subsets: ["latin-ext"],
  display: "swap",
  variable: "--font-playfair",
});

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  let data = null;
  // const {
  //   data: { destinations, configuration, inspirations },
  // } = await apiGetTemplateConfiguration({ locale });
  try {
    const destinations = await prisma.destinations.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      include: {
        seoMeta: true,
        DestinationsTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
        placeToVisit: {
          where: {
            isActive: true,
            isDeleted: false,
          },
        },
      },
    });
    const inspirations = await prisma.inspirations.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      include: {
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
      orderBy: {
        id: "desc",
      },
      take: 3,
    });
    const configuration = await prisma.configuration.findFirst({
      include: {
        media: true,
        ConfigurationTranslation: {
          where: {
            language: {
              locale: lang,
            },
          },
        },
      },
    });

    const configurationResponse = await convertMediaIdsResponseIntoMediaUrl(
      configuration
    );
    data = {
      destinations: destinations.map((ele: any) => ({
        ...ele,
        ...ele.DestinationsTranslation?.[0],
      })),
      inspirations: inspirations.map((ele: any) => ({
        ...ele,
        ...ele.InspirationsTranslation?.[0],
      })),
      configuration: {
        ...configurationResponse,
        ...configuration?.ConfigurationTranslation?.[0],
      },
    };
  } catch (error: any) {
    return getErrorResponse(500, error.message);
  }

  const {
    footer,
    navigation,
    social,
    tooltip,
    placeholder,
    button,
    errors,
    contactDrawer,
    dropdown,
    subscribeModal,
  } = await getDictionary(lang);

  return (
    <html
      translate="no"
      lang={"en"}
      className={[playfair.variable, montserrat.variable].join(" ")}
    >
      <body className="bg-primary-color bg-repeat bg-fixed sm:bg-body-pattern max-sm:bg-pattern-mobile max-sm:bg-[length:60px] max-w-full overflow-x-hidden">
        <WebLayout>
          <RSLProvider
            lang={lang}
            dictionary={{
              errors,
              placeholder,
              button,
              contactDrawer,
              dropdown,
              subscribeModal,
              lang,
            }}
          >
            <NextTopLoader
              color="#A69769"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            <Header
              logo={data?.configuration?.media?.desktopMediaUrl as string}
              configuration={data?.configuration}
              destinations={data?.destinations}
              lang={lang}
            />

            <Loader />
            {children}
            <Footer
              dictionary={{
                footer,
                navigation,
                social,
                tooltip,
                placeholder,
                button,
                errors,
                lang,
              }}
              configuration={data?.configuration}
              inspirations={data?.inspirations}
            />
          </RSLProvider>
          <Suspense fallback={null}>
            <FacebookPixelEvents />
          </Suspense>
        </WebLayout>
      </body>
    </html>
  );
}
