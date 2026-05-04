import Head from "next/head";
import { useEffect, useState } from "react";

const WHATSAPP_GROUP_CODE = "GlhIV0ElLnw2RB4SsMOTJI";
const WHATSAPP_WEB_LINK = `https://chat.whatsapp.com/${WHATSAPP_GROUP_CODE}`;
const WHATSAPP_APP_LINK = `whatsapp://chat?code=${WHATSAPP_GROUP_CODE}`;

export default function ObrigadoLive() {
  const [secondsLeft, setSecondsLeft] = useState(5);

  function openWhatsappGroup() {
    if (typeof window === "undefined") return;

    window.location.href = WHATSAPP_APP_LINK;

    setTimeout(() => {
      window.location.href = WHATSAPP_WEB_LINK;
    }, 900);
  }

  useEffect(() => {
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
      openWhatsappGroup();
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Inscrição confirmada | Gestação sem filtro</title>
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
            Inscrição confirmada
          </div>

          <h1>Agora entre no grupo VIP da live.</h1>

          <p className="lead">
            Sua inscrição para a live <strong>Gestação sem filtro</strong> foi
            registrada com sucesso. Você será direcionada automaticamente para o
            grupo exclusivo em alguns segundos.
          </p>

          <div className="autoRedirectBox">
            <div className="redirectCircle">
              <span>{secondsLeft}</span>
            </div>

            <div>
              <strong>
                Estamos abrindo o WhatsApp para você entrar no grupo VIP.
              </strong>
              <p>
                Se não abrir automaticamente, toque no botão abaixo para entrar
                direto.
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

          <button type="button" className="mainCta" onClick={openWhatsappGroup}>
            Abrir WhatsApp e entrar no grupo VIP
            <span>↗</span>
          </button>

          <a
            href={WHATSAPP_WEB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="fallbackLink"
          >
            Ou abrir pelo link normal do convite
          </a>

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

      <style jsx>{`
        .thanksPage,
        .thanksPage * {
          box-sizing: border-box;
        }

        .thanksPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 18px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 207, 184, 0.22), transparent 32%),
            radial-gradient(circle at 86% 18%, rgba(187, 76, 91, 0.3), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(240, 143, 101, 0.22), transparent 36%),
            linear-gradient(135deg, #321217 0%, #5a2328 43%, #9a5545 100%);
        }

        .backgroundWord {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          color: rgba(255, 235, 224, 0.075);
          font-size: clamp(3.6rem, 16vw, 13rem);
          font-weight: 950;
          letter-spacing: -0.09em;
          line-height: 0.8;
          white-space: nowrap;
          pointer-events: none;
        }

        .light {
          position: absolute;
          z-index: 0;
          border-radius: 999px;
          filter: blur(72px);
          pointer-events: none;
        }

        .lightOne {
          width: 330px;
          height: 330px;
          left: -140px;
          bottom: 18%;
          background: rgba(255, 181, 137, 0.42);
        }

        .lightTwo {
          width: 360px;
          height: 360px;
          right: -150px;
          top: 16%;
          background: rgba(129, 42, 63, 0.52);
        }

        .thanksCard {
          width: min(720px, 100%);
          position: relative;
          z-index: 1;
          border-radius: 34px;
          padding: 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 247, 242, 0.99)),
            #fff8f4;
          box-shadow:
            0 34px 95px rgba(24, 6, 8, 0.38),
            inset 0 0 0 1px rgba(255, 255, 255, 0.76);
          text-align: center;
        }

        .statusBadge {
          width: fit-content;
          margin: 0 auto 18px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #ffffff;
          color: #a64c50;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.055em;
          text-transform: uppercase;
          box-shadow: 0 12px 30px rgba(90, 35, 38, 0.08);
        }

        .statusBadge span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          animation: pulse 1.35s ease-in-out infinite;
        }

        h1 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.45rem, 11vw, 4.7rem);
          line-height: 0.9;
          letter-spacing: -0.065em;
          font-weight: 600;
        }

        .lead {
          max-width: 580px;
          margin: 18px auto 0;
          color: #563936;
          font-size: 1rem;
          line-height: 1.58;
          font-weight: 560;
        }

        .lead strong {
          color: #a64c50;
        }

        .autoRedirectBox {
          margin: 20px 0 14px;
          display: flex;
          gap: 13px;
          text-align: left;
          align-items: center;
          padding: 15px;
          border-radius: 20px;
          background: rgba(255, 240, 231, 0.82);
          border: 1px solid rgba(166, 76, 80, 0.13);
        }

        .redirectCircle {
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          box-shadow: 0 12px 26px rgba(143, 48, 72, 0.28);
          animation: pulse 1.2s ease-in-out infinite;
        }

        .redirectCircle span {
          font-size: 1.1rem;
          font-weight: 950;
        }

        .autoRedirectBox strong {
          display: block;
          color: #351817;
          font-size: 0.92rem;
          line-height: 1.32;
          font-weight: 950;
        }

        .autoRedirectBox p {
          margin: 5px 0 0;
          color: #704740;
          font-size: 0.82rem;
          line-height: 1.42;
        }

        .vipBox {
          margin: 0 0 16px;
          display: flex;
          gap: 12px;
          text-align: left;
          padding: 15px;
          border-radius: 20px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.75), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.16);
          box-shadow: 0 14px 34px rgba(143, 48, 72, 0.12);
        }

        .vipIcon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-weight: 950;
          box-shadow: 0 10px 24px rgba(143, 48, 72, 0.28);
          animation: pulse 1.45s ease-in-out infinite;
        }

        .vipBox strong {
          display: block;
          color: #351817;
          font-size: 0.95rem;
          line-height: 1.32;
          font-weight: 950;
        }

        .vipBox p {
          margin: 6px 0 0;
          color: #704740;
          font-size: 0.85rem;
          line-height: 1.45;
        }

        .mainCta {
          width: 100%;
          min-height: 58px;
          border: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 18px;
          padding: 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.98rem;
          font-weight: 950;
          text-decoration: none;
          cursor: pointer;
          box-shadow:
            0 18px 42px rgba(143, 48, 72, 0.36),
            0 0 0 0 rgba(216, 111, 79, 0.42);
          animation: ctaPulse 1.6s ease-in-out infinite;
        }

        .mainCta span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .fallbackLink {
          display: inline-block;
          margin-top: 12px;
          color: #8f3048;
          font-size: 0.82rem;
          font-weight: 850;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 18px;
        }

        .steps article {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          border-radius: 18px;
          background: rgba(255, 240, 231, 0.8);
          text-align: left;
        }

        .steps article span {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: #f4d9ce;
          color: #a64c50;
          font-size: 0.72rem;
          font-weight: 950;
        }

        .steps article p {
          margin: 0;
          color: #72443d;
          font-size: 0.9rem;
          font-weight: 850;
          line-height: 1.3;
        }

        .smallNote {
          margin: 18px 0 0;
          color: #86534b;
          font-size: 0.82rem;
          line-height: 1.4;
        }

        .smallNote strong {
          color: #8f3048;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.14);
          }
        }

        @keyframes ctaPulse {
          0%,
          100% {
            transform: translateY(0);
            box-shadow:
              0 18px 42px rgba(143, 48, 72, 0.36),
              0 0 0 0 rgba(216, 111, 79, 0.38);
          }

          50% {
            transform: translateY(-1px);
            box-shadow:
              0 22px 50px rgba(143, 48, 72, 0.44),
              0 0 0 8px rgba(216, 111, 79, 0.1);
          }
        }

        @media (min-width: 700px) {
          .thanksPage {
            padding: 28px;
          }

          .thanksCard {
            padding: 38px;
            border-radius: 42px;
          }

          .steps {
            grid-template-columns: repeat(3, 1fr);
          }

          .steps article {
            flex-direction: column;
            align-items: flex-start;
            min-height: 118px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .thanksPage *,
          .thanksPage *::before,
          .thanksPage *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}