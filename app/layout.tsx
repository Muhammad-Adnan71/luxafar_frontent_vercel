import { Metadata } from "next";
import "@styles/globals.css";
import "@styles/glassEffect.css";

export const metadata: Metadata = {
  title: "Luxafar-Re-Defining Luxury",

  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon.ico",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon.ico",
    },
  ],
};
export default function RootLayout({ children }: { children: any }) {
  return children;
}
