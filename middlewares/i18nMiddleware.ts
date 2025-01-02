import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

import { i18n } from "i18n.config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { CustomMiddleware } from "./chain";
import { WEB_ROUTES } from "@utils/constant";
import { pathNameByLocale, redirectedPathName } from "@utils/functions";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  return locale;
}

export function withI18nMiddleware(middleware: CustomMiddleware) {
  return async (
    req: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const pathToExcludeRegex = /^(?!\/(api|_next|template|favicon\.ico)).*/;
    const pathname = req.nextUrl.pathname;
    if (pathToExcludeRegex.test(req.nextUrl.pathname)) {
      const locale: any = getLocale(req);
      const segmentLocale: any = pathname.split("/")[1];

      if (segmentLocale === i18n.defaultLocale) {
        let segments: any = req.nextUrl.pathname.split("/");
        segments.splice(1, 1);
        const x = segments.join("/");
        return NextResponse.redirect(
          new URL(`${x.startsWith("/") ? "" : "/"}${x}`, req.url)
        );
      }
      // else if()

      //  else if (req.cookies.has("lang")) {
      //   const { value }: any = req.cookies.get("lang");
      //   const segmentLocale: any = pathname.split("/")[1];
      //   if (
      //     !i18n.locales.includes(segmentLocale) &&
      //     value !== i18n.defaultLocale
      //   ) {
      //     console.log("second condition if");
      //     return NextResponse.redirect(
      //       new URL(pathNameByLocale(value, pathname), req.url)
      //     );
      //   }
      // }
      //  else if (locale !== segmentLocale) {
      //   return NextResponse.redirect(
      //     new URL(redirectedPathName(locale, pathname), req.url)
      //   );
      // }
    }

    return middleware(req, event, response);
  };
}
