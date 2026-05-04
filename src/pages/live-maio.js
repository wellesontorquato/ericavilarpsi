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
        <div className="backgroundText">GESTAÇÃO</div>
        <div className="orb orbOne" />
        <div className="orb orbTwo" />
        <div className="orb orbThree" />

        <section className="mockupArea">
          <div className="handsLayer" aria-hidden="true">
            <div className="hand handLeft">
              <span className="thumb" />
              <span className="finger fingerOne" />
              <span className="finger fingerTwo" />
            </div>

            <div className="hand handRight">
              <span className="thumb" />
              <span className="finger fingerOne" />
              <span className="finger fingerTwo" />
            </div>
          </div>

          <div className="tablet">
            <div className="tabletScreen">
              <section className="hero">
                <div className="heroCopy">
                  <div className="badges">
                    <span>Live gratuita no Instagram</span>
                    <span>24 de maio • 17h</span>
                    <span>60 minutos</span>
                  </div>

                  <p className="eyebrow">Para gestantes, tentantes e mães recentes</p>

                  <h1>
                    Gestação sem filtro:
                    <em> tudo que você precisa saber e nunca te contaram.</em>
                  </h1>

                  <p className="description">
                    Uma conversa real, acolhedora e sem romantização sobre corpo,
                    emoções, medos, dores, culpa, preparação e pós-parto.
                  </p>

                  <div className="promiseBox">
                    <strong>Você vai sair dessa live com mais clareza, segurança e acolhimento.</strong>
                    <span>Sem terrorismo. Sem julgamento. Sem frases prontas.</span>
                  </div>

                  <form className="leadForm" action="/obrigado-live" method="GET">
                    <input type="text" name="nome" placeholder="Seu nome" required />
                    <input type="tel" name="whatsapp" placeholder="Seu WhatsApp" required />

                    <button type="submit">
                      Quero receber o lembrete
                      <span>↗</span>
                    </button>

                    <p className="microCopy">
                      Inscrição gratuita para receber o aviso da live no dia.
                    </p>
                  </form>
                </div>

                <div className="speakersWrap">
                  <div className="speakerPhoto speakerPhotoErica">
                    <img src="/erica-live.png" alt="Psicóloga Érica Vilar" />
                    <div className="speakerTag">
                      <span>Psicóloga</span>
                      <strong>Érica Vilar</strong>
                    </div>
                  </div>

                  <div className="speakerPhoto speakerPhotoLizia">
                    <img src="/lizia-live.png" alt="Fisioterapeuta e doula Lizia Nascimento" />
                    <div className="speakerTag">
                      <span>Fisioterapeuta e doula</span>
                      <strong>Lizia Nascimento</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="authority">
                <article>
                  <span>Érica Vilar</span>
                  <p>
                    Psicóloga clínica, fala sobre saúde emocional feminina,
                    maternidade, vínculos e autocuidado com sensibilidade e
                    profundidade.
                  </p>
                </article>

                <article>
                  <span>Lizia Nascimento</span>
                  <p>
                    Fisioterapeuta e doula, atua no cuidado integral da mulher
                    da gestação ao pós-parto, unindo técnica, acolhimento e
                    escuta.
                  </p>
                </article>
              </section>

              <section className="learn">
                <div className="sectionTitle">
                  <p>O que será conversado</p>
                  <h2>Uma live para falar o que quase ninguém fala</h2>
                </div>

                <div className="cards">
                  <article>
                    <span>01</span>
                    <h3>As mudanças reais da gestação</h3>
                    <p>
                      Corpo, emoções, dores, desconfortos e expectativas que nem
                      sempre aparecem nas conversas comuns.
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
          padding: 22px 12px 52px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 50% 100%, rgba(255, 190, 151, 0.58), transparent 28%),
            radial-gradient(circle at 8% 38%, rgba(189, 78, 90, 0.5), transparent 30%),
            radial-gradient(circle at 95% 35%, rgba(236, 145, 106, 0.42), transparent 28%),
            linear-gradient(180deg, #38141b 0%, #6f2f2b 48%, #c07154 100%);
        }

        .backgroundText {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          white-space: nowrap;
          font-size: clamp(4.6rem, 22vw, 18rem);
          font-weight: 950;
          letter-spacing: -0.09em;
          line-height: 0.8;
          color: rgba(255, 206, 174, 0.18);
          text-shadow: 0 30px 70px rgba(0, 0, 0, 0.38);
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(62px);
          opacity: 0.5;
          pointer-events: none;
        }

        .orbOne {
          width: 260px;
          height: 260px;
          background: #ffb58c;
          left: -90px;
          bottom: 80px;
        }

        .orbTwo {
          width: 300px;
          height: 300px;
          background: #8d3147;
          right: -120px;
          top: 180px;
        }

        .orbThree {
          width: 220px;
          height: 220px;
          background: #ffd2bd;
          left: 45%;
          bottom: -80px;
        }

        .mockupArea {
          width: min(1180px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .tablet {
          position: relative;
          z-index: 4;
          border-radius: 34px;
          padding: 10px;
          background: linear-gradient(180deg, #1c1112, #060303);
          box-shadow:
            0 38px 90px rgba(20, 5, 6, 0.56),
            inset 0 0 0 1px rgba(255, 255, 255, 0.16);
        }

        .tablet::before {
          content: "";
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 3px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.38);
          z-index: 8;
        }

        .tabletScreen {
          position: relative;
          overflow: hidden;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255, 251, 247, 0) 62%, #fff4ed 88%),
            #fffaf6;
          padding: 20px 16px 24px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .badges span {
          border-radius: 999px;
          background: #f7e5db;
          color: #8d3d40;
          padding: 9px 12px;
          font-size: 0.72rem;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(142, 53, 66, 0.08);
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #a94b4b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          font-weight: 900;
        }

        h1 {
          margin: 0;
          max-width: 660px;
          color: #251211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.65rem, 12vw, 5rem);
          line-height: 0.9;
          letter-spacing: -0.06em;
        }

        h1 em {
          color: #a94b4b;
          font-style: italic;
          font-weight: 400;
        }

        .description {
          margin: 18px 0 16px;
          max-width: 620px;
          color: #543734;
          font-size: 0.98rem;
          line-height: 1.62;
          font-weight: 550;
        }

        .promiseBox {
          max-width: 570px;
          margin: 0 0 16px;
          padding: 14px;
          border-radius: 18px;
          background: linear-gradient(135deg, #fff1e8, #f8ddd0);
          border: 1px solid rgba(169, 75, 75, 0.12);
          box-shadow: 0 16px 34px rgba(86, 34, 32, 0.08);
        }

        .promiseBox strong {
          display: block;
          color: #341817;
          font-size: 0.95rem;
          line-height: 1.35;
        }

        .promiseBox span {
          display: block;
          margin-top: 6px;
          color: #8a4b42;
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
          border: 1px solid rgba(169, 75, 75, 0.16);
          border-radius: 15px;
          background: #fff6f0;
          padding: 15px 15px;
          color: #2d1717;
          font: inherit;
          outline: none;
        }

        .leadForm input:focus {
          border-color: rgba(169, 75, 75, 0.55);
          box-shadow: 0 0 0 4px rgba(169, 75, 75, 0.12);
        }

        .leadForm button {
          width: 100%;
          border: 0;
          border-radius: 16px;
          padding: 16px 16px;
          background: linear-gradient(135deg, #8c2f46, #c7654b);
          color: #fff;
          font-weight: 950;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 36px rgba(140, 47, 70, 0.32);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .leadForm button:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 24px 44px rgba(140, 47, 70, 0.38);
        }

        .leadForm button span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .microCopy {
          margin: 0;
          color: #8a4b42;
          font-size: 0.78rem;
          line-height: 1.4;
          text-align: center;
        }

        .speakersWrap {
          position: relative;
          min-height: 410px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          align-items: end;
          padding-top: 4px;
        }

        .speakersWrap::after {
          content: "";
          position: absolute;
          left: -16px;
          right: -16px;
          bottom: -8px;
          height: 34%;
          z-index: 6;
          background: linear-gradient(180deg, transparent, #fffaf6 78%);
          pointer-events: none;
        }

        .speakerPhoto {
          position: relative;
          min-height: 390px;
          border-radius: 28px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 15%, rgba(255, 226, 211, 0.95), transparent 42%),
            linear-gradient(180deg, #f4d5c6, #e9b9a7);
          border: 1px solid rgba(142, 53, 66, 0.08);
          box-shadow: 0 24px 48px rgba(85, 32, 29, 0.14);
        }

        .speakerPhotoLizia {
          transform: translateY(24px);
          background:
            radial-gradient(circle at 50% 15%, rgba(255, 236, 225, 0.95), transparent 42%),
            linear-gradient(180deg, #f8ded1, #e8b5a4);
        }

        .speakerPhoto img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 92%;
          object-fit: cover;
          object-position: center bottom;
          filter: drop-shadow(0 20px 32px rgba(0, 0, 0, 0.16));
        }

        .speakerTag {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 8;
          padding: 13px;
          border-radius: 18px;
          background: rgba(255, 250, 246, 0.84);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 36px rgba(69, 25, 22, 0.12);
        }

        .speakerTag span {
          display: block;
          color: #a94b4b;
          font-size: 0.62rem;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 3px;
        }

        .speakerTag strong {
          display: block;
          color: #251211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.23rem;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .authority {
          position: relative;
          z-index: 9;
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin: 34px 0 28px;
        }

        .authority article {
          border-radius: 20px;
          padding: 17px;
          background: #fff1e8;
          border: 1px solid rgba(142, 53, 66, 0.08);
        }

        .authority span {
          display: block;
          color: #a94b4b;
          font-weight: 950;
          margin-bottom: 7px;
        }

        .authority p {
          margin: 0;
          color: #543734;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .learn {
          position: relative;
          z-index: 9;
        }

        .sectionTitle {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 22px;
        }

        .sectionTitle p {
          margin: 0 0 8px;
          color: #a94b4b;
          font-size: 0.78rem;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sectionTitle h2 {
          margin: 0;
          color: #251211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 9vw, 3.3rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .cards article {
          border-radius: 20px;
          padding: 20px;
          background: #f8e3d7;
          border: 1px solid rgba(142, 53, 66, 0.08);
          box-shadow: 0 14px 30px rgba(86, 34, 32, 0.06);
        }

        .cards article span {
          color: #a94b4b;
          font-size: 0.78rem;
          font-weight: 950;
        }

        .cards h3 {
          margin: 10px 0 8px;
          color: #2d1717;
          font-size: 1.02rem;
          line-height: 1.25;
        }

        .cards p {
          margin: 0;
          color: #60433d;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .handsLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 7;
        }

        .hand {
          position: absolute;
          top: 46%;
          width: 72px;
          height: 235px;
          background:
            radial-gradient(circle at 42% 18%, rgba(255, 255, 255, 0.08), transparent 10%),
            linear-gradient(90deg, #030202, #181111 48%, #050303);
          box-shadow:
            inset 16px 0 34px rgba(255, 255, 255, 0.035),
            0 28px 55px rgba(0, 0, 0, 0.44);
          filter: blur(0.1px);
        }

        .handLeft {
          left: -26px;
          border-radius: 46px 34px 32px 48px;
          transform: translateY(-50%) rotate(-9deg);
        }

        .handRight {
          right: -26px;
          border-radius: 34px 46px 48px 32px;
          transform: translateY(-50%) rotate(9deg);
        }

        .thumb {
          position: absolute;
          top: 34px;
          width: 48px;
          height: 112px;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.07), transparent 12%),
            linear-gradient(90deg, #050303, #171010 52%, #040303);
          box-shadow: 0 18px 34px rgba(0, 0, 0, 0.38);
        }

        .handLeft .thumb {
          right: -30px;
          transform: rotate(-18deg);
        }

        .handRight .thumb {
          left: -30px;
          transform: rotate(18deg);
        }

        .finger {
          position: absolute;
          width: 42px;
          height: 115px;
          border-radius: 999px;
          background: linear-gradient(90deg, #020202, #141010, #030202);
          opacity: 0.95;
        }

        .fingerOne {
          top: 82px;
        }

        .fingerTwo {
          top: 158px;
          height: 104px;
          opacity: 0.86;
        }

        .handLeft .finger {
          left: 9px;
        }

        .handRight .finger {
          right: 9px;
        }

        @media (min-width: 760px) {
          .livePage {
            padding: 58px 24px 82px;
          }

          .tablet {
            border-radius: 42px;
            padding: 15px;
          }

          .tablet::before {
            top: 8px;
            width: 220px;
            height: 4px;
          }

          .tabletScreen {
            border-radius: 30px;
            padding: 42px 52px 48px;
          }

          .hero {
            grid-template-columns: 0.92fr 1.08fr;
            gap: 42px;
            align-items: center;
          }

          .badges {
            margin-bottom: 34px;
          }

          .leadForm {
            grid-template-columns: 1fr 1fr;
          }

          .leadForm button,
          .microCopy {
            grid-column: 1 / -1;
          }

          .speakersWrap {
            min-height: 520px;
            gap: 18px;
          }

          .speakerPhoto {
            min-height: 500px;
          }

          .speakerPhotoLizia {
            transform: translateY(34px);
          }

          .speakerTag {
            left: 16px;
            right: 16px;
            bottom: 16px;
            padding: 16px;
          }

          .speakerTag strong {
            font-size: 1.52rem;
          }

          .authority {
            grid-template-columns: 1fr 1fr;
            margin: 62px 0 44px;
          }

          .cards {
            grid-template-columns: repeat(3, 1fr);
          }

          .cards article {
            min-height: 190px;
            padding: 24px;
          }

          .hand {
            top: 52%;
            width: 138px;
            height: 430px;
          }

          .handLeft {
            left: -72px;
            transform: translateY(-50%) rotate(-13deg);
            border-radius: 86px 64px 44px 72px;
          }

          .handRight {
            right: -72px;
            transform: translateY(-50%) rotate(13deg);
            border-radius: 64px 86px 72px 44px;
          }

          .thumb {
            top: 62px;
            width: 78px;
            height: 175px;
          }

          .handLeft .thumb {
            right: -42px;
          }

          .handRight .thumb {
            left: -42px;
          }

          .finger {
            width: 74px;
            height: 180px;
          }

          .fingerOne {
            top: 150px;
          }

          .fingerTwo {
            top: 255px;
            height: 150px;
          }

          .handLeft .finger {
            left: 22px;
          }

          .handRight .finger {
            right: 22px;
          }
        }

        @media (min-width: 1040px) {
          .tabletScreen {
            padding: 46px 62px 54px;
          }

          .hero {
            grid-template-columns: 0.86fr 1.14fr;
            gap: 50px;
          }

          .speakersWrap {
            min-height: 550px;
          }

          .speakerPhoto {
            min-height: 530px;
          }

          .handLeft {
            left: -92px;
          }

          .handRight {
            right: -92px;
          }
        }

        @media (max-width: 390px) {
          .tabletScreen {
            padding: 18px 13px 22px;
          }

          h1 {
            font-size: 2.45rem;
          }

          .speakersWrap {
            min-height: 370px;
          }

          .speakerPhoto {
            min-height: 355px;
            border-radius: 22px;
          }

          .speakerTag strong {
            font-size: 1.05rem;
          }

          .hand {
            width: 58px;
            height: 210px;
          }

          .handLeft {
            left: -30px;
          }

          .handRight {
            right: -30px;
          }
        }
      `}</style>
    </>
  );
}