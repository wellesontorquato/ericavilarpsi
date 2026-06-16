import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const WHATSAPP_GROUP_CODE = "GlhIV0ElLnw2RB4SsMOTJI";
const WHATSAPP_WEB_LINK = `https://chat.whatsapp.com/${WHATSAPP_GROUP_CODE}`;

// Fallback para iOS ou navegadores que aceitam deep link direto
const WHATSAPP_APP_LINK = `whatsapp://chat?code=${WHATSAPP_GROUP_CODE}`;

// Melhor formato para Chrome Android: abre o link do grupo direcionando ao pacote do WhatsApp
const WHATSAPP_ANDROID_INTENT = `intent://chat.whatsapp.com/${WHATSAPP_GROUP_CODE}#Intent;scheme=https;package=com.whatsapp;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${encodeURIComponent(
  WHATSAPP_WEB_LINK
)};end`;

// Versão para WhatsApp Business
const WHATSAPP_ANDROID_BUSINESS_INTENT = `intent://chat.whatsapp.com/${WHATSAPP_GROUP_CODE}#Intent;scheme=https;package=com.whatsapp.w4b;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${encodeURIComponent(
  WHATSAPP_WEB_LINK
)};end`;

const REDIRECT_DELAY_SECONDS = 15;

function shouldDisableAutoRedirect() {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";

  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  const isChromeAndroid =
    isAndroid &&
    /Chrome/i.test(userAgent) &&
    !/EdgA|OPR|Opera|SamsungBrowser|Firefox|DuckDuckGo/i.test(userAgent);

  const isChromeIOS = isIOS && /CriOS/i.test(userAgent);

  return isChromeAndroid || isChromeIOS;
}

export default function ObrigadoLive() {
  const router = useRouter();
  const isAlreadyRegistered = router.query.status === "ja-inscrito";

  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_SECONDS);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);

  function openWhatsappGroup({ automatic = false } = {}) {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    let pageWasHidden = false;

    const markAsHidden = () => {
      pageWasHidden = true;
    };

    document.addEventListener("visibilitychange", markAsHidden, { once: true });
    window.addEventListener("pagehide", markAsHidden, { once: true });

    if (isAndroid) {
      window.location.href = WHATSAPP_ANDROID_INTENT;

      setTimeout(() => {
        if (!pageWasHidden && !automatic) {
          window.location.href = WHATSAPP_APP_LINK;
        }
      }, 1200);

      setTimeout(() => {
        if (!pageWasHidden) {
          window.location.href = WHATSAPP_WEB_LINK;
        }
      }, automatic ? 2600 : 3200);

      return;
    }

    if (isIOS) {
      window.location.href = WHATSAPP_APP_LINK;

      setTimeout(() => {
        if (!pageWasHidden) {
          window.location.href = WHATSAPP_WEB_LINK;
        }
      }, 1800);

      return;
    }

    window.location.href = WHATSAPP_WEB_LINK;
  }

  function openWhatsappBusiness() {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || "";
    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    if (isAndroid) {
      window.location.href = WHATSAPP_ANDROID_BUSINESS_INTENT;

      setTimeout(() => {
        window.location.href = WHATSAPP_WEB_LINK;
      }, 2600);

      return;
    }

    if (isIOS) {
      window.location.href = WHATSAPP_APP_LINK;

      setTimeout(() => {
        window.location.href = WHATSAPP_WEB_LINK;
      }, 1600);

      return;
    }

    window.location.href = WHATSAPP_WEB_LINK;
  }

  useEffect(() => {
    const disableAutoRedirect = shouldDisableAutoRedirect();

    if (disableAutoRedirect) {
      setAutoRedirectEnabled(false);
      setSecondsLeft(0);
      return;
    }

    setAutoRedirectEnabled(true);
    setSecondsLeft(REDIRECT_DELAY_SECONDS);

    const countdown = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(countdown);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    const redirect = setTimeout(() => {
      openWhatsappGroup({ automatic: true });
    }, REDIRECT_DELAY_SECONDS * 1000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <>
      <Head>
        <title>
          {isAlreadyRegistered
            ? "Você já estava inscrita | Gestação sem filtro"
            : "Inscrição confirmada | Gestação sem filtro"}
        </title>
        <meta
          name="description"
          content="Sua inscrição na live Gestação sem filtro foi confirmada. Entre no grupo VIP para receber lembretes e materiais exclusivos."
        />
      </Head>

      <main className="thanksPage">
        <div className="backgroundWord">CONFIRMADA</div>
        <div className="light lightOne" />
        <div className="light lightTwo" />

        <section className="thanksCard">
          <div className="statusBadge">
            <span />
            {isAlreadyRegistered ? "Inscrição já encontrada" : "Inscrição confirmada"}
          </div>

          <h1>
            {isAlreadyRegistered
              ? "Você já estava na lista VIP."
              : "Agora entre no grupo VIP da live."}
          </h1>

          <p className="lead">
            {isAlreadyRegistered ? (
              <>
                Encontramos uma inscrição anterior para esta live. Se você ainda
                não entrou no grupo VIP, toque no botão abaixo para acessar agora.
              </>
            ) : (
              <>
                Sua inscrição para a live <strong>Gestação sem filtro</strong>{" "}
                foi registrada com sucesso.{" "}
                {autoRedirectEnabled
                  ? "Você será direcionada automaticamente para o grupo exclusivo em alguns segundos."
                  : "Agora toque no botão abaixo para entrar no grupo VIP pelo WhatsApp."}
              </>
            )}
          </p>

          <div className="autoRedirectBox">
            <div className="redirectCircle">
              <span>{autoRedirectEnabled ? secondsLeft : "↗"}</span>
            </div>

            <div>
              <strong>
                {autoRedirectEnabled
                  ? "Estamos abrindo o WhatsApp para você entrar no grupo VIP."
                  : "Toque no botão abaixo para abrir o grupo no WhatsApp."}
              </strong>

              <p>
                {autoRedirectEnabled
                  ? "Se não abrir automaticamente, toque no botão abaixo para entrar direto."
                  : "No Chrome do celular, a abertura automática pode ser bloqueada. O botão abaixo é o caminho mais seguro para abrir direto no app."}
              </p>
            </div>
          </div>

          <div className="vipBox">
            <div className="vipIcon">✦</div>

            <div>
              <strong>Grupo VIP da live</strong>
              <p>
                O grupo será usado apenas para lembretes, avisos importantes e
                envio dos mimos com materiais de apoio depois da live.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mainCta"
            onClick={() => openWhatsappGroup({ automatic: false })}
          >
            Abrir WhatsApp e entrar no grupo VIP
            <span>↗</span>
          </button>

          <div className="alternativeLinks">
            <button
              type="button"
              className="businessCta"
              onClick={openWhatsappBusiness}
            >
              Uso WhatsApp Business
            </button>

            <a
              href={WHATSAPP_WEB_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="fallbackLink"
            >
              Ou abrir pelo link normal do convite
            </a>
          </div>

          <div className="steps">
            <article>
              <span>01</span>
              <p>Entre no grupo VIP</p>
            </article>

            <article>
              <span>02</span>
              <p>Receba os lembretes da live</p>
            </article>

            <article>
              <span>03</span>
              <p>Ganhe os materiais depois do encontro</p>
            </article>
          </div>

          <p className="smallNote">
            A live acontece no Instagram, dia <strong>24 de maio às 17h</strong>.
          </p>
        </section>
      </main>
    </>
  );
}