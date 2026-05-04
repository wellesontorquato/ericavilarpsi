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
        <div className="bgWord">GESTAÇÃO</div>
        <div className="blur blurOne" />
        <div className="blur blurTwo" />

        <section className="mockupWrap">
          <img
            src="/hand-right.png"
            alt=""
            aria-hidden="true"
            className="hand handLeft"
          />

          <img
            src="/hand-right.png"
            alt=""
            aria-hidden="true"
            className="hand handRight"
          />

          <div className="tablet">
            <div className="tabletScreen">
              <section className="hero">
                <div className="heroLeft">
                  <div className="topBadges">
                    <span>Live gratuita no Instagram</span>
                    <span>24 de maio às 17h</span>
                    <span>60 minutos</span>
                  </div>

                  <p className="eyebrow">
                    Para gestantes, tentantes e mães recentes
                  </p>

                  <h1>
                    Gestação sem filtro:
                    <em> tudo que você precisa saber e nunca te contaram.</em>
                  </h1>

                  <p className="description">
                    Uma conversa real, acolhedora e sem romantização sobre
                    corpo, emoções, medos, dores, culpa, preparação e
                    pós-parto.
                  </p>

                  <div className="highlightBox">
                    <strong>
                      Você vai sair dessa live com mais clareza, segurança e
                      acolhimento.
                    </strong>
                    <span>
                      Sem terrorismo. Sem julgamento. Sem frases prontas.
                    </span>
                  </div>

                  <form className="leadForm" action="/obrigado-live" method="GET">
                    <input
                      type="text"
                      name="nome"
                      placeholder="Seu nome"
                      required
                    />
                    <input
                      type="tel"
                      name="whatsapp"
                      placeholder="Seu WhatsApp"
                      required
                    />

                    <button type="submit">
                      Quero receber o lembrete
                      <span>↗</span>
                    </button>

                    <p className="formNote">
                      Inscrição gratuita para receber o aviso da live no dia.
                    </p>
                  </form>
                </div>

                <div className="heroRight">
                  <div className="speakersGrid">
                    <article className="speakerCard">
                      <div className="speakerImageWrap">
                        <img
                          src="/erica-live.png"
                          alt="Psicóloga Érica Vilar"
                          className="speakerImage"
                        />
                      </div>

                      <div className="speakerInfo">
                        <span>Psicóloga</span>
                        <strong>Érica Vilar</strong>
                        <p>
                          Psicóloga clínica, fala sobre saúde emocional
                          feminina, maternidade, vínculos e autocuidado com
                          sensibilidade e profundidade.
                        </p>
                      </div>
                    </article>

                    <article className="speakerCard">
                      <div className="speakerImageWrap">
                        <img
                          src="/lizia-live.png"
                          alt="Fisioterapeuta e doula Lizia Nascimento"
                          className="speakerImage"
                        />
                      </div>

                      <div className="speakerInfo">
                        <span>Fisioterapeuta e doula</span>
                        <strong>Lizia Nascimento</strong>
                        <p>
                          Atua no cuidado integral da mulher da gestação ao
                          pós-parto, unindo técnica, acolhimento e escuta.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </section>

              <section className="contentSection">
                <div className="midText">
                  <p>Uma conversa para mulheres que desejam viver a gestação com</p>
                  <div className="midTags">
                    <span>Mais informação</span>
                    <span>Menos culpa</span>
                    <span>Mais acolhimento</span>
                    <span>Mais segurança</span>
                  </div>
                </div>

                <div className="sectionTitle">
                  <p>O que você vai encontrar nessa live</p>
                  <h2>Uma conversa sobre o que quase ninguém fala</h2>
                </div>

                <div className="cards">
                  <article>
                    <span>01</span>
                    <h3>As mudanças reais da gestação</h3>
                    <p>
                      Corpo, emoções, dores, desconfortos e expectativas que
                      muitas mulheres descobrem só vivendo.
                    </p>
                  </article>

                  <article>
                    <span>02</span>
                    <h3>Medos, culpa e autocobrança</h3>
                    <p>
                      Como atravessar essa fase com mais acolhimento e menos
                      comparação.
                    </p>
                  </article>

                  <article>
                    <span>03</span>
                    <h3>Preparação e pós-parto</h3>
                    <p>
                      Cuidados físicos e emocionais para viver essa jornada com
                      mais presença e segurança.
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
          padding: 20px 12px 48px;
          background:
            radial-gradient(circle at 50% 100%, rgba(255, 190, 151, 0.55), transparent 28%),
            radial-gradient(circle at 10% 28%, rgba(165, 52, 74, 0.55), transparent 30%),
            radial-gradient(circle at 95% 32%, rgba(232, 139, 98, 0.42), transparent 28%),
            linear-gradient(180deg, #351218 0%, #6d2e2b 50%, #ba6f56 100%);
          color: #2c1817;
          font-family: "Montserrat", Arial, sans-serif;
        }

        .bgWord {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          white-space: nowrap;
          pointer-events: none;
          font-size: clamp(4rem, 18vw, 15rem);
          line-height: 0.85;
          font-weight: 900;
          letter-spacing: -0.08em;
          color: rgba(255, 220, 196, 0.14);
          text-shadow: 0 24px 56px rgba(0, 0, 0, 0.28);
        }

        .blur {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.45;
          pointer-events: none;
        }

        .blurOne {
          width: 240px;
          height: 240px;
          left: -80px;
          bottom: 60px;
          background: #ffb78a;
        }

        .blurTwo {
          width: 280px;
          height: 280px;
          right: -100px;
          top: 160px;
          background: #8f2f4a;
        }

        .mockupWrap {
          width: min(1180px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .tablet {
          position: relative;
          z-index: 3;
          border-radius: 30px;
          padding: 9px;
          background: linear-gradient(180deg, #1e1212, #070303);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.42),
            inset 0 0 0 1px rgba(255, 255, 255, 0.14);
        }

        .tablet::before {
          content: "";
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
        }

        .tabletScreen {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          background:
            linear-gradient(180deg, rgba(255, 251, 248, 0) 62%, #fff4ed 88%),
            #fffaf6;
          padding: 18px 14px 24px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .topBadges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .topBadges span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7e8df;
          color: #924346;
          font-size: 0.72rem;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(146, 67, 70, 0.08);
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #a84a4c;
          font-size: 0.74rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          max-width: 640px;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.3rem, 11vw, 4.8rem);
          line-height: 0.92;
          letter-spacing: -0.06em;
          color: #271313;
        }

        h1 em {
          color: #b25757;
          font-style: italic;
          font-weight: 400;
        }

        .description {
          margin: 16px 0 14px;
          max-width: 580px;
          color: #543835;
          font-size: 0.98rem;
          line-height: 1.6;
          font-weight: 550;
        }

        .highlightBox {
          max-width: 560px;
          margin-bottom: 16px;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, #fff0e8, #f8ded1);
          border: 1px solid rgba(168, 74, 76, 0.12);
          box-shadow: 0 14px 32px rgba(96, 40, 34, 0.08);
        }

        .highlightBox strong {
          display: block;
          color: #341817;
          font-size: 0.94rem;
          line-height: 1.35;
        }

        .highlightBox span {
          display: block;
          margin-top: 6px;
          color: #8a4a43;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .leadForm {
          display: grid;
          gap: 10px;
          max-width: 520px;
        }

        .leadForm input {
          width: 100%;
          padding: 15px 14px;
          border-radius: 14px;
          border: 1px solid rgba(168, 74, 76, 0.16);
          background: #fff5ef;
          color: #2c1817;
          outline: none;
          font: inherit;
        }

        .leadForm input:focus {
          border-color: rgba(168, 74, 76, 0.5);
          box-shadow: 0 0 0 4px rgba(168, 74, 76, 0.12);
        }

        .leadForm button {
          width: 100%;
          border: 0;
          border-radius: 15px;
          padding: 16px 16px;
          background: linear-gradient(135deg, #8b2f46, #c8674d);
          color: #fff;
          font-weight: 900;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 35px rgba(139, 47, 70, 0.28);
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .leadForm button:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }

        .leadForm button span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .formNote {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.4;
          color: #8a4a43;
          text-align: center;
        }

        .heroRight {
          position: relative;
        }

        .speakersGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          align-items: stretch;
        }

        .speakerCard {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 390px;
          border-radius: 24px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 230, 216, 0.95), transparent 40%),
            linear-gradient(180deg, #f5d9cd, #e8b8a9);
          border: 1px solid rgba(146, 67, 70, 0.08);
          box-shadow: 0 20px 46px rgba(86, 35, 30, 0.12);
        }

        .speakerImageWrap {
          position: relative;
          height: 260px;
          background: transparent;
          overflow: hidden;
        }

        .speakerImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .speakerInfo {
          padding: 14px 14px 16px;
          background: rgba(255, 250, 245, 0.78);
          backdrop-filter: blur(10px);
          flex: 1;
        }

        .speakerInfo span {
          display: block;
          color: #a84a4c;
          font-size: 0.67rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .speakerInfo strong {
          display: block;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.25rem;
          line-height: 1;
          letter-spacing: -0.04em;
          color: #271313;
          margin-bottom: 8px;
        }

        .speakerInfo p {
          margin: 0;
          color: #573834;
          font-size: 0.82rem;
          line-height: 1.45;
        }

        .contentSection {
          margin-top: 28px;
        }

        .midText {
          text-align: center;
          margin-bottom: 26px;
        }

        .midText p {
          margin: 0 0 14px;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.35rem;
          color: #8e4a3f;
        }

        .midTags {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .midTags span {
          padding: 12px 10px;
          border-radius: 16px;
          background: #fff0e6;
          border: 1px solid rgba(146, 67, 70, 0.08);
          color: #6f4a43;
          font-size: 0.86rem;
          font-weight: 700;
        }

        .sectionTitle {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 18px;
        }

        .sectionTitle p {
          margin: 0 0 8px;
          color: #a84a4c;
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sectionTitle h2 {
          margin: 0;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(1.9rem, 8vw, 3.1rem);
          line-height: 0.96;
          letter-spacing: -0.05em;
          color: #271313;
        }

        .cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .cards article {
          padding: 18px;
          border-radius: 18px;
          background: #f8e4d8;
          border: 1px solid rgba(146, 67, 70, 0.08);
          box-shadow: 0 12px 28px rgba(90, 35, 31, 0.05);
        }

        .cards article span {
          display: inline-block;
          color: #a84a4c;
          font-size: 0.78rem;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .cards h3 {
          margin: 0 0 8px;
          color: #2c1817;
          font-size: 1rem;
          line-height: 1.25;
        }

        .cards p {
          margin: 0;
          color: #62433d;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .hand {
          position: absolute;
          z-index: 5;
          pointer-events: none;
          user-select: none;
          opacity: 0.98;
          filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.35));
        }

        .handLeft {
          left: -18px;
          bottom: 30px;
          width: 96px;
          transform: scaleX(-1) rotate(-4deg);
          transform-origin: center;
        }

        .handRight {
          right: -18px;
          bottom: 30px;
          width: 96px;
          transform: rotate(-4deg);
          transform-origin: center;
        }

        @media (max-width: 640px) {
          .speakerCard {
            min-height: 350px;
          }

          .speakerImageWrap {
            height: 220px;
          }

          .speakerInfo p {
            font-size: 0.78rem;
          }

          .handLeft {
            left: -22px;
            bottom: 74px;
            width: 88px;
          }

          .handRight {
            right: -22px;
            bottom: 74px;
            width: 88px;
          }
        }

        @media (max-width: 420px) {
          .tabletScreen {
            padding: 16px 12px 22px;
          }

          h1 {
            font-size: 2.12rem;
          }

          .speakersGrid {
            gap: 10px;
          }

          .speakerCard {
            min-height: 320px;
            border-radius: 20px;
          }

          .speakerImageWrap {
            height: 190px;
          }

          .speakerInfo {
            padding: 12px;
          }

          .speakerInfo strong {
            font-size: 1.08rem;
          }

          .speakerInfo p {
            font-size: 0.75rem;
            line-height: 1.4;
          }

          .handLeft {
            left: -20px;
            bottom: 88px;
            width: 76px;
          }

          .handRight {
            right: -20px;
            bottom: 88px;
            width: 76px;
          }
        }

        @media (min-width: 760px) {
          .livePage {
            padding: 54px 22px 80px;
          }

          .tablet {
            border-radius: 40px;
            padding: 14px;
          }

          .tablet::before {
            top: 8px;
            width: 200px;
            height: 4px;
          }

          .tabletScreen {
            border-radius: 30px;
            padding: 40px 42px 46px;
          }

          .hero {
            grid-template-columns: 0.95fr 1.05fr;
            gap: 36px;
            align-items: center;
          }

          .leadForm {
            grid-template-columns: 1fr 1fr;
          }

          .leadForm button,
          .formNote {
            grid-column: 1 / -1;
          }

          .speakersGrid {
            gap: 16px;
          }

          .speakerCard {
            min-height: 510px;
            border-radius: 28px;
          }

          .speakerImageWrap {
            height: 340px;
          }

          .speakerInfo {
            padding: 18px;
          }

          .speakerInfo strong {
            font-size: 1.45rem;
          }

          .speakerInfo p {
            font-size: 0.86rem;
          }

          .midTags {
            grid-template-columns: repeat(4, 1fr);
          }

          .cards {
            grid-template-columns: repeat(3, 1fr);
          }

          .cards article {
            min-height: 190px;
            padding: 22px;
          }

          .handLeft {
            left: -70px;
            bottom: 36px;
            width: 150px;
          }

          .handRight {
            right: -70px;
            bottom: 36px;
            width: 150px;
          }
        }

        @media (min-width: 1040px) {
          .tabletScreen {
            padding: 44px 54px 52px;
          }

          .hero {
            grid-template-columns: 0.9fr 1.1fr;
            gap: 52px;
          }

          .speakerCard {
            min-height: 560px;
          }

          .speakerImageWrap {
            height: 375px;
          }

          .handLeft {
            left: -92px;
            bottom: 44px;
            width: 185px;
          }

          .handRight {
            right: -92px;
            bottom: 44px;
            width: 185px;
          }
        }
      `}</style>
    </>
  );
}