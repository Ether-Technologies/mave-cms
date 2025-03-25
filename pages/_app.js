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
      <footer className="mave-footer">
        <p>
          © {new Date().getFullYear()}{" "}
          <a
            href="https://www.linkedin.com/in/atiq-israk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MAVE CMS
          </a>{" "}
          | All rights reserved | Powered by{" "}
          <a
            href="https://www.ethertech.ltd"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ether Technologies
          </a>
        </p>
      </footer>
    </Provider>
  );
}

export default MyApp;
