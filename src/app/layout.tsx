import type { Metadata } from "next";
import { SitePreferencesProvider } from "@/components/site-preferences-provider";
import { TrailingCursor } from "@/components/trailing-cursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahmi Halaby",
  description: "Personal site of Rahmi Halaby.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SitePreferencesProvider>
          {children}
          <TrailingCursor />
        </SitePreferencesProvider>
      </body>
    </html>
  );
}
