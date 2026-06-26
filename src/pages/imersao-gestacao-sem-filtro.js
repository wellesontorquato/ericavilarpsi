import React from 'react';

export default function ImersaoGestacaoSemFiltro() {
  return (
    <div className="lp-page">
      
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
          <p className="lp-hero-text" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            APENAS 10 VAGAS! Experiência exclusiva e limitada.
          </p>
          <div className="lp-hero-tags">
            <span>Acolhimento</span> | <span>Informação</span> | <span>Preparação</span> | <span>Confiança</span> | <span>Conexão</span>
          </div>
          <a href="#comprar" className="lp-btn">RESERVAR MINHA VAGA</a>
        </div>
        <div className="lp-collage">
          {/* Substitua os src pelas suas imagens reais */}
          <img src="/foto-gestante-1.jpg" alt="Mulher grávida" />
          <img src="/foto-casal-gestante.jpg" alt="Casal aguardando o bebê" />
          <img src="/foto-gestante-2.jpg" alt="Gestante sorrindo" />
          <img src="/foto-roda-gestantes.jpg" alt="Roda de gestantes" />
        </div>
      </section>

      {/* 2. INTRODUÇÃO E DORES (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <div className="lp-split-section">
            <div>
              <img src="/foto-acolhimento.jpg" alt="Acolhimento na gestação" className="lp-split-image" />
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
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Se você sente que:</h2>
              <ul className="lp-list">
                <li>A data do parto está se aproximando e a insegurança está aumentando;</li>
                <li>Deseja que seu parceiro saiba exatamente como te ajudar no dia;</li>
                <li>Há muita informação confusa na internet e você quer orientações seguras;</li>
                <li>Precisa aprender a preparar seu corpo e sua mente para o trabalho de parto;</li>
                <li>Tem medo da dor e quer conhecer métodos de alívio e respiração;</li>
                <li>Ouvir os "pitacos" alheios está te deixando mais ansiosa;</li>
                <li>Gostaria de se conectar com outras mulheres que estão passando pela mesma fase;</li>
                <li>Quer construir uma base sólida para um pós-parto mais leve e real.</li>
              </ul>
              <p style={{ marginTop: '20px' }}>Então essa Imersão é o abraço e a preparação que você e seu bebê precisam agora.</p>
            </div>
            <div className="lp-collage">
              <img src="/foto-dor-1.jpg" alt="Gestante pensativa" />
              <img src="/foto-dor-2.jpg" alt="Casal conversando" />
              <img src="/foto-dor-3.jpg" alt="Prática de respiração" />
              <img src="/foto-dor-4.jpg" alt="Apoio no parto" />
            </div>
          </div>
          
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginTop: '60px' }}>
            O nascimento de um bebê é também<br/>o nascimento de uma nova mulher e de uma família.
          </h2>
        </div>
      </section>

      {/* 3. ENTREGÁVEIS */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h3 style={{ marginBottom: '20px' }}>O que você vai vivenciar nesta Imersão...</h3>
        <ul className="lp-list">
          <li><strong>MUITO ACOLHIMENTO:</strong> Um ambiente íntimo, seguro e cheio de cuidado para você se sentir abraçada.</li>
          <li><strong>COFFEE BREAK ESPECIAL:</strong> Momentos deliciosos para conexão, troca e descanso.</li>
          <li><strong>APRENDIZADO PROFUNDO:</strong> Técnicas que você só aprenderia com muitos profissionais, reunidas em um só lugar.</li>
          <li><strong>EXERCÍCIOS PARA CADA FASE DO TRABALHO DE PARTO:</strong> Prepare seu corpo e sua mente para cada momento do parto, com práticas que realmente fazem a diferença.</li>
          <li><strong>SEU COMPANHEIRO COMO SEU MAIOR ALIADO:</strong> Aprenda como ele pode te apoiar, acolher e fortalecer em cada etapa.</li>
        </ul>
        <p style={{ marginTop: '20px' }}>Tudo isso organizado numa metodologia prática para transformar o medo em força e a ansiedade em preparo.</p>
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
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Existe um segredo para um parto respeitoso:</h2>
        <p>O melhor caminho para afastar o medo do desconhecido não é ignorá-lo.<br/><strong>É buscar INFORMAÇÃO e PREPARAÇÃO.</strong><br/>Você sabe por quê?</p>
        <p>Quando você entende a fisiologia do seu corpo e treina sua mente, o parto deixa de ser um evento assustador e passa a ser um momento de protagonismo seu e do seu bebê.</p>
        
        <h4 style={{ marginTop: '30px' }}>O que você ganha se preparando com a gente:</h4>
        <ul className="lp-list">
          <li>Consciência corporal para lidar com as contrações;</li>
          <li>Redução drástica do medo e da ansiedade;</li>
          <li>Um parceiro(a) que sabe exatamente o que fazer (massagens, apoio emocional, posições);</li>
          <li>Clareza para tomar decisões importantes na hora do parto;</li>
          <li>Rede de apoio com outros casais e profissionais qualificados.</li>
        </ul>
      </section>

      {/* MERCADO (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Chega de romantização irreal!!!</h2>
          <h3 className="lp-text-red" style={{ marginBottom: '20px' }}>Você merece viver uma gestação sem filtro e com verdade!!</h3>
          <p>Talvez você esteja consumindo muito conteúdo na internet e se sentindo ainda mais perdida...</p>
          <p><strong>Gestantes em Busca de Confiança.</strong></p>
          <p>As mulheres estão cansadas de ouvir histórias traumáticas ou versões romantizadas demais.<br/>Há momentos em que a mente pede clareza...<br/>Casais querendo se reconectar antes da chegada do bebê.<br/>Mulheres buscando acolhimento e escuta ativa.</p>
          
          <p><strong>Elas procuram ESPAÇOS SEGUROS de preparação.</strong></p>
          <p>Espaços para tirar dúvidas sem julgamentos. Falar sobre medos reais.<br/>Praticar posições, respirações e dinâmicas de casal.<br/>Apoio especializado para despertar a força que já existe em você.</p>
          
          <p style={{ marginTop: '30px' }}>E o melhor: <strong>você não está sozinha.</strong><br/>Você constrói esse caminho ao lado de quem vai estar segurando a sua mão no grande dia.</p>
          <p>A pergunta não é "será que vou dar conta?"<br/><strong>A pergunta é: "como posso me preparar para viver isso da melhor forma possível?"</strong></p>
        </div>
      </section>

      {/* 5. SOBRE AS PROFISSIONAIS (ATUALIZADO) */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <div className="lp-split-section">
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Quem vai te guiar nessa jornada?</h2>
            <p>Nesta imersão, você será conduzida por duas profissionais especialistas na saúde materno-infantil, unindo corpo e mente para o seu preparo completo:</p>
            
            <div style={{ marginTop: '20px', marginBottom: '20px', paddingLeft: '15px', borderLeft: '4px solid #9B0000' }}>
              <p style={{ marginBottom: '10px' }}><strong>Erica Vilar – Psicóloga Clínica</strong></p>
              <p style={{ fontSize: '0.95rem' }}>Dedicada a cuidar da sua saúde mental e do preparo emocional para a chegada do bebê. Erica vai te ajudar a lidar com os medos, quebrar crenças limitantes sobre a dor, acolher suas ansiedades e fortalecer o seu emocional para o parto e puerpério.</p>
            </div>

            <div style={{ marginTop: '20px', marginBottom: '20px', paddingLeft: '15px', borderLeft: '4px solid #9B0000' }}>
              <p style={{ marginBottom: '10px' }}><strong>Lizia Nascimento – Fisioterapeuta e Doula</strong></p>
              <p style={{ fontSize: '0.95rem' }}>Especialista na preparação física do seu corpo. Lizia vai te guiar através da biomecânica do parto, técnicas de respiração, alívio não farmacológico da dor e exercícios fundamentais para a gestação e hora do nascimento.</p>
            </div>

            <p><strong>O corpo e a mente trabalhando juntos:</strong></p>
            <p>Nós percebemos que não adianta o corpo estar pronto se a mente estiver cheia de medos. Juntas, criamos a <strong>Gestação Sem Filtro</strong> para unir o melhor da psicologia e da fisioterapia em uma experiência imersiva, garantindo que você e seu bebê tenham a recepção mais amorosa e segura possível.</p>
          </div>
          <div>
            {/* Sugestão: Uma foto bonita das duas juntas ou uma colagem das duas */}
            <img src="/erica-e-lizia.jpg" alt="Erica Vilar e Lizia Nascimento" className="lp-split-image" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      </section>

      {/* 6. CRONOGRAMA (BANNER VERMELHO) */}
      <section className="lp-bg-red">
        <div className="lp-container">
          <h2>QUANDO E ONDE VAI ACONTECER</h2>
          <div className="lp-schedule">
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">📅</div>
              <h3>[Data do Evento]</h3>
              <p>De [Horário Início] às [Horário Fim]</p>
            </div>
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">📍</div>
              <h3>Presencial e Exclusivo</h3>
              <p>[Local do Evento / Cidade]</p>
            </div>
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">👥</div>
              <h3>Vagas Limitadas</h3>
              <p>Apenas 10 Vagas!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MÓDULOS */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem' }}>O Que Vamos Abordar na Imersão</h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>Uma imersão com todas as ferramentas físicas e emocionais que você precisa para uma gestação, parto e pós-parto mais conscientes.</p>

        <div className="lp-modules-grid">
          {/* Coluna 1 */}
          <div className="lp-module-column">
            <div className="lp-module-title">🌸 FASE 1 - A GESTAÇÃO E O PREPARO</div>
            
            <details className="lp-accordion">
              <summary>Desmitificando o Parto: O Fim dos Medos</summary>
              <p>Entendendo a fisiologia do corpo com a fisio e trabalhando os medos reais e imaginários com a psicologia.</p>
            </details>
            <details className="lp-accordion">
              <summary>O Papel Fundamental do Acompanhante</summary>
              <p>Como o parceiro(a) deve agir antes, durante e depois das contrações, sendo apoio físico e emocional.</p>
            </details>
            <details className="lp-accordion">
              <summary>Plano de Parto e Escolhas Conscientes</summary>
              <p>Construindo suas preferências médicas e entendendo intervenções com embasamento técnico.</p>
            </details>
          </div>

          {/* Coluna 2 */}
          <div className="lp-module-column">
            <div className="lp-module-title">🔥 FASE 2 - O PARTO E PÓS-PARTO REAL</div>
            
            <details className="lp-accordion">
              <summary>A Prática: Exercícios e Posições</summary>
              <p>Dinâmicas de movimento, bola suíça, alívio não farmacológico da dor e uso da respiração a seu favor.</p>
            </details>
            <details className="lp-accordion">
              <summary>A Hora de Ir para a Maternidade</summary>
              <p>Como identificar o trabalho de parto ativo e a hora certa de sair de casa sem desespero.</p>
            </details>
            <details className="lp-accordion">
              <summary>Puerpério: A Maternidade Sem Filtro</summary>
              <p>Os primeiros dias em casa, alterações emocionais, amamentação e o suporte para a nova configuração familiar.</p>
            </details>
          </div>
        </div>
      </section>

      {/* 8. PÚBLICO ALVO E AVISOS (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <div className="lp-target-boxes">
            <div className="lp-box lp-box-green">
              <h3>Esta Imersão É Para Você Se...</h3>
              <ul>
                <li><span className="lp-icon-check">✔</span> Você está gestante (em qualquer idade gestacional) e quer se preparar...</li>
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
                <li><span className="lp-icon-cross">✖</span> Você não acredita na conexão entre preparo físico e emocional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PREÇO E OFERTA */}
      <section id="comprar" className="lp-pricing-wrapper">
        <div className="lp-pricing-card">
          <h2 style={{ marginBottom: '10px' }}>Apenas 10 Vagas Disponíveis!</h2>
          <p style={{ color: '#777', marginBottom: '30px' }}>Garanta seu lugar nesta experiência exclusiva com duas especialistas.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '30px' }}>
            {/* Opção Individual */}
            <div style={{ background: '#FFF6F6', padding: '30px', borderRadius: '12px', border: '2px solid #FAD1D1', flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '3rem' }}>🤰</div>
              <h3 style={{ margin: '10px 0', color: '#9B0000' }}>INDIVIDUAL</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>R$197</div>
              <a href="#" className="lp-btn" style={{ width: '100%', marginTop: '20px', padding: '12px 20px', fontSize: '0.9rem' }}>COMPRAR INDIVIDUAL</a>
            </div>

            {/* Opção Casal */}
            <div style={{ background: '#FFF6F6', padding: '30px', borderRadius: '12px', border: '2px solid #FAD1D1', flex: '1', minWidth: '200px' }}>
              <div style={{ fontSize: '3rem' }}>💑</div>
              <h3 style={{ margin: '10px 0', color: '#9B0000' }}>CASAL</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#333' }}>R$297</div>
              <a href="#" className="lp-btn" style={{ width: '100%', marginTop: '20px', padding: '12px 20px', fontSize: '0.9rem' }}>COMPRAR CASAL</a>
            </div>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block', fontSize: '1rem', color: '#555' }}>
            <li>• Imersão Profunda e Prática com Psicóloga e Fisioterapeuta/Doula</li>
            <li>• Coffee Break Especial Incluso</li>
            <li>• Material de Apoio</li>
            <li>• Muito Acolhimento e Conexão</li>
          </ul>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="lp-container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>Dúvidas Frequentes</h2>
        
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
          <summary>Onde vai ser o evento?</summary>
          <p>O evento será realizado em [Preencher Localização], em um ambiente totalmente pensado e preparado para o conforto das gestantes.</p>
        </details>
        <details className="lp-accordion">
          <summary>Como funciona o pagamento?</summary>
          <p>Você pode pagar via PIX ou parcelar no cartão de crédito através da plataforma segura clicando nos botões acima.</p>
        </details>
      </section>

      {/* 11. FOOTER */}
      <footer style={{ backgroundColor: '#222', color: '#FFF', padding: '50px 20px 20px 20px', marginTop: '40px' }}>
        <div className="lp-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <h3 style={{ color: '#FAD1D1', fontSize: '1.8rem', marginBottom: '10px' }}>Gestação Sem Filtro</h3>
          <p style={{ maxWidth: '500px', color: '#BBB', marginBottom: '30px' }}>
            A união perfeita entre o preparo físico e o fortalecimento emocional para a chegada do seu bebê.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            {/* Substitua os links pelos instagrams delas se desejar */}
            <a href="#" style={{ color: '#FFF', textDecoration: 'none', borderBottom: '1px solid #FFF' }}>Instagram Erica Vilar</a>
            <a href="#" style={{ color: '#FFF', textDecoration: 'none', borderBottom: '1px solid #FFF' }}>Instagram Lizia Nascimento</a>
          </div>

          <div style={{ width: '100%', borderTop: '1px solid #444', paddingTop: '20px', color: '#888', fontSize: '0.85rem' }}>
            <p>&copy; {new Date().getFullYear()} Gestação Sem Filtro. Todos os direitos reservados.</p>
            <p style={{ marginTop: '5px' }}>Desenvolvido com carinho para mães e casais.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}