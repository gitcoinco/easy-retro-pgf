import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter, Teko } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Providers } from "~/providers";
import { api } from "~/utils/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const heading = Teko({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-heading",
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <Providers session={pageProps.session}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-heading: ${heading.style.fontFamily};
        }
      `}</style>
      <main className={`${inter.variable}  min-h-screen font-sans`}>
        <Component {...pageProps} />
      </main>
      <Analytics />
    </Providers>
  );
}

export default api.withTRPC(MyApp);
