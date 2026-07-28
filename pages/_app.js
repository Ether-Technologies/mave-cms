import React, { useContext } from "react";
import Site from "../components/SiteContent";
import "../styles/globals.css";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Head from "next/head";
import Image from "next/image";
import { AuthProvider } from "../src/context/AuthContext";
import { MenuRefreshProvider } from "../src/context/MenuRefreshContext";
import { ThemeProvider, ThemeContext } from "../src/context/ThemeContext";
import PromoPopup from "../components/promotional/PromoPopup";
import MaveConfigProvider from "../components/MaveConfigProvider";
import { Provider } from "react-redux";
import store from "../store";

function AppContent({ Component, pageProps }) {
  const { themeRevision } = useContext(ThemeContext);

  return (
    <MaveConfigProvider themeRevision={themeRevision}>
      <Head>
        <title>Mave CMS</title>
      </Head>
      <AuthProvider>
        <MenuRefreshProvider>
          <Site>
            <PromoPopup />
            <Component {...pageProps} />
          </Site>
        </MenuRefreshProvider>
      </AuthProvider>
      <footer className="mave-shell-footer fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-mave-muted">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--border-strong)]" />
              <span>
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://www.linkedin.com/in/atiq-israk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-mave-secondary hover:text-mave-primary transition-colors"
                >
                  MAVE CMS
                </a>
              </span>
            </div>

            <div className="hidden md:block w-px h-6 bg-[var(--border-default)]" />

            <div className="flex items-center gap-3 text-sm text-mave-muted">
              <span>All rights reserved</span>
              <span className="text-[var(--border-strong)]">·</span>
              <span>Powered by</span>
              <a
                href="https://www.ethertech.ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <Image
                  src="/ethertech-logo.svg"
                  alt="Ether Technologies"
                  width={120}
                  height={22}
                  objectFit="contain"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </MaveConfigProvider>
  );
}

function MyApp(props) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent {...props} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
