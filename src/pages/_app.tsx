import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";


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
