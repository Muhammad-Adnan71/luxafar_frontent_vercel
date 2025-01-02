"use client";
import React, { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "components/CMS/components-ui/shadcn/ui/hover-card";
import NameHeading from "./nameHeading";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { IHeaderNav, headerNavigation } from "@utils/routes/navigation";
import Link from "next/link";
import SubMenu from "./submenu";
import { DestinationsResponse } from "@utils/types";
import { pathNameByLocale, redirectedPathName } from "@utils/functions";

function Navigation({
  comingSoonLabel,
  navigation,
  destinations,
  locale,
}: {
  locale: string;
  navigation: IHeaderNav[];
  destinations: DestinationsResponse[];
  comingSoonLabel: string;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <ul className="ml-5 flex items-center [&>*:last-child]:pr-0">
        {navigation.map((nav: IHeaderNav, index: number) => (
          <li
            onMouseEnter={() =>
              nav?.hasChildren ? setIsHover(true) : setIsHover(false)
            }
            className={` ${
              locale !== "en"
                ? "max-2xl:px-2  2xl:px-2 max-xl:px-[5px]"
                : "max-2xl:px-3  2xl:px-5 max-xl:px-2"
            } ${
              nav.path === "" && locale !== "en" ? "p-0 hidden" : ""
            } max-2xl:px-3  2xl:px-5 max-xl:px-2 flex items-center  transition-all duration-500 relative  ${
              headerNavigation.length - 1 === index ? "" : ""
            }`}
            key={index}
          >
            {nav?.hasChildren ? (
              <>
                <NameHeading
                  className={` ${
                    locale !== "en"
                      ? "text-[12px] max-xl:text-[11px]"
                      : "text-[14px] max-xl:text-[12px]"
                  }  whitespace-nowrap font-[600] uppercase font-body !mb-0 py-2 `}
                >
                  {nav.label}
                </NameHeading>
                {nav?.hasChildren && (
                  <ChevronDownIcon
                    className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
                      isHover && "rotate-180"
                    }  text-secondary-color w-6 h-4 `}
                  />
                )}
              </>
            ) : (
              // <div>
              //   <Link
              //     href={nav.path}
              //     className={nav?.hasChildren ? "flex items-center" : ""}
              //   >
              //     <NameHeading className="text-[14px] max-xl:text-[12px] whitespace-nowrap font-[600] uppercase font-body !mb-0 ">
              //       {nav.label}
              //     </NameHeading>
              //     {nav?.hasChildren && (
              //       <ChevronDownIcon
              //         className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
              //           isHover && "rotate-180"
              //         }  text-secondary-color w-6 h-4 `}
              //       />
              //     )}
              //   </Link>
              // </div>
              <>
                {nav.path !== "" ? (
                  <Link
                    prefetch={false}
                    href={pathNameByLocale(locale, nav.path)}
                    className={nav?.hasChildren ? "flex items-center" : ""}
                  >
                    <NameHeading
                      className={`${
                        locale !== "en"
                          ? "text-[12px] max-xl:text-[11px"
                          : "text-[14px] max-xl:text-[12px]"
                      } whitespace-nowrap font-[600] uppercase font-body !mb-0 py-2  `}
                    >
                      {nav.label}
                    </NameHeading>
                    {nav?.hasChildren && (
                      <ChevronDownIcon
                        className={`text-radix-ui/react-icons transition-all duration-300 ease-in-out ${
                          isHover && "rotate-180"
                        }  text-secondary-color w-6 h-4 `}
                      />
                    )}
                  </Link>
                ) : (
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger>
                      <NameHeading
                        className={`${
                          locale !== "en"
                            ? "text-[12px]  max-xl:text-[11px]"
                            : "text-[14px] max-xl:text-[12px]"
                        }  whitespace-nowrap font-[600] uppercase font-body !mb-0  py-2`}
                      >
                        {nav.label}
                      </NameHeading>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="center"
                      className="px-3 py-2 text-[8px]  w-fit bg-cms-primary-color border-cms-fourth-color text-white font-body dark:bg-gray-800 dark:border-gray-900"
                    >
                      {comingSoonLabel}
                    </HoverCardContent>
                  </HoverCard>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      <div
        onMouseLeave={() => setIsHover(false)}
        className={`absolute w-4/5 max-w-[1400px]  left-[50%] translate-x-[-50%] max-lg:hidden top-32 transition-all   duration-300 
            p-10 max-xl:p-5 bg-[#103b49] ${
              isHover
                ? "opacity-95 z-40 visible translate-y-0"
                : "opacity-0 z-0 invisible translate-y-20 "
            } `}
      >
        <SubMenu
          comingSoonLabel={comingSoonLabel}
          onLinkClick={() => setIsHover(false)}
          destinations={destinations}
          locale={locale}
        />
      </div>
    </>
  );
}

export default Navigation;
