"use client";

import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { LocomotiveScrollProvider as RLSProvider } from "react-locomotive-scroll";

import { usePathname } from "next/navigation";
// import ContactDrawer from "@template-components/drawers/contactDrawer";
import usePreloader from "store/usePreloader";
import dynamic from "next/dynamic";
import { Locale, i18n } from "i18n.config";
import { setCookie } from "cookies-next";
import SubscribeModal from "@template-components/modals/subscribeModal";
import SubscribeModal2 from "@template-components/modals/subscribeModal2";
import useAdventure from "store/useAdventure";
const ContactDrawer = dynamic(
  () => import("@template-components/drawers/contactDrawer"),
  { ssr: false }
);
function RSLProvider({
  children,
  dictionary,
  lang,
}: {
  lang: any;
  children: any;
  dictionary?: any;
}) {
  const pathName = usePathname();
  const containerRef = useRef(null);
  const { isLoading, handleLoading } = usePreloader();
  const { isAdventure } = useAdventure();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    setCookie("lang", lang, { maxAge: 60 * 6 * 24 });

    if (!isLoading) {
      setTimeout(() => {
        setIsHidden(false);
      }, 500);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleLoad = () => handleLoading();
    if (document.readyState === "complete") handleLoading();
    else window.addEventListener("load", handleLoad);
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  const classes = `leading-none overflow-hidden ${
    isHidden ? "h-screen " : "w-screen"
  }`;
  const {
    errors,
    placeholder,
    button,
    contactDrawer,
    dropdown,
    subscribeModal,
    error,
    locale,
  } = dictionary;

  return (
    <RLSProvider
      options={{
        smooth: true,
      }}
      watch={[]}
      location={pathName}
      onLocationChange={(scroll: any) => {
        scroll.scrollTo(0, { duration: 0, disableLerp: true });
      }}
      containerRef={containerRef}
    >
      <main
        id="header-container"
        className={classes}
        data-scroll-container
        ref={containerRef}
      >
        {children}
      </main>
      <ContactDrawer
        lang={lang}
        dictionary={{ errors, placeholder, button, contactDrawer, dropdown }}
      />
      {isAdventure ? (
        <SubscribeModal
          dictionary={{ placeholder, button, subscribeModal, errors, locale }}
        />
      ) : (
        <SubscribeModal2
          dictionary={{ placeholder, button, subscribeModal, errors, locale }}
        />
      )}
    </RLSProvider>
  );
}

export default RSLProvider;
