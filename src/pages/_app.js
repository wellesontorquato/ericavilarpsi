import "@/styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.netlifyIdentity) {
      window.netlifyIdentity.on("init", (user) => {
        if (!user) {
          window.netlifyIdentity.on("login", () => {
            document.location.href = "/admin/";
          });
        }
      });

      window.netlifyIdentity.init();
    }
  }, []);

  return (
    <>
      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="afterInteractive"
      />

      <Component {...pageProps} />
    </>
  );
}