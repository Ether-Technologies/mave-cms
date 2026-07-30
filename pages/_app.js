// pages/_app.js

import React from "react";
import Site from "../components/SiteContent"; // Adjust the import path if necessary
import "../styles/globals.css";
// Import React Quill CSS here
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
import { ThemeProvider } from "../src/context/ThemeContext";
import PromoPopup from "../components/promotional/PromoPopup";
import { Provider } from "react-redux";
import store from "../store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Mave CMS</title>
      </Head>
      <AuthProvider>
        <MenuRefreshProvider>
          <ThemeProvider>
            {" "}
            {/* Wrap with ThemeProvider */}
            <Site>
              <PromoPopup />
              <Component {...pageProps} />
            </Site>
          </ThemeProvider>
        </MenuRefreshProvider>
      </AuthProvider>
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left Section - Copyright */}
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand to-brand-dark"></div>
              <span className="text-sm">
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://www.linkedin.com/in/atiq-israk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold bg-gradient-to-r from-brand via-blue-400 to-blue-500 bg-clip-text text-transparent hover:from-blue-300 hover:via-blue-400 hover:to-blue-500 transition-all duration-300"
                >
                  MAVE CMS
                </a>
              </span>
            </div>

            {/* Right Section - Powered By */}
            <div className="flex items-center gap-3 text-gray-600 text-sm">
              <span className="font-light">All rights reserved</span>
              <span className="text-gray-300">•</span>
              <span className="font-light">Powered by</span>
              <a
                href="https://www.ethertech.ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/ethertech-logo.svg"
                  alt="Ether Technologies"
                  width={128}
                  height={24}
                  objectFit="contain"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </Provider>
  );
}

export default MyApp;
