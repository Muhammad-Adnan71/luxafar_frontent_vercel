"use client";
import React from "react";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "components/CMS/containers/layout";
import { usePathname } from "next/navigation";
import "@styles/ql.css";
import { Toaster } from "components/CMS/components-ui/shadcn/ui/toaster";

export default function Layout({ children }: { children: any }) {
  const pathname = usePathname();
  const withoutLayoutRoute = ["/admin", "/admin/forgot-password"];

  if (withoutLayoutRoute.includes(pathname))
    return (
      <html className="overflow-hidden">
        <body className="overflow-hidden">
          {children} <Toaster />
        </body>
      </html>
    );
  return (
    <html className="overflow-hidden">
      <body className="overflow-hidden">
        <AdminLayout>
          {children}
          <Toaster />
        </AdminLayout>
      </body>
    </html>
  );
}
