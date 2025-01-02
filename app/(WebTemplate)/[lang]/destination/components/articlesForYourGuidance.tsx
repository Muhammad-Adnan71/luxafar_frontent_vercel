import MainHeading from "@template-components/heading";
import BlogCardWrapper from "components/template/container/blogCardWrapper";
import React from "react";
import { InspirationResponse } from "@utils/types";
import Button from "@template-components/button";
import { pathNameByLocale, replaceSpacesWithDash } from "@utils/functions";
import { WEB_ROUTES } from "@utils/constant";
import { getCookie } from "cookies-next";

const ArticlesForYourGuidance = ({
  inspirations,
  inspirationCount,
  destination,
  dictionary,
}: {
  dictionary: any;
  destination?: string;
  inspirationCount?: number;
  inspirations?: InspirationResponse[];
}) => {
  const { button, sectionHeadings, locale } = dictionary;

  return (
    <>
      <div
        data-scroll
        data-scroll-speed=".2"
        data-scroll-direction="vertical"
        className="flex justify-between items-center"
      >
        <MainHeading classes="mb-10">
          {sectionHeadings.articlesForYourGuidance}
        </MainHeading>
        {inspirationCount && inspirationCount > 3 ? (
          <Button
            redirect={pathNameByLocale(
              locale,
              `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(destination)}`
            )}
            classes={`text-[12px] max-sm:text-[11px] max-md:hidden ${
              locale !== "en" ? "text-[12px] !capitalize px-3" : ""
            }`}
            text={button.browseAllInspiration}
          />
        ) : (
          ""
        )}
      </div>
      <BlogCardWrapper
        locale={locale}
        readMore={button.readMore}
        blogs={inspirations}
        destinationName={destination}
      />
      {inspirationCount && inspirationCount > 3 ? (
        <div className="md:hidden text-center mt-10 max-sm:mt-14">
          <Button
            redirect={pathNameByLocale(
              locale,
              `${WEB_ROUTES.INSPIRATIONS}/${replaceSpacesWithDash(destination)}`
            )}
            classes={`  max-sm:text-[11px]  ${
              locale !== "en" ? "!text-[10px] !capitalize px-3" : "!text-[12px]"
            }`}
            text={button.browseAllInspiration}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ArticlesForYourGuidance;
