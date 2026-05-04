import Head from "next/head";

export default function LiveMaio() {
  return (
    <>
      <Head>
        <title>Live Maio | Gestação sem filtro</title>
        <meta
          name="description"
          content="Live gratuita no Instagram com Érica Vilar e Lizia Nascimento sobre gestação, corpo, emoções e tudo que quase ninguém conta."
        />
      </Head>

      <main className="livePage">
        <div className="backgroundText">LIVE MAIO</div>
        <div className="glow glowOne" />
        <div className="glow glowTwo" />

        <section className="heroMockup">
          <div className="tablet">
            <div className="tabletScreen">
              <div className="topBadges">
                <span>
                  <strong>Live no Instagram</strong>
                  Sábado, 24 de maio às 17h
                </span>

                <span>
                  <strong>Duração</strong>
                  60 minutos
                </span>
              </div>

              <div className="heroContent">
                <div className="heroText">
                  <p className="eyebrow">Live gratuita</p>

                  <h1>
                    Gestação sem filtro:
                    <em> tudo que você precisa saber e nunca te contaram.</em>
                  </h1>

                  <p className="description">
                    Um encontro leve, real e acolhedor sobre corpo, emoções,
                    dores, medos, expectativas e os bastidores da gestação que
                    quase ninguém fala com profundidade.
                  </p>

                  <form className="leadForm" action="/obrigado-live" method="GET">
                    <div className="formGrid">
                      <input type="text" name="nome" placeholder="Seu nome" />
                      <input
                        type="tel"
                        name="whatsapp"
                        placeholder="Seu WhatsApp"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Seu e-mail"
                      />
                    </div>

                    <button type="submit">
                      Quero participar da live
                      <span>↗</span>
                    </button>

                    <div className="scarcity">
                      <span className="dot" />
                      Inscrição gratuita para receber o lembrete da live
                    </div>
                  </form>
                </div>

                <div className="speakersArea">
                  <div className="speaker speakerErica">
                    <div className="imageWrap">
                      <img
                        src="/erica-live.png"
                        alt="Psicóloga Érica Vilar"
                      />
                    </div>

                    <div className="speakerInfo">
                      <span>Psicóloga</span>
                      <strong>Érica Vilar</strong>
                      <p>
                        Psicóloga clínica, fala sobre saúde emocional feminina,
                        maternidade, vínculos e autocuidado com sensibilidade e
                        profundidade.
                      </p>
                    </div>
                  </div>

                  <div className="speaker speakerLizia">
                    <div className="imageWrap">
                      <img
                        src="/lizia-live.png"
                        alt="Fisioterapeuta e doula Lizia Nascimento"
                      />
                    </div>

                    <div className="speakerInfo">
                      <span>Fisioterapeuta e Doula</span>
                      <strong>Lizia Nascimento</strong>
                      <p>
                        Lizia Nascimento atua no cuidado 
                        integral da mulher da gestação ao pós-parto, 
                        unindo técnica, acolhimento e escuta para promover mais conforto, 
                        segurança e bem-estar em cada fase dessa jornada.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="knownAs">
                <p>Uma conversa para mulheres que querem viver a gestação com</p>

                <div>
                  <span>Mais informação</span>
                  <span>Menos culpa</span>
                  <span>Mais acolhimento</span>
                  <span>Mais segurança</span>
                </div>
              </div>

              <section className="learnSection">
                <h2>
                  O que você vai encontrar <em>nessa live</em>
                </h2>

                <div className="cards">
                  <article>
                    <span>01</span>
                    <h3>O que ninguém fala sobre gestar</h3>
                    <p>
                      As mudanças físicas, emocionais e silenciosas que muitas
                      mulheres só descobrem vivendo.
                    </p>
                  </article>

                  <article>
                    <span>02</span>
                    <h3>Corpo, dor e preparação</h3>
                    <p>
                      Cuidados importantes para atravessar a gestação e o
                      pós-parto com mais consciência.
                    </p>
                  </article>

                  <article>
                    <span>03</span>
                    <h3>Medos, culpa e autocobrança</h3>
                    <p>
                      Uma conversa real sobre expectativas, maternidade e saúde
                      emocional feminina.
                    </p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .livePage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 72px 24px 90px;
          background:
            radial-gradient(circle at 50% 95%, rgba(248, 199, 166, 0.55), transparent 34%),
            radial-gradient(circle at 9% 52%, rgba(174, 74, 52, 0.48), transparent 28%),
            radial-gradient(circle at 92% 48%, rgba(128, 45, 55, 0.5), transparent 28%),
            linear-gradient(180deg, #2a1114 0%, #4b1f1f 48%, #7b3f31 100%);
          color: #2b1714;
          font-family: "Montserrat", Arial, sans-serif;
        }

        .backgroundText {
          position: absolute;
          top: -72px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          white-space: nowrap;
          font-size: clamp(6rem, 18vw, 19rem);
          font-weight: 900;
          letter-spacing: -0.08em;
          line-height: 0.9;
          color: rgba(236, 162, 123, 0.35);
          text-shadow: 0 28px 55px rgba(0, 0, 0, 0.5);
          pointer-events: none;
        }

        .glow {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 999px;
          filter: blur(64px);
          opacity: 0.5;
          pointer-events: none;
        }

        .glowOne {
          left: -120px;
          bottom: 120px;
          background: #f1a577;
        }

        .glowTwo {
          right: -110px;
          bottom: 150px;
          background: #9e3f4d;
        }

        .heroMockup {
          width: min(1180px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .tablet {
          position: relative;
          z-index: 3;
          border-radius: 38px;
          padding: 15px;
          background: linear-gradient(180deg, #1f1514, #070303);
          box-shadow:
            0 50px 130px rgba(0, 0, 0, 0.62),
            inset 0 0 0 2px rgba(255, 255, 255, 0.16);
        }

        .tablet::before {
          content: "";
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 220px;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.45);
        }

        .tabletScreen {
          min-height: 720px;
          overflow: hidden;
          border-radius: 28px;
          padding: 42px 56px 46px;
          background:
            linear-gradient(180deg, rgba(255, 248, 241, 0) 58%, #fff5ed 80%),
            #fffaf5;
          position: relative;
        }

        .topBadges {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 44px;
        }

        .topBadges span {
          display: inline-flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 18px;
          border-radius: 999px;
          background: #f7ebe2;
          color: #8a5141;
          font-size: 0.72rem;
          box-shadow: inset 0 0 0 1px rgba(128, 45, 55, 0.06);
        }

        .topBadges strong {
          color: #9e3f4d;
          font-size: 0.75rem;
        }

        .heroContent {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 44px;
          align-items: center;
        }

        .eyebrow {
          color: #a44648;
          font-weight: 800;
          font-size: 0.86rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 14px;
        }

        h1 {
          max-width: 610px;
          margin: 0;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.5rem, 4.05vw, 4.55rem);
          line-height: 0.94;
          letter-spacing: -0.055em;
          color: #24110f;
        }

        h1 em,
        h2 em {
          color: #a44648;
          font-style: italic;
          font-weight: 400;
        }

        .description {
          max-width: 610px;
          margin: 24px 0 28px;
          color: #46302b;
          font-size: 1rem;
          line-height: 1.7;
          font-weight: 500;
        }

        .leadForm {
          max-width: 470px;
        }

        .formGrid {
          display: grid;
          gap: 10px;
          margin-bottom: 12px;
        }

        .formGrid input {
          width: 100%;
          border: 1px solid rgba(158, 63, 77, 0.14);
          background: #fff4ed;
          border-radius: 14px;
          padding: 15px 16px;
          outline: none;
          color: #2b1714;
          font: inherit;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .formGrid input:focus {
          border-color: rgba(164, 70, 72, 0.55);
          box-shadow: 0 0 0 4px rgba(164, 70, 72, 0.12);
        }

        button {
          width: 100%;
          border: 0;
          border-radius: 14px;
          padding: 17px 18px;
          background: linear-gradient(135deg, #8f3744, #bc6045);
          color: #fff;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
          box-shadow: 0 18px 35px rgba(143, 55, 68, 0.28);
        }

        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 22px 42px rgba(143, 55, 68, 0.34);
        }

        button span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
        }

        .scarcity {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #fff;
          color: #66433c;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #a44648;
          box-shadow: 0 0 0 5px rgba(164, 70, 72, 0.12);
        }

        .speakersArea {
          position: relative;
          min-height: 520px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          align-items: end;
        }

        .speakersArea::after {
          content: "";
          position: absolute;
          left: -10px;
          right: -10px;
          bottom: -14px;
          height: 32%;
          background: linear-gradient(180deg, transparent, #fffaf5 74%);
          pointer-events: none;
          z-index: 5;
        }

        .speaker {
          position: relative;
          min-height: 500px;
          border-radius: 28px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 20%, rgba(255, 222, 203, 0.9), transparent 42%),
            linear-gradient(180deg, #f7ded0, #efd0c2);
          box-shadow: 0 24px 55px rgba(81, 39, 35, 0.12);
          border: 1px solid rgba(128, 45, 55, 0.08);
        }

        .speakerLizia {
          background:
            radial-gradient(circle at 50% 20%, rgba(255, 226, 210, 0.9), transparent 42%),
            linear-gradient(180deg, #f6e1d6, #eac5b8);
          transform: translateY(34px);
        }

        .imageWrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1;
        }

        .imageWrap img {
          width: 100%;
          height: 92%;
          object-fit: cover;
          object-position: center bottom;
          filter: drop-shadow(0 24px 34px rgba(0, 0, 0, 0.16));
        }

        .speakerInfo {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          z-index: 7;
          border-radius: 20px;
          padding: 17px;
          background: rgba(255, 250, 245, 0.82);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow: 0 20px 40px rgba(67, 27, 28, 0.12);
        }

        .speakerInfo span {
          display: block;
          color: #a44648;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 5px;
        }

        .speakerInfo strong {
          display: block;
          color: #24110f;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.6rem;
          letter-spacing: -0.04em;
          margin-bottom: 7px;
        }

        .speakerInfo p {
          margin: 0;
          color: #51362f;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .knownAs {
          margin: 70px 0 42px;
          text-align: center;
        }

        .knownAs p {
          margin: 0 0 16px;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.55rem;
          color: #8d4a3c;
        }

        .knownAs div {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          max-width: 860px;
          margin: 0 auto;
          color: #70534a;
          font-size: 0.92rem;
        }

        .knownAs span {
          padding: 0 18px;
          border-right: 1px solid rgba(80, 42, 36, 0.13);
        }

        .knownAs span:last-child {
          border-right: 0;
        }

        .learnSection {
          text-align: center;
        }

        h2 {
          margin: 0 0 30px;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 3vw, 3.1rem);
          line-height: 1;
          letter-spacing: -0.04em;
          color: #24110f;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .cards article {
          text-align: left;
          min-height: 178px;
          border-radius: 20px;
          padding: 24px;
          background: #f8e9df;
          border: 1px solid rgba(128, 45, 55, 0.07);
        }

        .cards article span {
          color: #a44648;
          font-weight: 900;
          font-size: 0.82rem;
        }

        .cards h3 {
          margin: 12px 0 10px;
          color: #2b1714;
          font-size: 1.05rem;
          line-height: 1.25;
        }

        .cards p {
          margin: 0;
          color: #60463f;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        @media (max-width: 980px) {
          .livePage {
            padding: 42px 14px 64px;
          }

          .backgroundText {
            top: -28px;
            font-size: clamp(5rem, 24vw, 10rem);
          }

          .tablet {
            border-radius: 30px;
            padding: 10px;
          }

          .tabletScreen {
            min-height: auto;
            border-radius: 22px;
            padding: 28px 20px 34px;
          }

          .heroContent {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .topBadges {
            margin-bottom: 28px;
          }

          h1 {
            font-size: clamp(2.45rem, 12vw, 4.1rem);
          }

          .description {
            font-size: 0.95rem;
          }

          .speakersArea {
            min-height: auto;
            grid-template-columns: 1fr 1fr;
          }

          .speaker {
            min-height: 460px;
          }

          .speakerLizia {
            transform: translateY(22px);
          }

          .knownAs {
            margin-top: 62px;
          }

          .knownAs div {
            grid-template-columns: repeat(2, 1fr);
            row-gap: 14px;
          }

          .knownAs span:nth-child(2) {
            border-right: 0;
          }

          .cards {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .topBadges {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .speakersArea {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .speaker {
            min-height: 430px;
          }

          .speakerLizia {
            transform: none;
          }

          .knownAs {
            margin: 36px 0 32px;
          }

          .knownAs div {
            grid-template-columns: 1fr;
          }

          .knownAs span {
            border-right: 0;
            border-bottom: 1px solid rgba(80, 42, 36, 0.13);
            padding: 10px 0;
          }

          .knownAs span:last-child {
            border-bottom: 0;
          }
        }
      `}</style>
    </>
  );
}