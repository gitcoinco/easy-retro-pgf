import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter } from "next/font/google";

import type { AppProps } from "next/app";
import { Providers } from "~/providers";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <main className={`${inter.variable}  min-h-screen font-sans`}>
        <Component {...pageProps} />
      </main>
    </Providers>
  );
}

export default api.withTRPC(MyApp);
