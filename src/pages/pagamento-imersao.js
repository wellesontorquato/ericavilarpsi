import Head from "next/head";
import { useState } from "react";

const CARD_LINKS = {
  individual:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-cOHS9p4ihX-197,00",
  casal:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-UMY5a2YDjT-297,00",
};

const PIX_PAYMENTS = {
  individual: {
    imagem: "/pix197.jpeg",
    codigo:
      "00020101021226760014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0228Imersao- Gestacao sem filtro5204000053039865406197.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCTZ0NCVL4utMwEIwa1KznP6304523E",
  },
  casal: {
    imagem: "/pix297.jpeg",
    codigo:
      "00020101021226700014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0222Pagamento lizianascime5204000053039865406297.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCZUgc8SO3XQC3OvOamoRRm6304AA8C",
  },
};

const planos = {
  individual: {
    id: "individual",
    nome: "Individual",
    valor: "R$ 197",
    descricao: "Para quem deseja viver a imersão individualmente.",
    destaque: "1 participante",
  },
  casal: {
    id: "casal",
    nome: "Casal",
    valor: "R$ 297",
    descricao: "Para viver essa experiência ao lado do companheiro.",
    destaque: "2 participantes",
  },
};

const metodosPagamento = {
  pix: {
    id: "pix",
    nome: "Pix",
    descricao: "Pagamento à vista, sem acréscimo.",
  },
  cartao: {
    id: "cartao",
    nome: "Cartão",
    descricao: "Pagamento via cartão pela InfinitePay com acréscimo de taxas.",
  },
};

const temasResumo = [
  "Muito acolhimento em um ambiente íntimo e seguro",
  "Coffee break especial para conexão e descanso",
  "Aprendizado profundo com profissionais reunidas",
  "Exercícios para cada fase do trabalho de parto",
  "Seu companheiro como seu maior aliado",
  "Preparação para gestação, parto e pós-parto",
];

