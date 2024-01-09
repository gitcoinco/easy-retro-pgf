import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter } from "next/font/google";

import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Providers } from "~/providers";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <Providers session={pageProps.session}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <main
        className={`${inter.variable} flex min-h-screen flex-col font-sans`}
      >
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}

export default api.withTRPC(MyApp);
