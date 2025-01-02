"use client";
import React from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "components/CMS/components-ui/shadcn/ui/toaster";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function WebLayout({ children }: { children: any }) {
  return (
    <div className="h-screen">
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY as string}
        scriptProps={{
          async: true, // optional, default to false,
          defer: true, // optional, default to false
          appendTo: "head", // optional, default to "head", can be "head" or "body",
          nonce: undefined,
        }}
      >
        <Toaster />
        <GoogleAnalytics gaId="G-WFE10W6S7Y" />
        <GoogleTagManager gtmId="GTM-THL36JR7" />
        {children}
      </GoogleReCaptchaProvider>
    </div>
  );
}

export default WebLayout;
