import Head from "next/head";

const subtemas = [
  "Mudanças no corpo durante a gestação",
  "Medos, ansiedade e inseguranças",
  "Dores, desconfortos e preparação física",
  "Parto, pós-parto e puerpério real",
  "Culpa, autocobrança e comparação",
  "Rede de apoio e cuidado emocional",
];

export default function LiveMaio() {
  return (
    <>
      <Head>
        <title>Live Maio | Gestação sem filtro</title>
        <meta
          name="description"
          content="Live gratuita no Instagram com Érica Vilar e Lizia Nascimento sobre gestação, corpo, emoções, preparação e pós-parto."
        />
      </Head>

      <main className="liveMaioPage">
        <div className="backgroundWord">GESTAÇÃO</div>
        <div className="light lightOne" />
        <div className="light lightTwo" />

        <section className="heroSection">
          <div className="heroCard">
            <div className="heroCopy">
              <div className="liveBadge">
                <span />
                Live gratuita no Instagram
              </div>

              <div className="eventInfo">
                <span>24 de maio</span>
                <span>17h</span>
                <span>60 minutos</span>
              </div>

              <p className="preTitle">Para gestantes, tentantes e mães recentes</p>

              <h1 className="heroTitle">
                Gestação sem filtro:
                <em> tudo que você precisa saber e nunca te contaram.</em>
              </h1>

              <p className="heroText">
                Uma conversa real, acolhedora e sem romantização sobre corpo,
                emoções, medos, dores, culpa, preparação e pós-parto.
              </p>

              <div className="promiseBox">
                <strong>Você não precisa passar por essa fase cheia de dúvidas.</strong>
                <p>
                  Essa live é um espaço para falar com honestidade sobre o que
                  muitas mulheres sentem, mas quase ninguém explica com cuidado.
                </p>
              </div>
            </div>

            <div className="speakersBlock">
              <SpeakerPhotos />

              <div className="miniBioGrid">
                <article>
                  <span>Psicóloga</span>
                  <strong>Érica Vilar</strong>
                  <p>
                    Psicóloga clínica, fala sobre saúde emocional feminina,
                    maternidade, vínculos e autocuidado com sensibilidade e
                    profundidade.
                  </p>
                </article>

                <article>
                  <span>Fisioterapeuta e doula</span>
                  <strong>Lizia Nascimento</strong>
                  <p>
                    Atua no cuidado integral da mulher da gestação ao pós-parto,
                    unindo técnica, acolhimento e escuta.
                  </p>
                </article>
              </div>
            </div>

            <FormCard />
          </div>
        </section>

        <section className="topicsSection">
          <div className="topicsHeader">
            <span>O que será conversado</span>
            <h2>Uma live para falar o que quase ninguém fala sobre gestar</h2>
            <p>
              Informação, acolhimento e orientação para viver essa fase com mais
              consciência, menos culpa e mais segurança.
            </p>
          </div>

          <div className="topicsGrid">
            <article>
              <span>01</span>
              <h3>O corpo muda. E isso mexe com tudo.</h3>
              <p>
                Dores, desconfortos, alterações físicas e sensações que muitas
                mulheres só descobrem quando já estão vivendo.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Nem toda gestação parece propaganda.</h3>
              <p>
                Medos, inseguranças, culpa e autocobrança também fazem parte da
                experiência de muitas mulheres.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Preparação também é cuidado emocional.</h3>
              <p>
                Como olhar para parto, pós-parto, rede de apoio e puerpério de
                um jeito mais real e possível.
              </p>
            </article>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .liveMaioPage,
        .liveMaioPage * {
          box-sizing: border-box;
        }

        .liveMaioPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 18px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 207, 184, 0.2), transparent 32%),
            radial-gradient(circle at 86% 18%, rgba(187, 76, 91, 0.28), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(240, 143, 101, 0.22), transparent 36%),
            linear-gradient(135deg, #321217 0%, #5a2328 43%, #9a5545 100%);
        }

        .liveMaioPage .backgroundWord {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          color: rgba(255, 235, 224, 0.075);
          font-size: clamp(4rem, 18vw, 16rem);
          font-weight: 950;
          letter-spacing: -0.09em;
          line-height: 0.8;
          white-space: nowrap;
          pointer-events: none;
        }

        .liveMaioPage .light {
          position: absolute;
          z-index: 0;
          border-radius: 999px;
          filter: blur(72px);
          pointer-events: none;
        }

        .liveMaioPage .lightOne {
          width: 330px;
          height: 330px;
          left: -140px;
          bottom: 18%;
          background: rgba(255, 181, 137, 0.42);
        }

        .liveMaioPage .lightTwo {
          width: 360px;
          height: 360px;
          right: -150px;
          top: 16%;
          background: rgba(129, 42, 63, 0.52);
        }

        .liveMaioPage .heroSection,
        .liveMaioPage .topicsSection {
          width: min(1180px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .liveMaioPage .heroSection {
          padding: 12px 0 34px;
        }

        .liveMaioPage .heroCard {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          overflow: hidden;
          border-radius: 34px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 242, 0.98)),
            #fff8f4;
          box-shadow:
            0 34px 95px rgba(24, 6, 8, 0.38),
            inset 0 0 0 1px rgba(255, 255, 255, 0.76);
        }

        .liveMaioPage .heroCopy {
          min-width: 0;
        }

        .liveMaioPage .liveBadge {
          width: fit-content;
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

        .liveMaioPage .liveBadge span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
        }

        .liveMaioPage .eventInfo {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0 18px;
        }

        .liveMaioPage .eventInfo span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7e5dc;
          color: #7f3d3a;
          font-size: 0.78rem;
          font-weight: 850;
        }

        .liveMaioPage .preTitle {
          margin: 0 0 10px;
          color: #a64c50;
          font-size: 0.73rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .heroTitle {
          margin: 0;
          max-width: 670px;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.55rem, 11vw, 5.1rem);
          line-height: 0.9;
          letter-spacing: -0.065em;
          font-weight: 600;
        }

        .liveMaioPage .heroTitle em {
          display: block;
          color: #a64c50;
          font-style: italic;
          font-weight: 400;
        }

        .liveMaioPage .heroText {
          margin: 18px 0 0;
          max-width: 610px;
          color: #563936;
          font-size: 1rem;
          line-height: 1.62;
          font-weight: 560;
        }

        .liveMaioPage .promiseBox {
          margin-top: 18px;
          padding: 16px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(255, 242, 233, 0.94), rgba(248, 218, 205, 0.9));
          border: 1px solid rgba(166, 76, 80, 0.12);
          box-shadow: 0 16px 38px rgba(92, 38, 35, 0.08);
        }

        .liveMaioPage .promiseBox strong {
          display: block;
          color: #351817;
          font-size: 0.98rem;
          line-height: 1.35;
          font-weight: 950;
        }

        .liveMaioPage .promiseBox p {
          margin: 8px 0 0;
          color: #714942;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .liveMaioPage .speakersBlock {
          min-width: 0;
        }

        .liveMaioPage .speakers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .liveMaioPage .speaker {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border-radius: 26px;
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 236, 224, 0.96), transparent 45%),
            linear-gradient(180deg, #f5d9cc, #e8b7a6);
          border: 1px solid rgba(166, 76, 80, 0.1);
          box-shadow: 0 20px 45px rgba(92, 38, 35, 0.13);
        }

        .liveMaioPage .speaker:nth-child(2) {
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 241, 232, 0.96), transparent 45%),
            linear-gradient(180deg, #f8dfd3, #e9b8a7);
        }

        .liveMaioPage .speaker img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center top;
        }

        .liveMaioPage .speaker::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          height: 54%;
          background: linear-gradient(180deg, transparent, rgba(44, 18, 18, 0.74));
        }

        .liveMaioPage .speakerName {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 2;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 250, 246, 0.88);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 36px rgba(49, 15, 15, 0.18);
        }

        .liveMaioPage .speakerName span {
          display: block;
          margin-bottom: 4px;
          color: #a64c50;
          font-size: 0.6rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .liveMaioPage .speakerName strong {
          display: block;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.08rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .liveMaioPage .miniBioGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .liveMaioPage .miniBioGrid article {
          padding: 15px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(166, 76, 80, 0.08);
        }

        .liveMaioPage .miniBioGrid span {
          display: block;
          margin-bottom: 5px;
          color: #a64c50;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .liveMaioPage .miniBioGrid strong {
          display: block;
          margin-bottom: 8px;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.38rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .liveMaioPage .miniBioGrid p {
          margin: 0;
          color: #60413b;
          font-size: 0.87rem;
          line-height: 1.52;
        }

        .liveMaioPage .formCard {
          align-self: start;
          border-radius: 30px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 244, 238, 0.98)),
            #fff8f4;
          border: 1px solid rgba(166, 76, 80, 0.12);
          box-shadow: 0 24px 60px rgba(49, 15, 15, 0.16);
        }

        .liveMaioPage .formHeader {
          margin-bottom: 16px;
        }

        .liveMaioPage .formHeader span {
          display: inline-block;
          margin-bottom: 8px;
          color: #a64c50;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .liveMaioPage .formHeader h2 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 8vw, 2.65rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .liveMaioPage .formHeader p {
          margin: 10px 0 0;
          color: #67443e;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .liveMaioPage .leadForm {
          display: grid;
          gap: 11px;
          width: 100%;
        }

        .liveMaioPage .field {
          display: grid;
          gap: 6px;
        }

        .liveMaioPage .field label,
        .liveMaioPage .checkboxTitle {
          color: #3a1b1a;
          font-size: 0.82rem;
          font-weight: 850;
        }

        .liveMaioPage .field input {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fffaf7;
          padding: 13px 14px;
          color: #2d1717;
          font: inherit;
          outline: none;
          transition: box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .liveMaioPage .field input:focus {
          border-color: rgba(166, 76, 80, 0.58);
          box-shadow: 0 0 0 4px rgba(166, 76, 80, 0.12);
        }

        .liveMaioPage .checkboxGroup {
          display: grid;
          gap: 9px;
          margin-top: 2px;
        }

        .liveMaioPage .checkboxOptions {
          display: grid;
          gap: 8px;
        }

        .liveMaioPage .checkOption {
          cursor: pointer;
        }

        .liveMaioPage .checkOption input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .liveMaioPage .checkOption span {
          position: relative;
          display: block;
          min-height: 46px;
          padding: 11px 12px 11px 38px;
          border-radius: 16px;
          background: #fffaf7;
          border: 1px solid rgba(166, 76, 80, 0.13);
          color: #5b3a36;
          font-size: 0.82rem;
          line-height: 1.35;
          transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;
        }

        .liveMaioPage .checkOption span::before {
          content: "";
          position: absolute;
          left: 12px;
          top: 13px;
          width: 17px;
          height: 17px;
          border-radius: 6px;
          border: 1.5px solid rgba(166, 76, 80, 0.42);
          background: #ffffff;
        }

        .liveMaioPage .checkOption span::after {
          content: "✓";
          position: absolute;
          left: 15px;
          top: 10px;
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 950;
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.18s ease, transform 0.18s ease;
        }

        .liveMaioPage .checkOption input:checked + span {
          background: #f8e4dc;
          border-color: rgba(166, 76, 80, 0.45);
          color: #351817;
        }

        .liveMaioPage .checkOption input:checked + span::before {
          background: #a64c50;
          border-color: #a64c50;
        }

        .liveMaioPage .checkOption input:checked + span::after {
          opacity: 1;
          transform: scale(1);
        }

        .liveMaioPage .consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          background: #f8e5dc;
          color: #5b3a36;
          font-size: 0.8rem;
          line-height: 1.42;
          cursor: pointer;
        }

        .liveMaioPage .consent input {
          width: 17px;
          height: 17px;
          margin-top: 1px;
          flex: 0 0 auto;
          accent-color: #a64c50;
        }

        .liveMaioPage .submit {
          width: 100%;
          min-height: 54px;
          border: 0;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #ca6a50);
          color: #fff;
          font-family: "Montserrat", Arial, sans-serif;
          font-weight: 950;
          font-size: 0.94rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 38px rgba(143, 48, 72, 0.3);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .liveMaioPage .submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 22px 45px rgba(143, 48, 72, 0.36);
        }

        .liveMaioPage .submit span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .liveMaioPage .safeNote {
          margin: 0;
          text-align: center;
          color: #86534b;
          font-size: 0.76rem;
          line-height: 1.4;
        }

        .liveMaioPage .topicsSection {
          padding: 16px 0 42px;
        }

        .liveMaioPage .topicsHeader {
          max-width: 790px;
          margin: 0 auto 20px;
          text-align: center;
          color: #fff5ee;
        }

        .liveMaioPage .topicsHeader span {
          display: inline-block;
          margin-bottom: 10px;
          color: #ffd1bd;
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .topicsHeader h2 {
          margin: 0;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.05rem, 8vw, 4.25rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .liveMaioPage .topicsHeader p {
          margin: 14px auto 0;
          max-width: 650px;
          color: rgba(255, 245, 238, 0.82);
          font-size: 0.98rem;
          line-height: 1.58;
        }

        .liveMaioPage .topicsGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .liveMaioPage .topicsGrid article {
          padding: 20px;
          border-radius: 26px;
          background: rgba(255, 248, 243, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 22px 50px rgba(29, 7, 9, 0.18);
        }

        .liveMaioPage .topicsGrid article span {
          display: inline-grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 999px;
          background: #f4d9ce;
          color: #a64c50;
          font-weight: 950;
          font-size: 0.8rem;
          margin-bottom: 14px;
        }

        .liveMaioPage .topicsGrid h3 {
          margin: 0 0 9px;
          color: #2d1717;
          font-size: 1.05rem;
          line-height: 1.28;
        }

        .liveMaioPage .topicsGrid p {
          margin: 0;
          color: #60413b;
          font-size: 0.92rem;
          line-height: 1.55;
        }

        @media (max-width: 420px) {
          .liveMaioPage {
            padding: 10px;
          }

          .liveMaioPage .heroCard {
            padding: 14px;
            border-radius: 28px;
          }

          .liveMaioPage .heroTitle {
            font-size: 2.32rem;
          }

          .liveMaioPage .speakers {
            gap: 8px;
          }

          .liveMaioPage .speaker {
            min-height: 275px;
            border-radius: 22px;
          }

          .liveMaioPage .speakerName {
            left: 8px;
            right: 8px;
            bottom: 8px;
            padding: 10px;
            border-radius: 15px;
          }

          .liveMaioPage .speakerName strong {
            font-size: 0.98rem;
          }

          .liveMaioPage .formCard {
            padding: 15px;
            border-radius: 24px;
          }
        }

        @media (min-width: 700px) {
          .liveMaioPage {
            padding: 26px;
          }

          .liveMaioPage .heroSection {
            padding-top: 24px;
          }

          .liveMaioPage .heroCard {
            padding: 28px;
            border-radius: 42px;
          }

          .liveMaioPage .speakers {
            gap: 14px;
          }

          .liveMaioPage .speaker {
            min-height: 420px;
          }

          .liveMaioPage .speakerName {
            left: 14px;
            right: 14px;
            bottom: 14px;
            padding: 14px;
          }

          .liveMaioPage .speakerName strong {
            font-size: 1.35rem;
          }

          .liveMaioPage .miniBioGrid {
            grid-template-columns: 1fr 1fr;
          }

          .liveMaioPage .checkboxOptions {
            grid-template-columns: 1fr 1fr;
          }

          .liveMaioPage .topicsGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .liveMaioPage .topicsGrid article {
            min-height: 245px;
            padding: 24px;
          }
        }

        @media (min-width: 1020px) {
          .liveMaioPage .heroCard {
            grid-template-columns: minmax(0, 1fr) 330px 360px;
            gap: 24px;
            align-items: start;
            padding: 36px;
          }

          .liveMaioPage .heroCopy {
            padding-top: 6px;
          }

          .liveMaioPage .heroTitle {
            font-size: clamp(3.7rem, 4.8vw, 5rem);
          }

          .liveMaioPage .heroText {
            font-size: 1.04rem;
          }

          .liveMaioPage .speakers {
            gap: 12px;
          }

          .liveMaioPage .speaker {
            min-height: 405px;
          }

          .liveMaioPage .miniBioGrid {
            grid-template-columns: 1fr;
          }

          .liveMaioPage .formCard {
            position: sticky;
            top: 24px;
            padding: 22px;
          }

          .liveMaioPage .checkboxOptions {
            grid-template-columns: 1fr;
          }

          .liveMaioPage .topicsSection {
            padding-top: 32px;
          }
        }

        @media (min-width: 1180px) {
          .liveMaioPage .heroCard {
            grid-template-columns: minmax(0, 1fr) 350px 380px;
            gap: 28px;
            padding: 42px;
          }

          .liveMaioPage .speaker {
            min-height: 430px;
          }
        }
      `}</style>
    </>
  );
}

function SpeakerPhotos() {
  return (
    <div className="speakers">
      <article className="speaker">
        <img src="/erica-live.png" alt="Psicóloga Érica Vilar" />
        <div className="speakerName">
          <span>Psicóloga</span>
          <strong>Érica Vilar</strong>
        </div>
      </article>

      <article className="speaker">
        <img src="/lizia-live.png" alt="Fisioterapeuta e doula Lizia Nascimento" />
        <div className="speakerName">
          <span>Fisioterapeuta e doula</span>
          <strong>Lizia Nascimento</strong>
        </div>
      </article>
    </div>
  );
}

function FormCard() {
  return (
    <aside className="formCard">
      <div className="formHeader">
        <span>Inscrição gratuita</span>
        <h2>Receba o lembrete da live</h2>
        <p>
          Preencha seus dados e marque os temas que você mais quer ver nessa
          conversa.
        </p>
      </div>

      <form className="leadForm" action="/obrigado-live" method="GET">
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" name="nome" placeholder="Seu nome" required />
        </div>

        <div className="field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            name="whatsapp"
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>

        <div className="checkboxGroup">
          <div className="checkboxTitle">Quais temas mais te interessam?</div>

          <div className="checkboxOptions">
            {subtemas.map((tema) => (
              <label className="checkOption" key={tema}>
                <input type="checkbox" name="subtemas" value={tema} />
                <span>{tema}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="consent">
          <input type="checkbox" name="consentimento" required />
          <span>
            Aceito receber comunicações sobre esta live e conteúdos relacionados
            por WhatsApp e e-mail.
          </span>
        </label>

        <button className="submit" type="submit">
          Quero participar da live
          <span>↗</span>
        </button>

        <p className="safeNote">
          Seus dados serão usados apenas para comunicação sobre a live.
        </p>
      </form>
    </aside>
  );
}