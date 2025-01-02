import { WEB_ROUTES } from "@utils/constant";
import { pathNameByLocale } from "@utils/functions";
import Link from "next/link";
import React from "react";

function TripCard({
  image,
  name,
  redirect,
  locale,
}: {
  locale: any;
  image: any;
  name?: string;
  redirect?: string;
}) {
  return (
    <div className="flex justify-center items-center flex-col gap-y-5">
      <div className="w-[250px] h-[250px] rounded-full overflow-hidden max-lg:w-[200px] max-lg:h-[200px]">
        <img
          loading="lazy"
          src={image}
          alt={name ? name + " " + "Luxafar Trip Idea Image" : ""}
          className="w-full h-full object-cover"
        />
      </div>
      <Link
        href={pathNameByLocale(
          locale,
          `${WEB_ROUTES.HOLIDAY_TYPES}/${redirect}`
        )}
      >
        <h6
          className={`font-heading text-secondary-color text-center ${
            locale === "ru" ? "text-[17px]" : "text-[20px]"
          }`}
        >
          {name}
        </h6>
      </Link>
    </div>
  );
}

export default TripCard;
