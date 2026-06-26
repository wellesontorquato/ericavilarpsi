import React from 'react';
import Head from 'next/head'; // Importação para o SEO

export default function ImersaoGestacaoSemFiltro() {
  return (
    <>
      {/* =========================================
          OTIMIZAÇÃO DE SEO (TÍTULO E METADADOS)
          ========================================= */}
      <Head>
        <title>Imersão Gestação Sem Filtro </title>
        <meta name="description" content="Imersão presencial exclusiva para gestantes e casais. Preparação física e emocional para o parto e pós-parto com a psicóloga Erica Vilar e a fisioterapeuta/doula Lizia Nascimento." />
        <meta name="keywords" content="imersão para gestantes, curso de gestante, preparação para o parto, parto humanizado, doula, psicologia perinatal, fisioterapia pélvica, gestação sem filtro" />
        <meta name="author" content="Erica Vilar e Lizia Nascimento" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Imersão Gestação Sem Filtro | Apenas 10 Vagas" />
        <meta property="og:description" content="Uma experiência profunda, acolhedora e transformadora para mulheres e casais que desejam viver a maternidade com consciência, preparo e segurança." />
        <meta property="og:image" content="/foto-casal-gestante.jpg" /> {/* Substitua pela imagem principal de capa */}
      </Head>

      {/* =========================================
          INJEÇÃO DO CSS MOBILE-FIRST PREMIUM
          ========================================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --lp-primary: #8a2522;       /* Terracota/Vinho sofisticado */
          --lp-primary-hover: #6b1b19;
          --lp-primary-light: #fff5f5;
          --lp-primary-border: #fad1d1;
          --lp-text-dark: #2d2d2d;
          --lp-text-muted: #595959;
          --lp-bg-light: #f9f9f9;
          --lp-bg-dark: #1a1a1a;
          --lp-white: #ffffff;
          --lp-green-bg: #eaf8ec;
          --lp-green-border: #bfe4c6;
          --lp-green-text: #27ae60;
          --lp-red-bg: #fce8e8;
          --lp-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --lp-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lp-page {
          font-family: var(--lp-font-sans);
          color: var(--lp-text-dark);
          line-height: 1.6;
          background-color: var(--lp-white);
          -webkit-font-smoothing: antialiased;
        }

        .lp-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .lp-text-red { color: var(--lp-primary); }
        .lp-bg-grey { background-color: var(--lp-bg-light); padding: 60px 0; }
        .lp-bg-red { background-color: var(--lp-primary); color: var(--lp-white); padding: 60px 0; text-align: center; }

        /* Botão Premium */
        .lp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: var(--lp-primary);
          color: var(--lp-white);
          text-decoration: none;
          font-weight: 700;
          padding: 18px 36px;
          border-radius: 50px;
          text-transform: uppercase;
          font-size: 0.95rem;
          letter-spacing: 0.05em;
          transition: var(--lp-transition);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(138, 37, 34, 0.3);
          width: 100%;
        }

        .lp-btn:hover {
          background-color: var(--lp-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(138, 37, 34, 0.4);
        }

        /* Base das Listas */
        .lp-list { list-style: none; padding: 0; margin: 0; }
        .lp-list li { margin-bottom: 16px; font-size: 1.05rem; position: relative; padding-left: 24px; color: var(--lp-text-dark); }
        .lp-list li::before { content: "•"; position: absolute; left: 4px; color: var(--lp-primary); font-size: 1.2rem; top: -2px; }

        /* Hero */
        .lp-hero { display: flex; flex-direction: column; padding: 40px 24px; gap: 40px; }
        .lp-hero-content { text-align: center; }
        .lp-hero-title { font-size: 2.4rem; font-weight: 800; line-height: 1.2; margin-bottom: 12px; letter-spacing: -0.02em; }
        .lp-hero-subtitle { font-size: 1.1rem; font-weight: 600; color: var(--lp-text-muted); margin-bottom: 24px; }
        .lp-hero-text { font-size: 1.1rem; color: var(--lp-text-muted); margin-bottom: 24px; }
        .lp-hero-highlight { font-size: 1.6rem; font-weight: 700; margin: 24px 0; line-height: 1.3; }
        .lp-hero-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; font-size: 0.85rem; font-weight: 700; margin: 24px 0; border-top: 1px solid #e5e5e5; border-bottom: 1px solid #e5e5e5; padding: 14px 0; color: var(--lp-primary); }

        /* Colagem de Imagens */
        .lp-collage { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .lp-collage img { width: 100%; height: 200px; border-radius: 16px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .lp-collage img:nth-child(even) { transform: translateY(16px); }

        /* Seções Divididas */
        .lp-split-section { display: flex; flex-direction: column; gap: 32px; margin: 48px 0; }
        .lp-split-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }

        /* Banner Central */
        .lp-red-banner-text { font-size: 1.4rem; font-weight: 600; max-width: 850px; margin: 0 auto; line-height: 1.5; padding: 0 20px; }

        /* Cronograma */
        .lp-schedule { display: flex; flex-direction: column; gap: 32px; margin-top: 40px; }
        .lp-schedule-item { text-align: center; padding: 0 16px; }
        .lp-schedule-icon { font-size: 2.5rem; margin-bottom: 12px; }

        /* Módulos (Accordions) */
        .lp-modules-grid { display: flex; flex-direction: column; gap: 40px; margin-top: 32px; }
        .lp-module-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.02em; border-bottom: 2px solid var(--lp-primary-border); padding-bottom: 8px; }
        .lp-accordion { background: var(--lp-white); margin-bottom: 12px; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #f0f0f0; transition: var(--lp-transition); }
        .lp-accordion[open] { box-shadow: 0 4px 16px rgba(0,0,0,0.08); border-color: var(--lp-primary-border); }
        .lp-accordion summary { padding: 18px 24px; font-weight: 600; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; font-size: 1rem; }
        .lp-accordion summary::-webkit-details-marker { display: none; }
        .lp-accordion summary::after { content: "+"; font-size: 1.4rem; color: var(--lp-text-muted); font-weight: 300; transition: var(--lp-transition); }
        .lp-accordion[open] summary::after { transform: rotate(45deg); color: var(--lp-primary); }
        .lp-accordion p { padding: 0 24px 20px; margin: 0; font-size: 0.95rem; color: var(--lp-text-muted); }

        /* Boxes Alvo */
        .lp-target-boxes { display: flex; flex-direction: column; gap: 24px; margin: 48px 0; }
        .lp-box { padding: 32px; border-radius: 20px; }
        .lp-box-green { background-color: var(--lp-green-bg); border: 1px solid var(--lp-green-border); }
        .lp-box-red { background-color: var(--lp-red-bg); border: 1px solid var(--lp-primary-border); }
        .lp-box h3 { font-size: 1.4rem; margin-bottom: 24px; font-weight: 700; }
        .lp-box ul { list-style: none; padding: 0; margin: 0; }
        .lp-box ul li { margin-bottom: 16px; display: flex; align-items: flex-start; gap: 12px; font-size: 1rem; }
        .lp-icon-check { color: var(--lp-green-text); font-weight: bold; }
        .lp-icon-cross { color: var(--lp-primary); font-weight: bold; }

        /* Pricing */
        .lp-pricing-wrapper { background-color: #fcf8f7; padding: 60px 24px; position: relative; }
        .lp-pricing-card { position: relative; background: var(--lp-white); width: 100%; margin: 0 auto; padding: 32px 24px; border-radius: 24px; text-align: center; box-shadow: 0 12px 40px rgba(0,0,0,0.06); z-index: 2; }
        .lp-pricing-grid { display: flex; flex-direction: column; gap: 24px; margin: 32px 0; }
        .lp-price-tier { background: var(--lp-white); padding: 32px 24px; border-radius: 16px; border: 2px solid var(--lp-primary-border); transition: var(--lp-transition); }
        .lp-price-tier:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(138, 37, 34, 0.08); }
        .lp-price-value { font-size: 2.8rem; font-weight: 800; color: var(--lp-text-dark); margin: 12px 0; }

        /* Premium Footer */
        .lp-footer { background-color: var(--lp-bg-dark); color: #e5e5e5; padding: 60px 0 30px; }
        .lp-footer-grid { display: flex; flex-direction: column; gap: 40px; margin-bottom: 40px; }
        .lp-footer-brand h3 { color: var(--lp-white); font-size: 1.6rem; margin-bottom: 12px; }
        .lp-footer-brand p { color: #aaa; font-size: 0.95rem; max-width: 320px; }
        .lp-footer-links h4, .lp-footer-contact h4 { color: var(--lp-white); font-size: 1.1rem; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
        .lp-footer-links ul { list-style: none; padding: 0; margin: 0; }
        .lp-footer-links ul li { margin-bottom: 12px; }
        .lp-footer-links a { color: #aaa; text-decoration: none; transition: var(--lp-transition); font-size: 0.95rem; }
        .lp-footer-links a:hover { color: var(--lp-white); padding-left: 4px; }
        .lp-footer-contact p { color: #aaa; font-size: 0.95rem; margin-bottom: 8px; }
        .lp-footer-bottom { border-top: 1px solid #333; padding-top: 24px; text-align: center; font-size: 0.85rem; color: #777; }

        /* Media Queries Desktop */
        @media (min-width: 768px) {
          .lp-hero { flex-direction: row; align-items: center; padding: 80px 24px; }
          .lp-hero-content { flex: 1.2; text-align: left; }
          .lp-hero-title { font-size: 3.2rem; }
          .lp-hero-tags { justify-content: flex-start; }
          .lp-btn { width: auto; }
          .lp-collage { flex: 1; gap: 20px; }
          .lp-collage img { height: 240px; }
          .lp-split-section { flex-direction: row; align-items: center; gap: 60px; }
          .lp-split-section > div { flex: 1; }
          .lp-red-banner-text { font-size: 1.8rem; }
          .lp-schedule { flex-direction: row; justify-content: space-around; }
          .lp-schedule-item { flex: 1; border-right: 1px solid rgba(255,255,255,0.2); }
          .lp-schedule-item:last-child { border-right: none; }
          .lp-modules-grid { flex-direction: row; }
          .lp-module-column { flex: 1; }
          .lp-target-boxes { flex-direction: row; }
          .lp-box { flex: 1; }
          .lp-pricing-grid { flex-direction: row; }
          .lp-price-tier { flex: 1; }
          .lp-footer-grid { flex-direction: row; justify-content: space-between; }
        }
        @media (min-width: 1024px) {
          .lp-hero-title { font-size: 3.8rem; }
          .lp-pricing-card { padding: 50px; }
        }
      `}} />

      {/* =========================================
          CONTEÚDO DA PÁGINA
          ========================================= */}
      <div className="lp-page">
        <main>
          
          {/* 1. HERO SECTION */}
          <section className="lp-container lp-hero">
            <div className="lp-hero-content">
              <h1 className="lp-hero-title lp-text-red">Imersão Gestação Sem Filtro</h1>
              <p className="lp-hero-subtitle">Preparação para Gestação, Parto e Pós-parto</p>
              <p className="lp-hero-text">
                Uma experiência profunda, acolhedora e transformadora para mulheres e casais que desejam viver a maternidade com <strong>consciência, preparo e segurança.</strong>
              </p>
              <h2 className="lp-hero-highlight lp-text-red">
                Mais do que um evento, uma vivência real.
              </h2>
              <p className="lp-hero-text" style={{ fontWeight: '700', color: 'var(--lp-text-dark)' }}>
                APENAS 10 VAGAS! Experiência exclusiva e limitada.
              </p>
              <div className="lp-hero-tags">
                <span>Acolhimento</span> | <span>Informação</span> | <span>Preparação</span> | <span>Confiança</span> | <span>Conexão</span>
              </div>
              <a href="#comprar" className="lp-btn">RESERVAR MINHA VAGA</a>
            </div>
            <div className="lp-collage">
              <img src="/foto-gestante-1.jpg" alt="Mulher grávida recebendo carinho" />
              <img src="/foto-casal-gestante.jpg" alt="Casal aguardando o bebê" />
              <img src="/foto-gestante-2.jpg" alt="Gestante sorrindo durante prática" />
              <img src="/foto-roda-gestantes.jpg" alt="Roda de apoio com gestantes" />
            </div>
          </section>

          {/* 2. INTRODUÇÃO E DORES */}
          <section className="lp-bg-grey">
            <div className="lp-container">
              <div className="lp-split-section">
                <div>
                  <img src="/foto-acolhimento.jpg" alt="Acolhimento humanizado na gestação" className="lp-split-image" />
                </div>
                <div>
                  <ul className="lp-list">
                    <li>Uma experiência íntima e acolhedora;</li>
                    <li>Um passo a passo para entender cada fase do parto;</li>
                    <li>Para que você e seu parceiro se sintam seguros e preparados;</li>
                    <li>Para chegar no dia do nascimento com confiança;</li>
                    <li>Construir o seu plano de parto com autonomia;</li>
                    <li>Um aprendizado com técnicas validadas e práticas reais;</li>
                    <li>Vivendo a maternidade sem filtros e com muito amor.</li>
                  </ul>
                </div>
              </div>

              <div className="lp-split-section">
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>Se você sente que:</h2>
                  <ul className="lp-list">
                    <li>A data do parto está se aproximando e a insegurança está aumentando;</li>
                    <li>Deseja que seu parceiro saiba exatamente como te ajudar no dia;</li>
                    <li>Há muita informação confusa na internet e você quer orientações seguras;</li>
                    <li>Precisa aprender a preparar seu corpo e sua mente para o trabalho de parto;</li>
                    <li>Tem medo da dor e quer conhecer métodos de alívio e respiração;</li>
                    <li>Ouvir os "pitacos" alheios está te deixando mais ansiosa;</li>
                    <li>Gostaria de se conectar com outras mulheres que estão passando pela mesma fase;</li>
                  </ul>
                  <p style={{ marginTop: '20px', fontWeight: '600' }}>Então essa Imersão é o abraço e a preparação que você e seu bebê precisam agora.</p>
                </div>
                <div className="lp-collage">
                  <img src="/foto-dor-1.jpg" alt="Gestante pensativa" />
                  <img src="/foto-dor-2.jpg" alt="Casal conversando" />
                  <img src="/foto-dor-3.jpg" alt="Prática de respiração" />
                  <img src="/foto-dor-4.jpg" alt="Apoio no parto" />
                </div>
              </div>
              
              <h2 style={{ textAlign: 'center', fontSize: '2rem', marginTop: '60px', fontWeight: '700', lineHeight: '1.3' }}>
                O nascimento de um bebê é também<br/>o nascimento de uma nova mulher e de uma família.
              </h2>
            </div>
          </section>

          {/* 3. ENTREGÁVEIS */}
          <section className="lp-container" style={{ padding: '80px 24px' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '24px' }}>O que você vai vivenciar nesta Imersão...</h3>
            <ul className="lp-list">
              <li><strong>MUITO ACOLHIMENTO:</strong> Um ambiente íntimo, seguro e cheio de cuidado para você se sentir abraçada.</li>
              <li><strong>COFFEE BREAK ESPECIAL:</strong> Momentos deliciosos para conexão, troca e descanso.</li>
              <li><strong>APRENDIZADO PROFUNDO:</strong> Técnicas que você só aprenderia com muitos profissionais, reunidas em um só lugar.</li>
              <li><strong>EXERCÍCIOS PARA CADA FASE DO TRABALHO DE PARTO:</strong> Prepare seu corpo e sua mente para cada momento do parto.</li>
              <li><strong>SEU COMPANHEIRO COMO SEU MAIOR ALIADO:</strong> Aprenda como ele pode te apoiar, acolher e fortalecer em cada etapa.</li>
            </ul>
          </section>

          {/* BANNER VERMELHO CENTRAL */}
          <section className="lp-bg-red">
            <div className="lp-container">
              <p className="lp-red-banner-text">
                Essa imersão foi criada para que você saiba exatamente o que esperar, como reagir e como viver a chegada do seu bebê sentindo-se segura, respeitada e fortalecida.
              </p>
            </div>
          </section>

          {/* 4. SEGREDO E METODOLOGIA */}
          <section className="lp-container" style={{ padding: '80px 24px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '20px' }}>Existe um segredo para um parto respeitoso:</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>O melhor caminho para afastar o medo do desconhecido não é ignorá-lo.<br/><strong>É buscar INFORMAÇÃO e PREPARAÇÃO.</strong></p>
            <p>Quando você entende a fisiologia do seu corpo e treina sua mente, o parto deixa de ser um evento assustador e passa a ser um momento de protagonismo seu e do seu bebê.</p>
            
            <h4 style={{ marginTop: '32px', fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px' }}>O que você ganha se preparando com a gente:</h4>
            <ul className="lp-list">
              <li>Consciência corporal para lidar com as contrações;</li>
              <li>Redução drástica do medo e da ansiedade;</li>
              <li>Um parceiro(a) que sabe exatamente o que fazer (massagens, apoio emocional, posições);</li>
              <li>Clareza para tomar decisões importantes na hora do parto;</li>
            </ul>
          </section>

          {/* 5. SOBRE AS PROFISSIONAIS */}
          <section id="sobre" className="lp-bg-grey">
            <div className="lp-container">
              <div className="lp-split-section">
                <div>
                  <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '20px' }}>Quem vai te guiar nessa jornada?</h2>
                  <p style={{ marginBottom: '24px', color: 'var(--lp-text-muted)' }}>Nesta imersão, você será conduzida por duas profissionais especialistas na saúde materno-infantil, unindo corpo e mente para o seu preparo completo:</p>
                  
                  <div style={{ marginBottom: '24px', paddingLeft: '16px', borderLeft: '4px solid var(--lp-primary)' }}>
                    <p style={{ marginBottom: '6px', fontSize: '1.15rem' }}><strong>Erica Vilar – Psicóloga Clínica</strong></p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--lp-text-muted)' }}>Dedicada a cuidar da sua saúde mental e do preparo emocional. Erica vai te ajudar a lidar com os medos, quebrar crenças limitantes sobre a dor, acolher suas ansiedades e fortalecer o seu emocional para o parto e puerpério.</p>
                  </div>

                  <div style={{ marginBottom: '24px', paddingLeft: '16px', borderLeft: '4px solid var(--lp-primary)' }}>
                    <p style={{ marginBottom: '6px', fontSize: '1.15rem' }}><strong>Lizia Nascimento – Fisioterapeuta e Doula</strong></p>
                    <p style={{ fontSize: '0.95rem', color: 'var(--lp-text-muted)' }}>Especialista na preparação física do seu corpo. Lizia vai te guiar através da biomecânica do parto, técnicas de respiração, alívio não farmacológico da dor e exercícios fundamentais para a gestação.</p>
                  </div>

                  <p style={{ fontWeight: '600', marginTop: '24px' }}>O corpo e a mente trabalhando juntos:</p>
                  <p style={{ color: 'var(--lp-text-muted)' }}>Nós criamos a <strong>Gestação Sem Filtro</strong> para unir o melhor da psicologia e da fisioterapia em uma experiência imersiva, garantindo a recepção mais amorosa possível para seu bebê.</p>
                </div>
                <div>
                  <img src="/erica-e-lizia.jpg" alt="Erica Vilar e Lizia Nascimento juntas" className="lp-split-image" />
                </div>
              </div>
            </div>
          </section>

          {/* 6. NOVO: SEÇÃO DO LOCAL DA IMERSÃO */}
          <section id="local" className="lp-container" style={{ padding: '80px 24px' }}>
            <div className="lp-split-section" style={{ flexDirection: 'row-reverse' }}> {/* Inverte os lados no desktop para variar o design */}
              
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '20px' }}>Um ambiente pensado para você</h2>
                <p style={{ marginBottom: '24px', color: 'var(--lp-text-muted)', fontSize: '1.1rem' }}>A Imersão Gestação Sem Filtro acontecerá em um espaço exclusivo, escolhido a dedo para proporcionar o máximo de conforto, segurança e acolhimento que você e seu bebê merecem.</p>
                
                <ul className="lp-list">
                  <li><strong>Climatização e Conforto:</strong> Espaço adaptado para gestantes, com assentos macios, pufes e almofadas.</li>
                  <li><strong>Intimidade e Privacidade:</strong> O ambiente perfeito e restrito para trocas profundas, sem interrupções externas.</li>
                  <li><strong>Estrutura Completa:</strong> Materiais práticos para os exercícios e uma área aconchegante para o nosso Coffee Break Especial.</li>
                  <li><strong>Localização Privilegiada:</strong> Bairro seguro, de fácil acesso e com muita tranquilidade para o seu fim de semana.</li>
                </ul>
                
                <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--lp-primary-light)', borderLeft: '4px solid var(--lp-primary)', borderRadius: '0 8px 8px 0' }}>
                  <p style={{ fontWeight: '700', color: 'var(--lp-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📍</span> 
                    [Nome do Espaço - Ex: Edifício Office, Ponta Verde, Maceió - AL]
                  </p>
                </div>
              </div>

              <div className="lp-collage" style={{ flex: 1 }}>
                <img src="/local-imersao-1.jpg" alt="Fachada ou sala principal do local" />
                <img src="/local-imersao-2.jpg" alt="Detalhe do conforto e poltronas" />
                <img src="/local-imersao-3.jpg" alt="Espaço preparado para exercícios" />
                <img src="/local-imersao-4.jpg" alt="Mesa de coffee break carinhosa" />
              </div>

            </div>
          </section>

          {/* 7. CRONOGRAMA */}
          <section className="lp-bg-red">
            <div className="lp-container">
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '10px' }}>QUANDO VAI ACONTECER</h2>
              <div className="lp-schedule">
                <div className="lp-schedule-item">
                  <div className="lp-schedule-icon">📅</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>[Data do Evento]</h3>
                  <p style={{ opacity: '0.8' }}>De [Horário Início] às [Horário Fim]</p>
                </div>
                <div className="lp-schedule-item">
                  <div className="lp-schedule-icon">📍</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Presencial e Exclusivo</h3>
                  <p style={{ opacity: '0.8' }}>[Cidade/Bairro do Evento]</p>
                </div>
                <div className="lp-schedule-item">
                  <div className="lp-schedule-icon">👥</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Vagas Limitadas</h3>
                  <p style={{ opacity: '0.8' }}>Apenas 10 Vagas!</p>
                </div>
              </div>
            </div>
          </section>

          {/* 8. MÓDULOS */}
          <section id="conteudo" className="lp-container" style={{ padding: '80px 24px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '700', marginBottom: '12px' }}>O Que Vamos Abordar na Imersão</h2>
            <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px', color: 'var(--lp-text-muted)' }}>Uma imersão com todas as ferramentas físicas e emocionais que você precisa para uma gestação, parto e pós-parto mais conscientes.</p>

            <div className="lp-modules-grid">
              <div className="lp-module-column">
                <div className="lp-module-title">🌸 FASE 1 - A GESTAÇÃO E O PREPARO</div>
                <details className="lp-accordion">
                  <summary>Desmitificando o Parto: O Fim dos Medos</summary>
                  <p>Entendendo a fisiologia do corpo com a fisio e trabalhando os medos reais e imaginários com a psicologia.</p>
                </details>
                <details className="lp-accordion">
                  <summary>O Papel Fundamental do Acompanhante</summary>
                  <p>Como o parceiro(a) deve agir antes, durante e depois das contrações, sendo apoio físico e emocional ativo.</p>
                </details>
                <details className="lp-accordion">
                  <summary>Plano de Parto e Escolhas Conscientes</summary>
                  <p>Construindo suas preferências médicas e entendendo intervenções com profundo embasamento técnico.</p>
                </details>
              </div>

              <div className="lp-module-column">
                <div className="lp-module-title">🔥 FASE 2 - O PARTO E PÓS-PARTO REAL</div>
                <details className="lp-accordion">
                  <summary>A Prática: Exercícios e Posições</summary>
                  <p>Dinâmicas de movimento, bola suíça, alívio não farmacológico da dor e uso da respiração guiada a seu favor.</p>
                </details>
                <details className="lp-accordion">
                  <summary>A Hora de Ir para a Maternidade</summary>
                  <p>Como identificar os sinais do trabalho de parto ativo e a hora certa de sair de casa sem desespero.</p>
                </details>
                <details className="lp-accordion">
                  <summary>Puerpério: A Maternidade Sem Filtro</summary>
                  <p>Os primeiros dias em casa, alterações hormonais/emocionais, amamentação e o suporte para o novo ecossistema familiar.</p>
                </details>
              </div>
            </div>
          </section>

          {/* 9. PÚBLICO ALVO */}
          <section className="lp-bg-grey">
            <div className="lp-container">
              <div className="lp-target-boxes">
                <div className="lp-box lp-box-green">
                  <h3>Esta Imersão É Para Você Se...</h3>
                  <ul>
                    <li><span className="lp-icon-check">✔</span> Você está gestante (em qualquer trimestre) e quer se preparar de verdade...</li>
                    <li><span className="lp-icon-check">✔</span> Você deseja que o seu parceiro(a) saiba como te ajudar ativamente...</li>
                    <li><span className="lp-icon-check">✔</span> Você tem medo da dor e quer aprender técnicas de alívio natural...</li>
                    <li><span className="lp-icon-check">✔</span> Você quer fugir de cesáreas desnecessárias e buscar um parto respeitoso...</li>
                    <li><span className="lp-icon-check">✔</span> Você quer cuidar da sua mente e do seu corpo simultaneamente...</li>
                  </ul>
                </div>
                <div className="lp-box lp-box-red">
                  <h3>ESTA IMERSÃO NÃO É PARA VOCÊ SE:</h3>
                  <ul>
                    <li><span className="lp-icon-cross">✖</span> Você não está disposta a dedicar um tempo prático para a sua gestação</li>
                    <li><span className="lp-icon-cross">✖</span> Você prefere delegar todas as decisões do seu parto sem participar ativamente</li>
                    <li><span className="lp-icon-cross">✖</span> Você não acredita na conexão direta entre preparo físico e fortalecimento emocional</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 10. PREÇO E OFERTA */}
          <section id="comprar" className="lp-pricing-wrapper">
            <div className="lp-pricing-card">
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '8px' }}>Apenas 10 Vagas Disponíveis!</h2>
              <p style={{ color: 'var(--lp-text-muted)', marginBottom: '32px' }}>Garanta seu lugar nesta experiência exclusiva com as duas especialistas.</p>
              
              <div className="lp-pricing-grid">
                {/* Opção Individual */}
                <div className="lp-price-tier">
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🤰</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--lp-primary)', margin: '0' }}>INDIVIDUAL</h3>
                  <div className="lp-price-value">R$197</div>
                  <a href="#" className="lp-btn">COMPRAR INDIVIDUAL</a>
                </div>

                {/* Opção Casal */}
                <div className="lp-price-tier">
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>💑</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--lp-primary)', margin: '0' }}>CASAL</h3>
                  <div className="lp-price-value">R$297</div>
                  <a href="#" className="lp-btn">COMPRAR CASAL</a>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block', fontSize: '0.95rem', color: 'var(--lp-text-muted)' }}>
                <li style={{ marginBottom: '8px' }}>• Imersão Profunda com Psicóloga e Fisioterapeuta/Doula</li>
                <li style={{ marginBottom: '8px' }}>• Coffee Break Especial Incluso</li>
                <li style={{ marginBottom: '8px' }}>• Material de Apoio Exclusivo</li>
                <li>• Muito Acolhimento e Conexão Real</li>
              </ul>
            </div>
          </section>

          {/* 11. FAQ */}
          <section className="lp-container" style={{ padding: '80px 24px', maxWidth: '800px' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: '700', marginBottom: '40px' }}>Dúvidas Frequentes</h2>
            
            <details className="lp-accordion">
              <summary>Estou com poucas semanas de gestação, posso participar?</summary>
              <p>Com certeza! Quanto mais cedo você começar a se informar e se preparar física e emocionalmente, mais tranquila será a sua jornada até o parto.</p>
            </details>
            <details className="lp-accordion">
              <summary>Meu parceiro(a) não quer ou não pode ir. Posso ir sozinha?</summary>
              <p>Sim! O Ingresso Individual foi pensado exatamente para você. Todo o conteúdo será profundamente transformador, mesmo indo sozinha ou levando sua mãe/amiga (basta adquirir ingresso para elas, se desejarem ir juntas).</p>
            </details>
            <details className="lp-accordion">
              <summary>Vou ter meu bebê por cesárea agendada, a imersão serve para mim?</summary>
              <p>Sim. A imersão aborda a conexão com o bebê, o preparo emocional, o manejo do medo e a realidade do puerpério, vivências essenciais independente da via de parto.</p>
            </details>
            <details className="lp-accordion">
              <summary>Como funciona o pagamento?</summary>
              <p>Você pode pagar via PIX ou parcelar no cartão de crédito através da plataforma segura clicando nos botões acima.</p>
            </details>
          </section>
        </main>

        {/* 12. PREMIUM FOOTER */}
        <footer className="lp-footer">
          <div className="lp-container">
            <div className="lp-footer-grid">
              
              <div className="lp-footer-brand">
                <h3>Gestação Sem Filtro</h3>
                <p>A união perfeita entre o preparo físico e o fortalecimento emocional para a chegada consciente do seu bebê.</p>
              </div>
              
              <div className="lp-footer-links">
                <h4>Navegação</h4>
                <ul>
                  <li><a href="#sobre">As Profissionais</a></li>
                  <li><a href="#local">O Local</a></li>
                  <li><a href="#conteudo">Conteúdo Programático</a></li>
                  <li><a href="#comprar">Garantir Ingresso</a></li>
                </ul>
              </div>

              <div className="lp-footer-links">
                <h4>Siga as Facilitadoras</h4>
                <ul>
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">@ericavilar.psi</a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">@lizianascimento.fisio</a></li>
                </ul>
              </div>

              <div className="lp-footer-contact">
                <h4>Dúvidas ou Suporte?</h4>
                <p>E-mail: contato@gestaosemfiltro.com.br</p>
                <p>WhatsApp: (82) 99999-9999</p>
              </div>

            </div>

            <div className="lp-footer-bottom">
              <p>&copy; {new Date().getFullYear()} Gestação Sem Filtro. Todos os direitos reservados.</p>
              <p style={{ marginTop: '8px', opacity: 0.5 }}>Feito com respeito e cuidado para futuras mães e famílias.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}