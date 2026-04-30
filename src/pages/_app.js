import "@/styles/globals.css";
import { useEffect } from "react";
import { Libre_Bodoni, Montserrat } from "next/font/google";

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-libre-bodoni",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { hash, pathname } = window.location;

    if (!hash) return;

    const isAdminAccessPage = pathname === "/admin-acesso";

    if (isAdminAccessPage) return;

    const cleanHash = hash.replace("#", "");
    const params = new URLSearchParams(cleanHash);

    const tokenConfig = [
      {
        key: "invite_token",
        type: "invite",
      },
      {
        key: "recovery_token",
        type: "recovery",
      },
      {
        key: "confirmation_token",
        type: "confirmation",
      },
    ];

    const matchedToken = tokenConfig.find(({ key }) => params.has(key));

    if (!matchedToken) return;

    const token = params.get(matchedToken.key);

    if (!token) return;

    window.location.replace(
      `/admin-acesso?type=${matchedToken.type}&token=${encodeURIComponent(token)}`
    );
  }, []);

  return (
    <div className={`${libreBodoni.variable} ${montserrat.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}