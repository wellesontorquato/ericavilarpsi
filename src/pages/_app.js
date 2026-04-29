import "@/styles/globals.css";
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
      const cleanHash = hash.replace("#", "");

      window.location.replace(
        `/admin-acesso?identity_token=${encodeURIComponent(cleanHash)}`
      );
    }
  }, []);

  return <Component {...pageProps} />;
}