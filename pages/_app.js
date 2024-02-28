import { useEffect } from "react";
import Site from "../components/Site";
import { setPageTitle } from "../global/constants/pageTitle";
import { ContextProvider } from "../src/context/context";
import "../styles/globals.css";
import Head from "next/head";
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Use a state or context to track the current page name
    // This can be set whenever the page changes, e.g., in your route handling logic.
    const currentPageName = "Home Page";

    // Set the dynamic page title
    setPageTitle(currentPageName);
  }, []);

  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
      </Head>
      <ContextProvider>
        <Site />
        <Component {...pageProps} />

        <footer className="mave-footer">
          <p>© 2024 <a href="https://www.ethertech.ltd" target="_blank" rel="noopener noreferrer">Ether Technologies</a> | All rights reserved | Powered by <a href="https://www.webable.digital" target="_blank" rel="noopener noreferrer">Webable Digital</a></p>
        </footer>
      </ContextProvider>
    </>
  );
}

export default MyApp;
