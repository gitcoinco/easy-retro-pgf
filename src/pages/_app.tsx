import Script from "next/script";
import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "~/builderIdeas/component/Checkbox/Checkbox.css";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Providers } from "~/providers";
import { api } from "~/utils/api";

import { Kumbh_Sans } from "next/font/google";

export const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-kumbhSans",
});

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <Providers session={pageProps.session}>
      <Script
        src="https://cdn.cookie3.co/scripts/analytics/0.11.4/cookie3.analytics.min.js"
        integrity="sha384-lzDmDdr/zEhMdlE+N04MgISCyL3RIWNCb9LjsrQeEFi8Gy5CKXIRI+u58ZV+ybYz"
        crossOrigin="anonymous"
        async
        strategy="lazyOnload"
        data-site-id="1097"
        data-chain-tracking-enabled="true"
      />
      <style jsx global>{`
        :root {
          --font-inter: ${kumbhSans.style.fontFamily};
        }
      `}</style>
      <main className={`${kumbhSans.variable}  min-h-screen font-sans`}>
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}

export default api.withTRPC(MyApp);
