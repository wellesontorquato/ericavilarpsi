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

      <main className="page">
        <div className="decor decorOne" />
        <div className="decor decorTwo" />
        <div className="bgText">GESTAÇÃO</div>

        <section className="hero">
          <div className="heroInner">
            <div className="heroContent">
              <div className="pill">
                <span className="dot" />
                Live gratuita no Instagram
              </div>

              <div className="dateRow">
                <span>24 de maio</span>
                <span>17h</span>
                <span>60 minutos</span>
              </div>

              <h1>
                Gestação sem filtro:
                <strong> tudo que você precisa saber e nunca te contaram.</strong>
              </h1>

              <p className="lead">
                Uma conversa real, acolhedora e sem romantização sobre corpo,
                emoções, medos, dores, culpa, preparação e pós-parto.
              </p>

              <div className="mobileSpeakers">
                <SpeakerPhotos />
              </div>

              <div className="promise">
                <span>Você não precisa passar por essa fase cheia de dúvidas.</span>
                <p>
                  Essa live é um espaço para falar com honestidade sobre o que
                  muitas mulheres sentem, mas quase ninguém explica com cuidado.
                </p>
              </div>

              <div className="speakersText">
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

            <aside className="heroAside">
              <div className="desktopSpeakers">
                <SpeakerPhotos />
              </div>

              <FormCard />
            </aside>
          </div>
        </section>

        <section className="topics">
          <div className="sectionHeader">
            <span>O que será conversado</span>
            <h2>Uma live para falar o que quase ninguém fala sobre gestar</h2>
            <p>
              Informação, acolhimento e orientação para viver essa fase com mais
              consciência, menos culpa e mais segurança.
            </p>
          </div>

          <div className="topicGrid">
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

      <style jsx>{`
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 15% 10%, rgba(255, 205, 181, 0.22), transparent 30%),
            radial-gradient(circle at 85% 18%, rgba(169, 73, 92, 0.28), transparent 32%),
            linear-gradient(135deg, #321217 0%, #5b2328 42%, #9a5545 100%);
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          padding: 18px;
        }

        .bgText {
          position: absolute;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          font-size: clamp(4rem, 18vw, 16rem);
          font-weight: 950;
          letter-spacing: -0.09em;
          line-height: 0.8;
          color: rgba(255, 232, 220, 0.08);
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
        }

        .decor {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          pointer-events: none;
          z-index: 0;
        }

        .decorOne {
          width: 320px;
          height: 320px;
          left: -130px;
          bottom: 16%;
          background: rgba(255, 181, 137, 0.45);
        }

        .decorTwo {
          width: 360px;
          height: 360px;
          right: -160px;
          top: 18%;
          background: rgba(136, 45, 68, 0.55);
        }

        .hero,
        .topics {
          position: relative;
          z-index: 1;
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .hero {
          padding: 16px 0 34px;
        }

        .heroInner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          border-radius: 34px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 245, 239, 0.94)),
            #fff8f3;
          box-shadow:
            0 35px 100px rgba(24, 6, 8, 0.38),
            inset 0 0 0 1px rgba(255, 255, 255, 0.72);
          overflow: hidden;
          padding: 18px;
        }

        .heroContent {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #fff;
          color: #a44955;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          box-shadow: 0 12px 30px rgba(90, 35, 38, 0.08);
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
        }

        .dateRow {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 16px 0 18px;
        }

        .dateRow span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7e5dc;
          color: #7f3d3a;
          font-size: 0.78rem;
          font-weight: 850;
        }

        h1 {
          margin: 0;
          max-width: 720px;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.65rem, 12vw, 5.7rem);
          line-height: 0.88;
          letter-spacing: -0.065em;
          color: #291211;
        }

        h1 strong {
          display: block;
          color: #a64c50;
          font-style: italic;
          font-weight: 400;
        }

        .lead {
          margin: 18px 0 0;
          max-width: 640px;
          color: #563936;
          font-size: 1rem;
          line-height: 1.62;
          font-weight: 560;
        }

        .mobileSpeakers {
          width: 100%;
          margin: 22px 0 4px;
        }

        .desktopSpeakers {
          display: none;
        }

        .promise {
          width: 100%;
          margin-top: 18px;
          padding: 16px;
          border-radius: 22px;
          background:
            linear-gradient(135deg, rgba(255, 242, 233, 0.94), rgba(248, 218, 205, 0.9));
          border: 1px solid rgba(166, 76, 80, 0.12);
          box-shadow: 0 16px 38px rgba(92, 38, 35, 0.08);
        }

        .promise span {
          display: block;
          color: #351817;
          font-weight: 900;
          font-size: 0.98rem;
          line-height: 1.35;
        }

        .promise p {
          margin: 8px 0 0;
          color: #714942;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .speakersText {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 14px;
          width: 100%;
        }

        .speakersText article {
          padding: 16px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.64);
          border: 1px solid rgba(166, 76, 80, 0.08);
        }

        .speakersText span {
          display: block;
          color: #a64c50;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .speakersText strong {
          display: block;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.45rem;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 8px;
        }

        .speakersText p {
          margin: 0;
          color: #60413b;
          font-size: 0.88rem;
          line-height: 1.52;
        }

        .heroAside {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .topics {
          padding: 12px 0 38px;
        }

        .sectionHeader {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 18px;
          color: #fff5ee;
        }

        .sectionHeader span {
          display: inline-block;
          margin-bottom: 10px;
          color: #ffd1bd;
          font-size: 0.76rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sectionHeader h2 {
          margin: 0;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.1rem, 9vw, 4.4rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .sectionHeader p {
          margin: 14px auto 0;
          max-width: 640px;
          color: rgba(255, 245, 238, 0.82);
          font-size: 0.98rem;
          line-height: 1.58;
        }

        .topicGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .topicGrid article {
          padding: 20px;
          border-radius: 26px;
          background: rgba(255, 248, 243, 0.93);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 22px 50px rgba(29, 7, 9, 0.18);
        }

        .topicGrid article span {
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

        .topicGrid h3 {
          margin: 0 0 9px;
          color: #2d1717;
          font-size: 1.05rem;
          line-height: 1.28;
        }

        .topicGrid p {
          margin: 0;
          color: #60413b;
          font-size: 0.92rem;
          line-height: 1.55;
        }

        @media (min-width: 760px) {
          .page {
            padding: 28px;
          }

          .hero {
            padding-top: 28px;
          }

          .heroInner {
            padding: 30px;
            border-radius: 42px;
          }

          .mobileSpeakers {
            display: none;
          }

          .desktopSpeakers {
            display: block;
          }

          .speakersText {
            grid-template-columns: 1fr 1fr;
          }

          .topicGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .topicGrid article {
            min-height: 250px;
            padding: 24px;
          }
        }

        @media (min-width: 1020px) {
          .heroInner {
            grid-template-columns: minmax(0, 1fr) 430px;
            gap: 34px;
            align-items: start;
            padding: 42px;
          }

          .heroAside {
            position: sticky;
            top: 24px;
          }

          .lead {
            font-size: 1.08rem;
          }

          .promise {
            max-width: 650px;
          }

          .topics {
            padding-top: 36px;
          }
        }

        @media (min-width: 1180px) {
          .heroInner {
            grid-template-columns: minmax(0, 1fr) 460px;
            padding: 48px;
          }
        }
      `}</style>

      <style jsx>{`
        .speakers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .speaker {
          position: relative;
          min-height: 330px;
          border-radius: 26px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 16%, rgba(255, 235, 223, 0.95), transparent 44%),
            linear-gradient(180deg, #f5d9cc, #e8b7a6);
          box-shadow: 0 20px 45px rgba(92, 38, 35, 0.13);
          border: 1px solid rgba(166, 76, 80, 0.1);
        }

        .speaker:nth-child(2) {
          background:
            radial-gradient(circle at 50% 16%, rgba(255, 239, 229, 0.95), transparent 44%),
            linear-gradient(180deg, #f8dfd3, #e9b8a7);
        }

        .speaker img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .speaker::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 48%;
          background: linear-gradient(180deg, transparent, rgba(44, 18, 18, 0.72));
          z-index: 1;
        }

        .speakerName {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 2;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 250, 246, 0.86);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 36px rgba(49, 15, 15, 0.18);
        }

        .speakerName span {
          display: block;
          color: #a64c50;
          font-size: 0.62rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .speakerName strong {
          display: block;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.15rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        @media (max-width: 390px) {
          .speakers {
            gap: 8px;
          }

          .speaker {
            min-height: 300px;
            border-radius: 22px;
          }

          .speakerName {
            left: 8px;
            right: 8px;
            bottom: 8px;
            padding: 10px;
            border-radius: 15px;
          }

          .speakerName strong {
            font-size: 1rem;
          }
        }

        @media (min-width: 760px) {
          .speaker {
            min-height: 430px;
          }

          .speakerName {
            left: 14px;
            right: 14px;
            bottom: 14px;
            padding: 14px;
          }

          .speakerName strong {
            font-size: 1.35rem;
          }
        }

        @media (min-width: 1020px) {
          .speakers {
            gap: 12px;
          }

          .speaker {
            min-height: 360px;
          }
        }
      `}</style>

      <style jsx>{`
        .formCard {
          border-radius: 30px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 244, 238, 0.96)),
            #fff8f4;
          border: 1px solid rgba(166, 76, 80, 0.12);
          box-shadow: 0 24px 60px rgba(49, 15, 15, 0.18);
          padding: 18px;
        }

        .formHeader {
          margin-bottom: 16px;
        }

        .formHeader span {
          display: inline-block;
          margin-bottom: 8px;
          color: #a64c50;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .formHeader h2 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 9vw, 2.75rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .formHeader p {
          margin: 10px 0 0;
          color: #67443e;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .leadForm {
          display: grid;
          gap: 11px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field label,
        .checkboxTitle {
          color: #3a1b1a;
          font-size: 0.82rem;
          font-weight: 850;
        }

        .field input {
          width: 100%;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fffaf7;
          padding: 14px 14px;
          color: #2d1717;
          font: inherit;
          outline: none;
          transition: box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .field input:focus {
          border-color: rgba(166, 76, 80, 0.58);
          box-shadow: 0 0 0 4px rgba(166, 76, 80, 0.12);
        }

        .checkboxGroup {
          display: grid;
          gap: 8px;
          margin-top: 2px;
        }

        .checkboxOptions {
          display: grid;
          gap: 8px;
        }

        .checkOption {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px;
          border-radius: 16px;
          background: #fffaf7;
          border: 1px solid rgba(166, 76, 80, 0.12);
          color: #5b3a36;
          font-size: 0.84rem;
          line-height: 1.35;
          cursor: pointer;
        }

        .checkOption input,
        .consent input {
          width: 16px;
          height: 16px;
          margin-top: 1px;
          accent-color: #a64c50;
          flex: 0 0 auto;
        }

        .consent {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 12px;
          border-radius: 16px;
          background: #f8e5dc;
          color: #5b3a36;
          font-size: 0.8rem;
          line-height: 1.42;
          cursor: pointer;
        }

        .submit {
          width: 100%;
          border: 0;
          border-radius: 18px;
          padding: 16px 16px;
          background: linear-gradient(135deg, #8f3048, #ca6a50);
          color: #fff;
          font-weight: 950;
          font-size: 0.96rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 38px rgba(143, 48, 72, 0.3);
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 22px 45px rgba(143, 48, 72, 0.36);
        }

        .submit span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .safeNote {
          margin: 0;
          text-align: center;
          color: #86534b;
          font-size: 0.76rem;
          line-height: 1.4;
        }

        @media (min-width: 760px) {
          .formCard {
            padding: 22px;
          }

          .checkboxOptions {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1020px) {
          .formCard {
            padding: 24px;
          }

          .checkboxOptions {
            grid-template-columns: 1fr;
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
    <div className="formCard">
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
    </div>
  );
}