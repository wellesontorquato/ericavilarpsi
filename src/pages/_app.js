import "@/styles/globals.css";
import Script from "next/script";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const isIdentityToken =
      hash.includes("invite_token") ||
      hash.includes("recovery_token") ||
      hash.includes("confirmation_token");

    const isAdminAccessPage = window.location.pathname === "/admin-acesso";

    if (isIdentityToken && !isAdminAccessPage) {
      window.location.href = `/admin-acesso${hash}`;
      return;
    }

    const initIdentity = () => {
      if (!window.netlifyIdentity) return;

      window.netlifyIdentity.on("init", (user) => {
        if (!user && isIdentityToken) {
          window.netlifyIdentity.open();
        }
      });

      window.netlifyIdentity.on("signup", () => {
        window.location.href = "/admin/";
      });

      window.netlifyIdentity.on("login", () => {
        window.location.href = "/admin/";
      });

      window.netlifyIdentity.init();
    };

    const timer = setTimeout(initIdentity, 500);

    return () => clearTimeout(timer);
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