function formatBrazilianWhatsapp(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function ImersaoGestacaoSemFiltro() {
  return (
    <>
      <Head>
        <title>Imersão Gestação Sem Filtro</title>
        <meta
          name="description"
          content="Imersão Gestação Sem Filtro: preparação para gestação, parto e pós-parto com acolhimento, aprendizado profundo e segurança."
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
                Imersão presencial
              </div>

              <div className="eventInfo">
                <span>Apenas 10 vagas</span>
                <span>Gestação</span>
                <span>Parto e pós-parto</span>
              </div>

              <p className="preTitle">Para mulheres e casais</p>

              <h1 className="heroTitle">
                Gestação sem filtro
                <em> uma vivência real, acolhedora e transformadora.</em>
              </h1>

              <p className="heroText">
                Uma experiência profunda para mulheres e casais que desejam viver
                a maternidade com mais consciência, preparo e segurança.
              </p>

              <a href="#inscricao" className="heroCta">
                Escolher minha vaga
                <span>↗</span>
              </a>
            </div>

            <div className="speakersBlock">
              <SpeakerPhotos />
            </div>

            <div className="proofColumns">
              <div className="proofGroup">
                <p>Na imersão</p>

                <div className="quickProof">
                  <span>Muito acolhimento</span>
                  <span>Coffee break especial</span>
                  <span>Aprendizado profundo</span>
                </div>
              </div>

              <div className="proofGroup proofGroupVip">
                <p>Preparação prática</p>

                <div className="quickProof">
                  <span>Exercícios para o parto</span>
                  <span>Companheiro como aliado</span>
                  <span>Consciência, preparo e segurança</span>
                </div>
              </div>
            </div>

            <CheckoutRedirectCard />
          </div>
        </section>

        <section className="topicsSection">
          <div className="topicsHeader">
            <span>O que está incluso</span>
            <h2>Mais do que um evento, uma vivência real</h2>
          </div>

          <div className="topicsGrid">
            {temasResumo.map((tema) => (
              <article key={tema}>
                <span>✓</span>
                <p>{tema}</p>
              </article>
            ))}
          </div>

          <a href="#inscricao" className="bottomCta">
            Reservar minha vaga
            <span>↗</span>
          </a>
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
          padding: 14px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 207, 184, 0.22), transparent 32%),
            radial-gradient(circle at 86% 18%, rgba(187, 76, 91, 0.3), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(240, 143, 101, 0.22), transparent 36%),
            linear-gradient(135deg, #321217 0%, #5a2328 43%, #9a5545 100%);
        }

        .liveMaioPage .backgroundWord {
          position: absolute;
          top: 10px;
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
          padding: 10px 0 22px;
        }

        .liveMaioPage .heroCard {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          overflow: hidden;
          border-radius: 30px;
          padding: 16px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 247, 242, 0.98)),
            #fff8f4;
          box-shadow:
            0 34px 95px rgba(24, 6, 8, 0.38),
            inset 0 0 0 1px rgba(255, 255, 255, 0.76);
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
          font-size: 0.68rem;
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
          animation: livePulse 1.35s ease-in-out infinite;
        }

        .liveMaioPage .eventInfo {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 14px 0 16px;
        }

        .liveMaioPage .eventInfo span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7e5dc;
          color: #7f3d3a;
          font-size: 0.76rem;
          font-weight: 850;
        }

        .liveMaioPage .preTitle {
          margin: 0 0 10px;
          color: #a64c50;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .heroTitle {
          margin: 0;
          max-width: 670px;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.45rem, 10.5vw, 4.9rem);
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
          margin: 16px 0 0;
          max-width: 560px;
          color: #563936;
          font-size: 0.98rem;
          line-height: 1.5;
          font-weight: 560;
        }

        .liveMaioPage .heroCta,
        .liveMaioPage .bottomCta {
          text-decoration: none;
        }

        .liveMaioPage .heroCta {
          width: 100%;
          margin-top: 18px;
          min-height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-weight: 950;
          box-shadow: 0 18px 42px rgba(143, 48, 72, 0.36);
          animation: ctaPulse 1.6s ease-in-out infinite;
        }

        .liveMaioPage .heroCta span,
        .liveMaioPage .bottomCta span,
        .liveMaioPage .submit span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          flex: 0 0 auto;
        }

        .liveMaioPage .proofColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .liveMaioPage .proofGroup {
          min-width: 0;
          padding: 10px;
          border-radius: 20px;
          background: rgba(255, 245, 238, 0.78);
          border: 1px solid rgba(166, 76, 80, 0.1);
        }

        .liveMaioPage .proofGroupVip {
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 255, 255, 0.58), transparent 38%),
            linear-gradient(135deg, rgba(255, 239, 229, 0.92), rgba(247, 214, 200, 0.88));
          box-shadow: 0 14px 32px rgba(143, 48, 72, 0.1);
        }

        .liveMaioPage .proofGroup p {
          margin: 0 0 8px;
          color: #9d4450;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .liveMaioPage .quickProof {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .liveMaioPage .quickProof span {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 9px 10px;
          border-radius: 15px;
          background: rgba(255, 250, 247, 0.82);
          color: #72443d;
          font-size: 0.76rem;
          line-height: 1.25;
          font-weight: 850;
        }

        .liveMaioPage .quickProof span::before {
          content: "✓";
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          border-radius: 999px;
          background: #a64c50;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 950;
          flex: 0 0 auto;
        }

        .liveMaioPage .proofGroupVip .quickProof span::before {
          content: "✦";
          background: linear-gradient(135deg, #8f3048, #d86f4f);
        }

        .liveMaioPage .speakers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .liveMaioPage .speakerCard {
          appearance: none;
          border: 0;
          padding: 0;
          margin: 0;
          width: 100%;
          display: block;
          position: relative;
          min-height: 305px;
          overflow: hidden;
          border-radius: 24px;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 236, 224, 0.96), transparent 45%),
            linear-gradient(180deg, #f5d9cc, #e8b7a6);
          border: 1px solid rgba(166, 76, 80, 0.1);
          box-shadow: 0 20px 45px rgba(92, 38, 35, 0.13);
        }

        .liveMaioPage .speakerCard:nth-child(2) {
          background:
            radial-gradient(circle at 50% 12%, rgba(255, 241, 232, 0.96), transparent 45%),
            linear-gradient(180deg, #f8dfd3, #e9b8a7);
        }

        .liveMaioPage .speakerCard img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.35s ease;
        }

        .liveMaioPage .speakerCard::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          height: 58%;
          background: linear-gradient(180deg, transparent, rgba(44, 18, 18, 0.78));
        }

        .liveMaioPage .speakerCard:hover img,
        .liveMaioPage .speakerCard.isOpen img {
          transform: scale(1.035);
        }

        .liveMaioPage .speakerName {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 2;
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 250, 246, 0.9);
          backdrop-filter: blur(14px);
          box-shadow: 0 16px 36px rgba(49, 15, 15, 0.18);
          transition: opacity 0.24s ease, transform 0.24s ease;
        }

        .liveMaioPage .speakerCard.isOpen .speakerName {
          opacity: 0;
          transform: translateY(16px);
        }

        .liveMaioPage .speakerName span {
          display: block;
          margin-bottom: 4px;
          color: #a64c50;
          font-size: 0.58rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .liveMaioPage .speakerName strong {
          display: block;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.05rem;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .liveMaioPage .tapHint {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          color: #8f3048;
          font-size: 0.68rem;
          font-weight: 900;
        }

        .liveMaioPage .tapHint::before {
          content: "+";
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #f3d7cc;
          color: #8f3048;
          font-weight: 950;
        }

        .liveMaioPage .speakerBio {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          z-index: 5;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 250, 246, 0.96);
          box-shadow: 0 18px 45px rgba(49, 15, 15, 0.22);
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.28s ease, opacity 0.28s ease;
        }

        .liveMaioPage .speakerCard.isOpen .speakerBio {
          transform: translateY(0);
          opacity: 1;
        }

        .liveMaioPage .speakerBio p {
          margin: 0;
          color: #573934;
          font-size: 0.8rem;
          line-height: 1.42;
        }

        .liveMaioPage .speakerBio small {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 9px;
          color: #a64c50;
          font-weight: 900;
          font-size: 0.68rem;
        }

        .liveMaioPage .speakerBio small::before {
          content: "×";
          display: grid;
          place-items: center;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #a64c50;
          color: #fff;
          font-weight: 950;
        }

        .liveMaioPage .formCard {
          align-self: start;
          border-radius: 28px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 244, 238, 0.99)),
            #fff8f4;
          border: 1px solid rgba(166, 76, 80, 0.14);
          box-shadow:
            0 24px 60px rgba(49, 15, 15, 0.18),
            inset 0 0 0 1px rgba(255, 255, 255, 0.65);
        }

        .liveMaioPage .formHeader {
          margin-bottom: 14px;
        }

        .liveMaioPage .formHeader span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
          color: #a64c50;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .liveMaioPage .formHeader span::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          animation: livePulse 1.35s ease-in-out infinite;
        }

        .liveMaioPage .formHeader h2 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 7.4vw, 2.55rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .liveMaioPage .formHeader p {
          margin: 9px 0 0;
          color: #67443e;
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .liveMaioPage .leadForm {
          display: grid;
          gap: 10px;
          width: 100%;
        }

        .liveMaioPage .field {
          display: grid;
          gap: 6px;
        }

        .liveMaioPage .field label,
        .liveMaioPage .choiceLabel {
          color: #3a1b1a;
          font-size: 0.8rem;
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

        .liveMaioPage .choiceGroup {
          display: grid;
          gap: 8px;
        }

        .liveMaioPage .choiceGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .liveMaioPage .choiceCard {
          border: 1px solid rgba(166, 76, 80, 0.14);
          border-radius: 18px;
          padding: 12px;
          background: #fffaf7;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease,
            box-shadow 0.18s ease;
        }

        .liveMaioPage .choiceCard:hover {
          transform: translateY(-1px);
          border-color: rgba(166, 76, 80, 0.36);
        }

        .liveMaioPage .choiceCard.isSelected {
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 255, 255, 0.72), transparent 38%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border-color: rgba(166, 76, 80, 0.46);
          box-shadow: 0 14px 32px rgba(143, 48, 72, 0.12);
        }

        .liveMaioPage .choiceTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .liveMaioPage .choiceTop strong {
          color: #351817;
          font-size: 0.92rem;
          font-weight: 950;
        }

        .liveMaioPage .choiceTop span {
          color: #8f3048;
          font-weight: 950;
          font-size: 0.9rem;
        }

        .liveMaioPage .choiceCard p {
          margin: 7px 0 0;
          color: #704740;
          font-size: 0.76rem;
          line-height: 1.34;
          font-weight: 750;
        }

        .liveMaioPage .choiceTag {
          display: inline-flex;
          margin-top: 10px;
          padding: 5px 8px;
          border-radius: 999px;
          background: #f8e4dc;
          color: #8f3048;
          font-size: 0.66rem;
          font-weight: 950;
        }

        .liveMaioPage .summaryBox {
          display: grid;
          gap: 8px;
          padding: 14px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.75), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.16);
          box-shadow: 0 14px 34px rgba(143, 48, 72, 0.12);
        }

        .liveMaioPage .summaryBox small {
          color: #a64c50;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .summaryMain {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .liveMaioPage .summaryMain strong {
          color: #351817;
          font-size: 0.95rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .liveMaioPage .summaryMain b {
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.65rem;
          line-height: 0.95;
          letter-spacing: -0.04em;
          text-align: right;
        }

        .liveMaioPage .summaryBox p {
          margin: 0;
          color: #704740;
          font-size: 0.78rem;
          line-height: 1.42;
        }

        .liveMaioPage .pixPaymentBox {
          display: grid;
          gap: 14px;
          padding: 14px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.78), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.18);
          box-shadow: 0 16px 36px rgba(143, 48, 72, 0.12);
        }

        .liveMaioPage .pixHeader {
          display: grid;
          gap: 6px;
        }

        .liveMaioPage .pixHeader span {
          color: #a64c50;
          font-size: 0.66rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .pixHeader strong {
          color: #351817;
          font-size: 1rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .liveMaioPage .pixHeader p {
          margin: 0;
          color: #704740;
          font-size: 0.78rem;
          line-height: 1.42;
          font-weight: 750;
        }

        .liveMaioPage .pixQrWrap {
          display: grid;
          place-items: center;
          padding: 12px;
          border-radius: 20px;
          background: rgba(255, 250, 247, 0.9);
          border: 1px solid rgba(166, 76, 80, 0.12);
        }

        .liveMaioPage .pixQrImage {
          width: min(260px, 100%);
          height: auto;
          display: block;
          border-radius: 14px;
        }

        .liveMaioPage .copyPasteBox {
          display: grid;
          gap: 8px;
        }

        .liveMaioPage .copyPasteBox label {
          color: #3a1b1a;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .liveMaioPage .copyPasteBox textarea {
          width: 100%;
          min-height: 96px;
          resize: vertical;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fffaf7;
          padding: 12px;
          color: #2d1717;
          font: inherit;
          font-size: 0.72rem;
          line-height: 1.38;
          outline: none;
        }

        .liveMaioPage .copyPasteBox textarea:focus {
          border-color: rgba(166, 76, 80, 0.58);
          box-shadow: 0 0 0 4px rgba(166, 76, 80, 0.12);
        }

        .liveMaioPage .copyPixButton {
          width: 100%;
          min-height: 46px;
          border: 0;
          border-radius: 15px;
          padding: 12px 14px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #ffffff;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.86rem;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(143, 48, 72, 0.24);
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .liveMaioPage .copyPixButton:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }

        .liveMaioPage .pixProofNote {
          margin: 0;
          padding: 10px 12px;
          border-radius: 15px;
          background: rgba(255, 250, 247, 0.84);
          color: #7f293f;
          font-size: 0.76rem;
          line-height: 1.38;
          font-weight: 900;
          text-align: center;
        }

        .liveMaioPage .cardFeeNotice {
          display: grid;
          gap: 6px;
          padding: 13px;
          border-radius: 18px;
          background: rgba(143, 48, 72, 0.08);
          border: 1px solid rgba(143, 48, 72, 0.14);
        }

        .liveMaioPage .cardFeeNotice strong {
          color: #7f293f;
          font-size: 0.86rem;
          font-weight: 950;
        }

        .liveMaioPage .cardFeeNotice p {
          margin: 0;
          color: #704740;
          font-size: 0.76rem;
          line-height: 1.4;
          font-weight: 780;
        }

        .liveMaioPage .consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          background: #f8e5dc;
          color: #5b3a36;
          font-size: 0.78rem;
          line-height: 1.38;
          cursor: pointer;
          border: 1px solid rgba(166, 76, 80, 0.12);
        }

        .liveMaioPage .consent input {
          width: 18px;
          height: 18px;
          margin-top: 1px;
          flex: 0 0 auto;
          accent-color: #a64c50;
        }

        .liveMaioPage .consent strong {
          color: #8f3048;
        }

        .liveMaioPage .errorMessage {
          margin: 0;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(143, 48, 72, 0.09);
          color: #8f3048;
          font-size: 0.78rem;
          line-height: 1.35;
          font-weight: 850;
        }

        .liveMaioPage .submit {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-family: "Montserrat", Arial, sans-serif;
          font-weight: 950;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 38px rgba(143, 48, 72, 0.34);
          animation: ctaPulse 1.6s ease-in-out infinite;
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .liveMaioPage .submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 24px 48px rgba(143, 48, 72, 0.4);
        }

        .liveMaioPage .submit:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .liveMaioPage .safeNote {
          margin: 0;
          text-align: center;
          color: #86534b;
          font-size: 0.74rem;
          line-height: 1.35;
        }

        .liveMaioPage .topicsSection {
          padding: 12px 0 38px;
        }

        .liveMaioPage .topicsHeader {
          max-width: 760px;
          margin: 0 auto 18px;
          text-align: center;
          color: #fff5ee;
        }

        .liveMaioPage .topicsHeader span {
          display: inline-block;
          margin-bottom: 10px;
          color: #ffd1bd;
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .liveMaioPage .topicsHeader h2 {
          margin: 0;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 7.5vw, 3.5rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .liveMaioPage .topicsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .liveMaioPage .topicsGrid article {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border-radius: 20px;
          background: rgba(255, 248, 243, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 18px 40px rgba(29, 7, 9, 0.14);
        }

        .liveMaioPage .topicsGrid article span {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: #f4d9ce;
          color: #a64c50;
          font-weight: 950;
          font-size: 0.75rem;
          flex: 0 0 auto;
        }

        .liveMaioPage .topicsGrid p {
          margin: 0;
          color: #60413b;
          font-size: 0.86rem;
          line-height: 1.3;
          font-weight: 800;
        }

        .liveMaioPage .bottomCta {
          width: min(420px, 100%);
          min-height: 56px;
          margin: 18px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #fff2e9, #ffd2bc);
          color: #7f293f;
          font-weight: 950;
          box-shadow: 0 22px 50px rgba(29, 7, 9, 0.22);
          animation: softPulse 1.8s ease-in-out infinite;
        }

        .liveMaioPage .bottomCta span {
          background: rgba(127, 41, 63, 0.12);
        }

        @keyframes livePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          }

          50% {
            transform: scale(1.18);
            box-shadow: 0 0 0 8px rgba(176, 75, 88, 0.08);
          }
        }

        @keyframes ctaPulse {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-1px);
          }
        }

        @keyframes softPulse {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-2px);
          }
        }

        @media (max-width: 420px) {
          .liveMaioPage {
            padding: 10px;
          }

          .liveMaioPage .heroCard {
            padding: 14px;
            border-radius: 26px;
          }

          .liveMaioPage .heroTitle {
            font-size: 2.24rem;
          }

          .liveMaioPage .proofColumns {
            gap: 8px;
          }

          .liveMaioPage .quickProof span {
            min-height: 40px;
            padding: 8px;
            font-size: 0.69rem;
            gap: 6px;
          }

          .liveMaioPage .speakers {
            gap: 8px;
          }

          .liveMaioPage .speakerCard {
            min-height: 270px;
            border-radius: 20px;
          }

          .liveMaioPage .choiceGrid {
            grid-template-columns: 1fr;
          }

          .liveMaioPage .formCard {
            padding: 15px;
            border-radius: 24px;
          }

          .liveMaioPage .topicsGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 700px) {
          .liveMaioPage {
            padding: 26px;
          }

          .liveMaioPage .heroSection {
            padding-top: 22px;
          }

          .liveMaioPage .heroCard {
            padding: 28px;
            border-radius: 40px;
          }

          .liveMaioPage .speakerCard {
            min-height: 390px;
          }

          .liveMaioPage .topicsGrid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1020px) {
          .liveMaioPage {
            padding: 32px;
          }

          .liveMaioPage .heroSection {
            padding-top: 32px;
          }

          .liveMaioPage .heroCard {
            grid-template-columns: minmax(0, 1fr) 410px;
            grid-template-areas:
              "copy form"
              "speakers form"
              "proof form";
            gap: 24px 38px;
            align-items: start;
            padding: 48px;
            border-radius: 46px;
          }

          .liveMaioPage .heroCopy {
            grid-area: copy;
            padding-top: 4px;
          }

          .liveMaioPage .speakersBlock {
            grid-area: speakers;
          }

          .liveMaioPage .proofColumns {
            grid-area: proof;
            width: min(640px, 100%);
          }

          .liveMaioPage .formCard {
            grid-area: form;
            position: sticky;
            top: 24px;
            padding: 24px;
          }

          .liveMaioPage .heroTitle {
            font-size: clamp(3.65rem, 5vw, 5.25rem);
            max-width: 720px;
          }

          .liveMaioPage .heroCta {
            width: min(390px, 100%);
          }

          .liveMaioPage .speakerCard {
            min-height: 350px;
          }

          .liveMaioPage .speakerCard img {
            object-position: center 16%;
          }

          .liveMaioPage .topicsSection {
            padding-top: 30px;
          }

          .liveMaioPage .topicsGrid {
            grid-template-columns: repeat(6, 1fr);
          }

          .liveMaioPage .topicsGrid article {
            min-height: 116px;
            align-items: flex-start;
            flex-direction: column;
            justify-content: space-between;
          }

          .liveMaioPage .topicsGrid p {
            font-size: 0.82rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liveMaioPage *,
          .liveMaioPage *::before,
          .liveMaioPage *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

function SpeakerPhotos() {
  const [openSpeaker, setOpenSpeaker] = useState(null);

  const speakers = [
    {
      id: "erica",
      role: "Psicóloga Clínica",
      name: "Erica Vilar",
      image: "/erica-live.png",
      alt: "Psicóloga Erica Vilar",
      bio:
        "Psicóloga clínica, fala sobre saúde emocional feminina, maternidade, vínculos e autocuidado com sensibilidade e profundidade.",
    },
    {
      id: "lizia",
      role: "Fisioterapeuta e doula",
      name: "Lizia Nascimento",
      image: "/lizia-live.png",
      alt: "Fisioterapeuta e doula Lizia Nascimento",
      bio:
        "Atua no cuidado integral da mulher da gestação ao pós-parto, unindo técnica, acolhimento e escuta.",
    },
  ];

  return (
    <div className="speakers">
      {speakers.map((speaker) => {
        const isOpen = openSpeaker === speaker.id;

        return (
          <button
            type="button"
            className={`speakerCard ${isOpen ? "isOpen" : ""}`}
            key={speaker.id}
            onClick={() => setOpenSpeaker(isOpen ? null : speaker.id)}
            aria-expanded={isOpen}
            aria-label={`${
              isOpen ? "Fechar informações de" : "Abrir informações de"
            } ${speaker.name}`}
          >
            <img src={speaker.image} alt={speaker.alt} />

            <div className="speakerName">
              <span>{speaker.role}</span>
              <strong>{speaker.name}</strong>
              <small className="tapHint">Clique/toque para saber mais</small>
            </div>

            <div className="speakerBio">
              <p>{speaker.bio}</p>
              <small>Clique/toque para fechar</small>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CheckoutRedirectCard() {
  const [whatsapp, setWhatsapp] = useState("");
  const [plano, setPlano] = useState("individual");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);

  const planoSelecionado = planos[plano];
  const metodoSelecionado = metodosPagamento[metodoPagamento];

  const isPix = metodoPagamento === "pix";
  const isCartao = metodoPagamento === "cartao";

  const dadosPix = PIX_PAYMENTS[plano];
  const linkCartao = CARD_LINKS[plano];

  async function copiarPix() {
    setErro("");

    try {
      await navigator.clipboard.writeText(dadosPix.codigo);
      setPixCopiado(true);

      setTimeout(() => {
        setPixCopiado(false);
      }, 2200);
    } catch (error) {
      setErro(
        "Não foi possível copiar automaticamente. Selecione o código Pix e copie manualmente."
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      nome: formData.get("nome"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
      plano,
      planoNome: planoSelecionado.nome,
      valor: planoSelecionado.valor,
      metodoPagamento,
      metodoPagamentoNome: metodoSelecionado.nome,
      origem: "imersao-gestacao-sem-filtro",
      criadoEm: new Date().toISOString(),
    };

    try {
      await fetch("/api/leads/imersao-gestacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Erro ao salvar lead antes do pagamento:", error);
    }

    if (isCartao) {
      if (!linkCartao) {
        setErro("O link do cartão ainda não foi configurado.");
        setEnviando(false);
        return;
      }

      window.location.href = linkCartao;
      return;
    }

    setEnviando(false);

    const pixBox = document.getElementById("pix-pagamento");

    if (pixBox) {
      pixBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <aside className="formCard" id="inscricao">
      <div className="formHeader">
        <span>Reserva de vaga</span>
        <h2>Escolha sua vaga e forma de pagamento</h2>
        <p>
          Preencha seus dados, selecione a opção desejada e finalize sua reserva
          por Pix ou cartão.
        </p>
      </div>

      <form className="leadForm" onSubmit={handleSubmit}>
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
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            maxLength={15}
            onChange={(event) => {
              setWhatsapp(formatBrazilianWhatsapp(event.target.value));
            }}
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

        <div className="choiceGroup">
          <span className="choiceLabel">Escolha sua opção</span>

          <div className="choiceGrid">
            {Object.values(planos).map((item) => (
              <button
                type="button"
                key={item.id}
                className={`choiceCard ${plano === item.id ? "isSelected" : ""}`}
                onClick={() => setPlano(item.id)}
              >
                <div className="choiceTop">
                  <strong>{item.nome}</strong>
                  <span>{item.valor}</span>
                </div>

                <p>{item.descricao}</p>

                <em className="choiceTag">{item.destaque}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="choiceGroup">
          <span className="choiceLabel">Forma de pagamento</span>

          <div className="choiceGrid">
            {Object.values(metodosPagamento).map((item) => (
              <button
                type="button"
                key={item.id}
                className={`choiceCard ${
                  metodoPagamento === item.id ? "isSelected" : ""
                }`}
                onClick={() => setMetodoPagamento(item.id)}
              >
                <div className="choiceTop">
                  <strong>{item.nome}</strong>
                  <span>{item.id === "pix" ? "Sem acréscimo" : "Com acréscimo"}</span>
                </div>

                <p>{item.descricao}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="summaryBox">
          <small>Resumo da reserva</small>

          <div className="summaryMain">
            <strong>
              {planoSelecionado.nome} via {metodoSelecionado.nome}
            </strong>

            <b>{isCartao ? `${planoSelecionado.valor} + taxas` : planoSelecionado.valor}</b>
          </div>

          {isPix ? (
            <p>
              No Pix, o valor é integral, sem acréscimo. Após o pagamento, envie
              o comprovante no grupo para confirmação da sua vaga.
            </p>
          ) : (
            <p>
              No cartão, o pagamento será finalizado pela InfinitePay e terá
              acréscimo referente às taxas da operadora. As condições aparecerão
              antes da confirmação.
            </p>
          )}
        </div>

        {isPix && (
          <div className="pixPaymentBox" id="pix-pagamento">
            <div className="pixHeader">
              <span>Pagamento via Pix</span>
              <strong>
                {planoSelecionado.nome} — {planoSelecionado.valor}
              </strong>
              <p>
                Escaneie o QR Code abaixo ou copie o código Pix. Depois, envie o
                comprovante no grupo para confirmação da sua vaga.
              </p>
            </div>

            <div className="pixQrWrap">
              <img
                src={dadosPix.imagem}
                alt={`QR Code Pix ${planoSelecionado.nome} ${planoSelecionado.valor}`}
                className="pixQrImage"
              />
            </div>

            <div className="copyPasteBox">
              <label htmlFor="pixCopiaCola">Pix copia e cola</label>

              <textarea
                id="pixCopiaCola"
                value={dadosPix.codigo}
                readOnly
                onFocus={(event) => event.target.select()}
              />

              <button type="button" className="copyPixButton" onClick={copiarPix}>
                {pixCopiado ? "Pix copiado!" : "Copiar código Pix"}
              </button>
            </div>

            <p className="pixProofNote">
              Importante: sua vaga será confirmada após o envio do comprovante no
              grupo.
            </p>
          </div>
        )}

        {isCartao && (
          <div className="cardFeeNotice">
            <strong>Pagamento no cartão com acréscimo</strong>
            <p>
              Ao escolher cartão, você será redirecionada para a InfinitePay. O
              valor final pode ter acréscimo referente às taxas da operadora.
            </p>
          </div>
        )}

        <label className="consent">
          <input type="checkbox" name="consentimento" required />
          <span>
            <strong>Obrigatório:</strong> confirmo que meus dados estão corretos
            e aceito receber comunicações sobre a Imersão Gestação Sem Filtro.
          </span>
        </label>

        {erro && <p className="errorMessage">{erro}</p>}

        <button className="submit" type="submit" disabled={enviando}>
          {isPix
            ? enviando
              ? "Confirmando dados..."
              : "Confirmar dados e pagar via Pix"
            : enviando
              ? "Redirecionando..."
              : "Ir para pagamento no cartão"}
          <span>↗</span>
        </button>

        <p className="safeNote">
          Sua vaga será considerada reservada após a confirmação do pagamento.
        </p>
      </form>
    </aside>
  );
}