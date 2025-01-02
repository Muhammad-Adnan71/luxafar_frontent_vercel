"use client";
import React, { useEffect, useState } from "react";
import SearchSelectInput from "./searchSelect";
import { usePathname, useSearchParams } from "next/navigation";
import { Locale, i18n } from "i18n.config";
import { cn } from "@utils/functions";
import { getCookie, setCookie } from "cookies-next";

function LanguageDropdown({
  lang,
  className,
  languages,
}: {
  languages?: any;
  lang: Locale;
  className?: string;
}) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<Locale>();
  useEffect(() => {
    setValue(lang);
  }, []);

  const handleSelectedLanguage = async (lang: Locale) => {
    setValue(lang);
    const localeCookie = getCookie("lang");
    if (localeCookie !== lang) {
      const activeTab = searchParams.get("tab") as string;
      if (localeCookie) {
        if (pathName.split("/")[1].length == 2) {
          const segments = pathName.split("/");
          if (lang === "en") {
            segments.splice(1, 1);
          } else {
            segments.splice(1, 1, lang);
          }
          const newPath = segments.join("/");
          const newPathToGo = `${
            !newPath.length
              ? "/"
              : pathName.startsWith("/")
              ? ""
              : `/${newPath}`
          }${newPath}`;
          window.location.href = `${newPathToGo}${
            activeTab ? `?tab=${activeTab}` : ""
          }`;
        } else {
          const newPath = `${lang === "en" ? "" : lang}${
            pathName.startsWith("/") ? "" : `/${pathName}`
          }${pathName}`;
          window.location.href = `/${newPath}${
            activeTab ? `?tab=${activeTab}` : ""
          }`;
        }
        setCookie("lang", lang, { maxAge: 60 * 6 * 24 });
      } else {
        const newPath = `${lang === "en" ? "" : lang}${
          pathName.startsWith("/") ? "" : `/${pathName}`
        }${pathName}`;
        window.location.href = `/${newPath}${
          activeTab ? `?tab=${activeTab}` : ""
        }`;
        setCookie("lang", lang, { maxAge: 60 * 6 * 24 });
      }
    }
  };

  return (
    <SearchSelectInput
      classNameItem={"text-[11px] w-[7rem]  "}
      classNameContent="w-[4rem] "
      value={value}
      defaultValue={value}
      onChange={handleSelectedLanguage}
      items={
        languages
          ? languages
          : i18n.locales.map((locale: Locale) => ({
              value: locale,
              label: locale,
            }))
      }
      className={cn([
        "p-1 pl-2 h-7 justify-start [&_span]:text-secondary-color [&_svg]:w-4 [&_svg]:h-4 border-[1px] border-[rgba(166,151,105,.6)]  max-sm:py-4",
        className,
      ])}
    />
  );
}
export default LanguageDropdown;
