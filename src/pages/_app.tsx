import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Noto_Sans } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/shadcn/ui/toaster";
import LayoutProvider from "~/components/LayoutProvider";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${notoSans.variable}`}>
      <SessionProvider session={session}>
        <LayoutProvider>
          <Component {...pageProps} />
          <Toaster />
        </LayoutProvider>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
