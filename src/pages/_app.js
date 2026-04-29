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
      const params = new URLSearchParams(cleanHash);

      const inviteToken = params.get("invite_token");
      const recoveryToken = params.get("recovery_token");
      const confirmationToken = params.get("confirmation_token");

      if (inviteToken) {
        window.location.replace(
          `/admin-acesso?type=invite&token=${encodeURIComponent(inviteToken)}`
        );
        return;
      }

      if (recoveryToken) {
        window.location.replace(
          `/admin-acesso?type=recovery&token=${encodeURIComponent(recoveryToken)}`
        );
        return;
      }

      if (confirmationToken) {
        window.location.replace(
          `/admin-acesso?type=confirmation&token=${encodeURIComponent(
            confirmationToken
          )}`
        );
      }
    }
  }, []);

  return <Component {...pageProps} />;
}