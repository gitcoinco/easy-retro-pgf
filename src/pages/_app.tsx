import "~/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Inter, Teko } from "next/font/google";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { Providers } from "~/providers";
import { api } from "~/utils/api";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

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

      <PostHogProvider client={posthog}>
        <main className={`${inter.variable}  min-h-screen font-sans`}>
          <Component {...pageProps} />
        </main>
      </PostHogProvider>
    </Providers>
  );
}

export default api.withTRPC(MyApp);
