import { getDictionary } from "@utils/dictionary";
import { getLocaleFromServer } from "@utils/functions";
import { Locale } from "i18n.config";
import React from "react";

async function Page() {
  return (
    <div className="w-4/5 max-w-[1400px] mx-auto  pt-20 pb-40 max-lg:pb-32 max-lg:pt-12">
      <h2 className="font-heading text-[120px] mb-8 text-center max-md:mb-4 text-secondary-color max-lg:text-[80px] ">
        404
      </h2>
      <p className="font-heading text-[50px] mb-4 max-md:mb-2 text-center max-lg:text-[30px]   text-white">
        Sorry, Page not found
      </p>
      <p className="font-body text-center max-lg:text-[14px]  text-white">
        the link you requested broken or page has been removed
      </p>
    </div>
  );
}

export default Page;
