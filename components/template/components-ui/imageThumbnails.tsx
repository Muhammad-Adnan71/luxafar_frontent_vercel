import { ChevronRightIcon } from "@radix-ui/react-icons";
import Paragraph from "@template-components/paragraph";
import Link from "next/link";
import React from "react";
import Button from "./button";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import { useRouter } from "next/navigation";
import { WEB_ROUTES } from "@utils/constant";

function ImageThumbnails({
  viewAllPlaces,
  thumbnails,
  classes,
  destination,
  locale,
}: {
  locale: any;
  viewAllPlaces: string;
  destination?: {
    name: string;
    id: string;
    slug: string;
  };
  classes: string;
  thumbnails?: any;
}) {
  const router = useRouter();
  return (
    <div className={` ` + classes}>
      <div className="flex gap-5">
        {thumbnails?.slice(0, 2).map((thumbnail: any, index: number) => (
          <div key={index} className="flex flex-col gap-3 w-full">
            <div className="overflow-hidden min-h-[110px] max-md:min-h-[117px]">
              <Link
                className="relative"
                href={pathNameByLocale(locale, "/" + thumbnail?.seoMeta?.slug)}
              >
                <img
                  loading="eager"
                  src={thumbnail?.media?.mobileMediaUrl}
                  className="w-full h-full object-cover"
                  alt={
                    thumbnail?.title
                      ? thumbnail?.title + " " + "Place Image Luxafar"
                      : ""
                  }
                />
                <span className="opacity-0 transition-all ease-in-out duration-300 absolute hover:opacity-100 flex justify-center items-center text-[50px] font-[200] text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-secondary-color bg-opacity-60">
                  +
                </span>
              </Link>
            </div>
            <h6 className="font-heading font-bold text-secondary-color text-[20px] max-sm:text-[18px]">
              <Link
                href={pathNameByLocale(locale, "/" + thumbnail?.seoMeta?.slug)}
              >
                {thumbnail?.title}
              </Link>
            </h6>
          </div>
        ))}
        {thumbnails?.length > 2 && (
          <div className="flex flex-col gap-3 w-full max-xl:hidden mb-8">
            <div
              onClick={() =>
                router.push(
                  pathNameByLocale(
                    locale,
                    `/${replaceSpacesWithDash(
                      destination?.slug
                    )}?tab=places-to-visit`
                  )
                )
              }
              className="w-full h-full cursor-pointer bg-quaternary-color flex items-center justify-center flex-col gap-1 "
            >
              <Link
                href={pathNameByLocale(
                  locale,
                  `/${replaceSpacesWithDash(
                    destination?.slug
                  )}?tab=places-to-visit`
                )}
                className="flex items-center justify-center gap-1"
              >
                <ChevronRightIcon className=" h-6 w-6 text-secondary-color " />
                <Paragraph classes="opacity-1 text-secondary-color uppercase text-[14px] m-0 w-[70%] !leading-[1.2]">
                  {viewAllPlaces}
                </Paragraph>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="text-center mt-12 xl:hidden">
        {thumbnails?.length > 2 && (
          <Button
            classes="!text-[14px] uppercase max-sm:!text-[12px]"
            text={viewAllPlaces}
            redirect={pathNameByLocale(
              locale,
              `/${replaceSpacesWithDash(destination?.slug)}?tab=places-to-visit`
            )}
          />
        )}
      </div>
    </div>
  );
}

export default ImageThumbnails;
