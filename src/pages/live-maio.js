import Head from "next/head";
import { useState } from "react";

const subtemas = [
  "Corpo e mudanças na gestação",
  "Medos e ansiedade",
  "Dores e desconfortos",
  "Parto e preparação",
  "Pós-parto real",
  "Culpa e autocobrança",
];

export default function LiveMaio() {
  return (
    <>
      <Head>
        <title>Live Maio | Gestação sem filtro</title>
        <meta
          name="description"
          content="Live gratuita no Instagram com Erica Vilar e Lizia Nascimento sobre gestação, corpo, emoções, preparação e pós-parto."
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
                <em> o que você precisa saber e quase ninguém te contou.</em>
              </h1>

              <p className="heroText">
                Uma conversa real sobre corpo, emoções, medos, preparação,
                parto e pós-parto.
              </p>

              <a href="#inscricao" className="heroCta">
                Quero entrar na lista VIP
                <span>↗</span>
              </a>

              <div className="proofColumns">
                <div className="proofGroup">
                  <p>Na live</p>

                  <div className="quickProof">
                    <span>Sem romantização</span>
                    <span>Com acolhimento</span>
                    <span>Com orientação profissional</span>
                  </div>
                </div>

                <div className="proofGroup proofGroupVip">
                  <p>Na lista VIP</p>

                  <div className="quickProof">
                    <span>Grupo VIP da live</span>
                    <span>Mimos e materiais após a live</span>
                    <span>Lembretes exclusivos no WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="speakersBlock">
              <SpeakerPhotos />
            </div>

            <FormCard />
          </div>
        </section>

        <section className="topicsSection">
          <div className="topicsHeader">
            <span>O que será conversado</span>
            <h2>Escolha no formulário os temas que mais importam para você</h2>
          </div>

          <div className="topicsGrid">
            {subtemas.map((tema) => (
              <article key={tema}>
                <span>✓</span>
                <p>{tema}</p>
              </article>
            ))}
          </div>

          <a href="#inscricao" className="bottomCta">
            Garantir meu lugar no grupo VIP
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
          box-shadow:
            0 18px 42px rgba(143, 48, 72, 0.36),
            0 0 0 0 rgba(216, 111, 79, 0.42);
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
          margin-top: 12px;
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

        .liveMaioPage .proofGroupVip .quickProof span {
          background: rgba(255, 255, 255, 0.76);
          color: #7f293f;
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

        .liveMaioPage .speakersBlock {
          min-width: 0;
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
        .liveMaioPage .checkboxTitle {
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

        .liveMaioPage .vipNotice {
          display: flex;
          gap: 12px;
          padding: 13px;
          border-radius: 18px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.75), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.16);
          box-shadow: 0 14px 34px rgba(143, 48, 72, 0.12);
        }

        .liveMaioPage .vipIcon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          border-radius: 999px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-weight: 950;
          box-shadow: 0 10px 24px rgba(143, 48, 72, 0.28);
          animation: livePulse 1.45s ease-in-out infinite;
        }

        .liveMaioPage .vipNotice strong {
          display: block;
          color: #351817;
          font-size: 0.86rem;
          line-height: 1.32;
          font-weight: 950;
        }

        .liveMaioPage .vipNotice p {
          margin: 6px 0 0;
          color: #704740;
          font-size: 0.78rem;
          line-height: 1.42;
        }

        .liveMaioPage .checkboxGroup {
          display: grid;
          gap: 9px;
        }

        .liveMaioPage .checkboxTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .liveMaioPage .checkboxTitle small {
          color: #a64c50;
          font-size: 0.7rem;
          font-weight: 900;
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
          min-height: 44px;
          padding: 10px 11px 10px 36px;
          border-radius: 15px;
          background: #fffaf7;
          border: 1px solid rgba(166, 76, 80, 0.13);
          color: #5b3a36;
          font-size: 0.8rem;
          line-height: 1.32;
          transition: border-color 0.18s ease, background 0.18s ease, color 0.18s ease;
        }

        .liveMaioPage .checkOption span::before {
          content: "";
          position: absolute;
          left: 11px;
          top: 12px;
          width: 17px;
          height: 17px;
          border-radius: 6px;
          border: 1.5px solid rgba(166, 76, 80, 0.42);
          background: #ffffff;
        }

        .liveMaioPage .checkOption span::after {
          content: "✓";
          position: absolute;
          left: 14px;
          top: 9px;
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
          box-shadow:
            0 18px 38px rgba(143, 48, 72, 0.34),
            0 0 0 0 rgba(216, 111, 79, 0.42);
          animation: ctaPulse 1.6s ease-in-out infinite;
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .liveMaioPage .submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow:
            0 24px 48px rgba(143, 48, 72, 0.4),
            0 0 0 8px rgba(216, 111, 79, 0.1);
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
          max-width: 720px;
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
            box-shadow:
              0 18px 38px rgba(143, 48, 72, 0.34),
              0 0 0 0 rgba(216, 111, 79, 0.38);
          }

          50% {
            transform: translateY(-1px);
            box-shadow:
              0 22px 46px rgba(143, 48, 72, 0.42),
              0 0 0 8px rgba(216, 111, 79, 0.1);
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

          .liveMaioPage .heroText {
            font-size: 0.92rem;
          }

          .liveMaioPage .proofColumns {
            gap: 8px;
          }

          .liveMaioPage .proofGroup {
            padding: 8px;
            border-radius: 17px;
          }

          .liveMaioPage .proofGroup p {
            font-size: 0.62rem;
          }

          .liveMaioPage .quickProof span {
            min-height: 40px;
            padding: 8px;
            font-size: 0.69rem;
            gap: 6px;
          }

          .liveMaioPage .quickProof span::before {
            width: 17px;
            height: 17px;
            font-size: 0.62rem;
          }

          .liveMaioPage .speakers {
            gap: 8px;
          }

          .liveMaioPage .speakerCard {
            min-height: 270px;
            border-radius: 20px;
          }

          .liveMaioPage .speakerName {
            left: 8px;
            right: 8px;
            bottom: 8px;
            padding: 10px;
            border-radius: 15px;
          }

          .liveMaioPage .speakerName strong {
            font-size: 0.96rem;
          }

          .liveMaioPage .tapHint {
            font-size: 0.64rem;
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

          .liveMaioPage .proofColumns {
            gap: 12px;
          }

          .liveMaioPage .proofGroup {
            padding: 12px;
          }

          .liveMaioPage .speakers {
            gap: 14px;
          }

          .liveMaioPage .speakerCard {
            min-height: 390px;
          }

          .liveMaioPage .speakerName {
            left: 14px;
            right: 14px;
            bottom: 14px;
            padding: 14px;
          }

          .liveMaioPage .speakerName strong {
            font-size: 1.26rem;
          }

          .liveMaioPage .checkboxOptions {
            grid-template-columns: 1fr 1fr;
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
            grid-template-columns: minmax(0, 1fr) 400px;
            grid-template-areas:
              "copy form"
              "speakers form";
            gap: 24px 34px;
            align-items: start;
            padding: 42px;
            border-radius: 46px;
          }

          .liveMaioPage .heroCopy {
            grid-area: copy;
            padding-top: 4px;
          }

          .liveMaioPage .speakersBlock {
            grid-area: speakers;
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

          .liveMaioPage .heroText {
            max-width: 520px;
            font-size: 1.02rem;
          }

          .liveMaioPage .heroCta {
            width: min(390px, 100%);
          }

          .liveMaioPage .proofColumns {
            width: min(640px, 100%);
          }

          .liveMaioPage .quickProof span {
            font-size: 0.78rem;
          }

          .liveMaioPage .speakers {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .liveMaioPage .speakerCard {
            min-height: 330px;
          }

          .liveMaioPage .speakerCard img {
            object-position: center 16%;
          }

          .liveMaioPage .checkboxOptions {
            grid-template-columns: 1fr;
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

        @media (min-width: 1180px) {
          .liveMaioPage .heroCard {
            grid-template-columns: minmax(0, 1fr) 410px;
            gap: 26px 38px;
            padding: 48px;
          }

          .liveMaioPage .speakerCard {
            min-height: 350px;
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
            aria-label={`${isOpen ? "Fechar informações de" : "Abrir informações de"} ${speaker.name}`}
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

function FormCard() {
  return (
    <aside className="formCard" id="inscricao">
      <div className="formHeader">
        <span>Acesso VIP gratuito</span>
        <h2>Entre na lista exclusiva da live</h2>
        <p>
          Preencha em menos de 1 minuto para receber o lembrete, acessar o grupo
          VIP e ganhar os materiais enviados depois da live.
        </p>
      </div>

      <form className="leadForm" action="/api/leads/live-maio" method="POST">
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

        <div className="vipNotice">
          <div className="vipIcon">✦</div>

          <div>
            <strong>Após a inscrição, você será direcionada para o grupo VIP.</strong>
            <p>
              Por lá, você recebe os lembretes da live, avisos importantes e os
              mimos com materiais de apoio depois do encontro.
            </p>
          </div>
        </div>

        <div className="checkboxGroup">
          <div className="checkboxTitle">
            <span>Subtemas de interesse</span>
            <small>opcional</small>
          </div>

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
            <strong>Obrigatório:</strong> aceito receber comunicações sobre esta
            live e conteúdos relacionados por WhatsApp e e-mail.
          </span>
        </label>

        <button className="submit" type="submit">
          Quero meu acesso VIP
          <span>↗</span>
        </button>

        <p className="safeNote">
          Ao enviar, você será direcionada para entrar no grupo VIP da live.
        </p>
      </form>
    </aside>
  );
}