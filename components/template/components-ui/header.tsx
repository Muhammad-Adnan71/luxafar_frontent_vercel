/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import Main from "../container";

import HeaderWrapper from "./headerWrapper";
import MobileNavigation from "./mobileNavigation";
import { ConfigurationResponse, DestinationsResponse } from "@utils/types";
import { WEB_ROUTES, languages } from "@utils/constant";
import { getDictionary } from "@utils/dictionary";
import Navigation from "./navigation";

import LanguageDropdown from "./languageDropdown";
import { cookies } from "next/headers";
import { getLocaleCookie, pathNameByLocale } from "@utils/functions";
import { Locale, i18n } from "i18n.config";

async function Header({
  logo,
  destinations,
  configuration,
  lang,
}: {
  lang?: any;
  configuration: ConfigurationResponse;
  logo: string;
  destinations: DestinationsResponse[];
}) {
  const locale: any = i18n.locales.includes(lang as Locale)
    ? lang
    : i18n.defaultLocale;
  const { navigation: navigationDic, tooltip } = await getDictionary(locale);

  const navigation = [
    { label: navigationDic.bespokeHoliday, path: WEB_ROUTES.BESPOKE_HOLIDAY },
    {
      label: navigationDic.destination,
      path: WEB_ROUTES.DESTINATION,
      hasChildren: true,
    },
    { label: navigationDic.tours, path: WEB_ROUTES.TOURS },
    { label: navigationDic.holidayTypes, path: WEB_ROUTES.HOLIDAY_TYPES },
    { label: navigationDic.inspirations, path: WEB_ROUTES.INSPIRATIONS },
    { label: navigationDic.shop, path: "" },
    { label: navigationDic.contact, path: WEB_ROUTES.CONTACT },
  ];

  return (
    <HeaderWrapper>
      <Main>
        <div className={`flex items-center flex-1 justify-between`}>
          <div
            className={
              "logo opacity-0 animate-[1s_loaderBg_.1s_ease-in-out_forwards_reverse]  z-[53] self-end"
            }
          >
            <Link className="cursor-pointer" href={pathNameByLocale(lang, "/")}>
              <img
                loading="eager"
                src={logo}
                alt="site logo"
                className="lg:min-h-[54px] max-w-[200px]  2xl:max-w-[220px] max-xl:max-w-[200px] max-sm:max-w-[170px] max-[400px]:max-w-[150px]"
              />
            </Link>
          </div>

          <div className="max-[1125px]:hidden">
            <div className="flex flex-col items-end justify-between gap-y-5 ">
              <div className="w-[90px]">
                <LanguageDropdown
                  lang={locale}
                  languages={languages.map((ele) => ({
                    label: ele.label,
                    value: ele.locale,
                  }))}
                />
              </div>
              <Navigation
                locale={locale}
                comingSoonLabel={tooltip?.comingSoon}
                navigation={navigation}
                destinations={destinations}
              />
            </div>
          </div>

          <div className="flex gap-x-4 min-[1126px]:hidden items-center">
            <div className="w-[60px] min-[501px]:hidden">
              <LanguageDropdown
                className="p-1 pl-2 h-7 max-sm:p-1 max-sm:pl-2 [&_svg]:w-4 [&_svg]:h-4 justify-start border-[1px] border-[rgba(166,151,105,.6)] max-sm:py-4"
                lang={locale}
                languages={languages.map((ele) => ({
                  label: ele.locale,
                  value: ele.locale,
                }))}
              />
            </div>
            <div className="w-[90px] max-[500px]:hidden">
              <LanguageDropdown
                lang={locale}
                languages={languages.map((ele) => ({
                  label: ele.label,
                  value: ele.locale,
                }))}
              />
            </div>
            <MobileNavigation
              dictionary={{ tooltip, locale }}
              destinations={destinations}
              configurations={configuration}
              navigation={navigation}
            />
          </div>
        </div>
      </Main>
    </HeaderWrapper>
  );
}

export default Header;
