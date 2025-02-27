import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.scss";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { unstable_setRequestLocale } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/layout/Header";
import AuthProvider from "@/components/providers/AuthProvider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    return (await import(`../../../messages/en.json`)).default;
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages(locale);
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={roboto.className} suppressHydrationWarning>
        <AuthProvider session={session}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="data-theme"
              defaultTheme="light"
              enableSystem={false}
              enableColorScheme={false}
              storageKey="formflow-theme"
              disableTransitionOnChange={false}
            >
              <div className="app-wrapper">
                <Header />
                <main className="main-content">{children}</main>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
              </div>
            </ThemeProvider>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
