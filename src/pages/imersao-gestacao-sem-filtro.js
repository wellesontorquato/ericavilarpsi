import React from 'react';

export default function ImersaoMulheres() {
  return (
    <div className="lp-page">
      
      {/* 1. HERO SECTION */}
      <section className="lp-container lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-hero-title lp-text-red">Imersão Mulheres em Círculos</h1>
          <p className="lp-hero-subtitle">10 e 11 de Julho | Evento 100% Online</p>
          <p className="lp-hero-text">
            Aprenda a facilitar grupos transformadores, que já impactaram a vida de milhares de mulheres, e descubra porque este é o <strong>melhor caminho</strong> e o mais rápido para seu crescimento profissional.
          </p>
          <h2 className="lp-hero-highlight lp-text-red">
            Em 2 Dias, Crie do zero Seu Primeiro Círculo de Mulheres, ou expanda o seu trabalho atual.
          </h2>
          <p className="lp-hero-text">
            Trilhe o caminho que mais de 2.500 mulheres trilharam para começar seus Círculos Femininos, mesmo sem experiência, e muitas sem serem psicólogas.
          </p>
          <div className="lp-hero-tags">
            <span>AO VIVO</span> | <span>ONLINE</span> | <span>VAGAS LIMITADAS</span>
          </div>
          <a href="#comprar" className="lp-btn">GARANTIR MEU INGRESSO</a>
        </div>
        <div className="lp-collage">
          {/* Substitua os src pelas suas imagens */}
          <img src="/foto-hero-1.jpg" alt="Mentora" />
          <img src="/foto-hero-2.jpg" alt="Mentora e aluna" />
          <img src="/foto-hero-3.jpg" alt="Mentora sorrindo" />
          <img src="/foto-hero-4.jpg" alt="Mentora palestrando" />
        </div>
      </section>

      {/* 2. INTRODUÇÃO E DORES (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <div className="lp-split-section">
            <div>
              <img src="/foto-roda-mulheres.jpg" alt="Roda de mulheres" className="lp-split-image" />
            </div>
            <div>
              <ul className="lp-list">
                <li>Uma imersão ao vivo;</li>
                <li>Um passo a passo começando do zero;</li>
                <li>Para que você saiba exatamente para onde ir ajudando mulheres;</li>
                <li>Para chegar naquele lugar que você sempre sonhou;</li>
                <li>Construir o seu trabalho se sentindo segura;</li>
                <li>Um trabalho com autoria e todas as ferramentas que você precisa;</li>
                <li>Recebendo por isso de forma justa e próspera.</li>
              </ul>
            </div>
          </div>

          <div className="lp-split-section">
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Se você sente que:</h2>
              <ul className="lp-list">
                <li>Você não aguenta mais o trabalho que vem fazendo;</li>
                <li>Você deseja fazer uma transição de carreira;</li>
                <li>Ajudar outras mulheres a curar seu feminino, e poder liderar essas mulheres é um sonho pra você;</li>
                <li>Precisa aprender a abrir as portas da sua vida para a prosperidade;</li>
                <li>Precisa de um caminho profissional claro e seguro, com ferramentas e um passo a passo;</li>
                <li>A vida anda travada e você não sabe mais o que fazer;</li>
                <li>Os mesmos padrões continuam se repetindo;</li>
                <li>Deseja se sentir apoiada por outras mulheres, para crescer profissionalmente;</li>
                <li>Gostaria de ter uma mentora que te mostrasse um caminho mais fácil e ao mesmo tempo profundo;</li>
                <li>Ou há um chamado silencioso por mudança.</li>
              </ul>
              <p style={{ marginTop: '20px' }}>Então talvez essa seja a hora de acolher esse chamado com carinho.<br/>E deixar que algo novo comece a brotar de dentro.</p>
            </div>
            <div className="lp-collage">
              <img src="/foto-dor-1.jpg" alt="Mentora meditacao" />
              <img src="/foto-dor-2.jpg" alt="Mentora no quadro" />
              <img src="/foto-dor-3.jpg" alt="Mentora com microfone" />
              <img src="/foto-dor-4.jpg" alt="Mentora palestrando longe" />
            </div>
          </div>
          
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginTop: '60px' }}>
            Você só leva outra mulher até onde<br/>você foi dentro de si mesma
          </h2>
        </div>
      </section>

      {/* 3. ENTREGÁVEIS */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h3 style={{ marginBottom: '20px' }}>Por isso vou te entregar...</h3>
        <ul className="lp-list">
          <li>Um método prático de desenvolvimento humano para ajudar mulheres de forma efetiva.</li>
          <li>Mentoria com psicologia feminina profunda e ferramentas práticas, para finalmente se tornar uma Líder de Mulheres inspiradora, com um trabalho competente e humano.</li>
          <li>Ferramentas para reencontrar o seu eixo, seu equilíbrio e sua felicidade.</li>
          <li>Apoio coletivo em jornadas já guiadas com outras Mulheres Líderes, para você fazer parte de um Movimento de Mulheres despertas, que desejam se melhorar e melhorar o mundo.</li>
          <li>Orientação e posicionamento claro para você receber de forma justa pelo seu trabalho.</li>
        </ul>
        <p style={{ marginTop: '20px' }}>Tudo isso organizado numa metodologia que já foi testada por mais de 2.500 mentorandas que hoje trabalham com mulheres de forma potente e humana.</p>
      </section>

      {/* BANNER VERMELHO CENTRAL */}
      <section className="lp-bg-red">
        <div className="lp-container">
          <p className="lp-red-banner-text">
            Essa imersão foi criada para que você saiba exatamente para onde ir, e como chegar naquele lugar que você sempre sonhou, se sentindo segura e recebendo por isso de forma justa e próspera.
          </p>
        </div>
      </section>

      {/* 4. SEGREDO E METODOLOGIA */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Existe um segredo que poucas sabem:</h2>
        <p>O caminho mais potente para começar não é o atendimento individual.<br/><strong>É trabalhar com grupos.</strong><br/>Você sabe por quê?</p>
        <p>A metodologia que eu criei te possibilita ter um roteiro validado e seguro (uma "receita de bolo") com todas as etapas, tempo, vivências, objetivos e tudo o que você precisa, <strong>adaptado para qualquer tipo de grupos femininos</strong>.</p>
        
        <h4 style={{ marginTop: '30px' }}>O que você ganha trabalhando com grupos:</h4>
        <ul className="lp-list">
          <li>Resultados muito mais rápidos</li>
          <li>Espaços femininos de apoio mútuo que permitem transformações profundas e reais</li>
          <li>Você aprende na prática a exercer sua Liderança Feminina</li>
          <li>Ganho financeiro multiplicado, com menos horas de trabalho que no atendimento uma um.</li>
          <li>Qualidade de vida, com tempo para si e para sua família.</li>
        </ul>

        <h4 style={{ marginTop: '30px' }}>Uma metodologia para a sua expansão profissional</h4>
        <ul className="lp-list" style={{ listStyleType: 'none' }}>
          <li>Não precisa de consultório</li>
          <li>Não precisa de anos de formação</li>
          <li>Pode começar online, trabalhando com mulheres do mundo todo</li>
          <li>Pode trabalhar de casa, organizando seu tempo</li>
          <li>Investimento inicial muito menor</li>
        </ul>
        
        <h4 style={{ marginTop: '30px' }}>Validação em menos tempo</h4>
        <p>Em 30 dias você já aplicou o que funciona para mais de 2.500 Mulheres Líderes<br/>Possibilidade de receber um retorno real de múltiplas mulheres para melhorar seu trabalho<br/>Você constrói seu caminho profissional mais rápido, com autoridade verdadeira</p>

        <h4 style={{ marginTop: '30px' }}>Pensa comigo...</h4>
        <p>As maiores referências que nos inspiram no desenvolvimento humano não impactaram milhares de pessoas fazendo atendimento individual.</p>
        <p><strong>Elas se tornaram referências liderando GRUPOS.</strong><br/>Workshops. Vivências. Círculos. Retiros. Imersões.</p>
        <p><strong>E você pode começar esse caminho na Imersão Mulheres em Círculo.</strong></p>
      </section>

      {/* MERCADO (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>As Mulheres estão sacudindo o Mercado!!!</h2>
          <h3 className="lp-text-red" style={{ marginBottom: '20px' }}>Elas são as que mais investem em transformação pessoal e profissional!!</h3>
          <p>Talvez você ainda esteja pensando que "precisa de mais uma formação"<br/>Mas existe um movimento gigantesco acontecendo no Brasil e no mundo...</p>
          <p><strong>Mulheres em Busca de (Re)Conexão.</strong></p>
          <p>As mulheres estão cansadas de viver no automático.<br/>Há momentos em que a alma pede mais...<br/>Mulheres querendo se reconectar consigo mesmas.<br/>Mulheres buscando pertencimento, acolhimento, transformação.</p>
          <p>Mulheres que querem sua Liberdade Financeira.<br/><strong>E sabe o que elas mais procuram?</strong></p>
          <p>Não é terapia individual (que às vezes parece muito cara, muito demorada).<br/>Não é coaching (que muitas vezes está desgastado e mal compreendido, visto como um caminho corporativo ou superficial).</p>
          <p><strong>Elas procuram ESPAÇOS SEGUROS com outras mulheres.</strong></p>
          <p>Espaços de fala e escuta, partilhas e reconexão com sua história, emoção e replanejamento de vida.<br/>Círculos. Grupos. Rodas. Encontros.<br/>Apoio coletivo para despertarem e aprenderem a finalmente cuidar de si mesmas.</p>
          
          <div style={{ marginTop: '30px' }}>
            <p><strong>Os números nos impressionam:</strong></p>
            <ul>
              <li><strong>Busca por "círculos de mulheres" cresceu 340% nos últimos 3 anos</strong></li>
              <li><strong>Mais de 80% das participantes voltam para novos círculos</strong></li>
              <li><strong>Ticket médio: R$ 100 a R$ 200 por encontro</strong></li>
            </ul>
          </div>

          <p style={{ marginTop: '30px' }}>E o melhor: <strong>você não compete com ninguém.</strong><br/>Você constrói um trabalho com a sua essência.<br/>Cada facilitadora tem sua energia única. Seu jeito único de conduzir.</p>
          <p><strong>As mulheres únicas, esperando por você especificamente, que aprenderão com você.</strong></p>
          <p>A pergunta não é "será que tem espaço para mim?"<br/><strong>A pergunta é: "até quando vou ter medo de seguir este chamado?"</strong></p>
        </div>
      </section>

      {/* 5. SOBRE A AUTORA */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <div className="lp-split-section">
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Meu nome é Anna Patricia Chagas.</h2>
            <p>E há 23 anos, eu estava exatamente onde você está agora.<br/>Perdida. Querendo fazer a diferença. Sem saber por onde começar.<br/>Eu já era psicóloga, eu já tinha um consultório cheio. Tinha responsabilidades, família, vida real.</p>
            <p><strong>Mas eu tinha algo que talvez você também tenha:</strong></p>
            <p>Uma insatisfação. Um sentimento de que falta alguma coisa.<br/>Um chamado.<br/>Um desejo de fazer mais.</p>
            <p><strong>Um dom natural de acolher outras mulheres.</strong></p>
            <p>E um dia, quase por acidente, eu reuni algumas mulheres para um primeiro grupo terapêutico.<br/>Conversamos. Choramos. Rimos. Nós nos conectamos.<br/>E no final, uma delas disse algo que mudou minha vida:</p>
            <p><strong>"Anna, quando vai ser o próximo? Eu preciso disso."</strong></p>
            <p>Foi aí que eu entendi:</p>
            <p><strong>Eu preciso criar um Círculo de Mulheres. Preciso criar um espaço onde as mulheres se transformem em grupos.</strong></p>
            <p>E foi o que eu fiz. Meus Círculos iniciaram em 2003.<br/>Em 2016, eu facilitava:<br/>• 8 a 10 Círculos de Mulheres por mês<br/>• 12 a 15 mulheres em cada círculo<br/>• <strong>Mais de 100 mulheres impactadas todo mês</strong></p>
            <p>Cobrava R$ 150 por mulher. Gerava cerca R$ 15 mil por mês.<br/>Trabalhando apenas 2 noites por semana. Sem equipe. <strong>Apenas EU e meu dom de estar entre mulheres.</strong></p>
            <p>Talvez você tenha esse dom na sua família, entre amigas, e não perceba que naturalmente você <strong>facilita conexões</strong>.<br/>Hoje, 23 anos depois, já formei <strong>mais de 2.500 mulheres</strong> que tomaram a decisão de também ajudar mulheres.</p>
          </div>
          <div>
            <img src="/foto-autora-palco.jpg" alt="Anna Patricia Chagas no palco" className="lp-split-image" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      </section>

      {/* 6. CRONOGRAMA (BANNER VERMELHO) */}
      <section className="lp-bg-red">
        <div className="lp-container">
          <h2>CRONOGRAMA DA IMERSÃO</h2>
          <div className="lp-schedule">
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">📅</div>
              <h3>Dia 10 de Julho (Sexta)</h3>
              <p>De 18h30 às 21h30</p>
            </div>
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">📅</div>
              <h3>Dia 11 de Julho (Sábado)</h3>
              <p>De 10h às 17h00</p>
            </div>
            <div className="lp-schedule-item">
              <div className="lp-schedule-icon">📹</div>
              <h3>Horário de Brasília</h3>
              <p>100% pelo Zoom.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MÓDULOS */}
      <section className="lp-container" style={{ padding: '60px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Imersão Mulheres em Círculos</h2>
        <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>Uma imersão com todas as ferramentas e orientações que você precisa para estar segura e construir a sua nova vida profissional, ajudando outras mulheres a se transformarem.</p>

        <div className="lp-modules-grid">
          {/* Coluna 1 */}
          <div className="lp-module-column">
            <div className="lp-module-title">🌅 DIA 1 - Mulheres Despertas</div>
            
            <details className="lp-accordion">
              <summary>MÓDULO 1: O Caminho Invisível</summary>
              <p>Conteúdo do módulo 1 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 2: Seu Dom Natural</summary>
              <p>Conteúdo do módulo 2 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 3: "Você só leva outra Mulher até onde você foi, dentro de si mesma"</summary>
              <p>Conteúdo do módulo 3 aqui...</p>
            </details>
          </div>

          {/* Coluna 2 */}
          <div className="lp-module-column">
            <div className="lp-module-title">🔥 DIA 2 - CONSTRUINDO SEU TRABALHO</div>
            
            <details className="lp-accordion">
              <summary>MÓDULO 4: O Mercado Que Está Expandindo</summary>
              <p>Conteúdo do módulo 4 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 5: Do Zero ao Seu Primeiro Círculo</summary>
              <p>Conteúdo do módulo 5 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 6: A Arte de Facilitar</summary>
              <p>Conteúdo do módulo 6 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 7: Como cobrar pelo seu trabalho</summary>
              <p>Conteúdo do módulo 7 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 8: Enchendo Seus Círculos</summary>
              <p>Conteúdo do módulo 8 aqui...</p>
            </details>
            <details className="lp-accordion">
              <summary>MÓDULO 9: Seu Plano de 30 Dias</summary>
              <p>Conteúdo do módulo 9 aqui...</p>
            </details>
          </div>
        </div>
      </section>

      {/* 8. PRESENTES E PÚBLICO ALVO (FUNDO CINZA) */}
      <section className="lp-bg-grey">
        <div className="lp-container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem' }}>PRESENTES EXCLUSIVOS PARA QUEM PARTICIPA:</h2>
          
          <div className="lp-gifts-grid">
            <div className="lp-gift-item">
              <div style={{ fontSize: '3rem' }}>🎁</div>
              <h4>PRESENTE 1:</h4>
              <p>Roteiro Validado - Template completo de um Círculo de Mulheres Inicial</p>
            </div>
            <div className="lp-gift-item">
              <div style={{ fontSize: '3rem' }}>🎁</div>
              <h4>PRESENTE 2:</h4>
              <p>Comunidade Exclusiva no grupo do WhatsApp de quem participar da Imersão.</p>
            </div>
            <div className="lp-gift-item">
              <div style={{ fontSize: '3rem' }}>🎁</div>
              <h4>PRESENTE 3:</h4>
              <p>Certificado de Participação - Imersão Mulheres em Círculo (12 horas)</p>
            </div>
          </div>

          <div className="lp-target-boxes">
            <div className="lp-box lp-box-green">
              <h3>Esta Imersão É Para Você Se...</h3>
              <ul>
                <li><span className="lp-icon-check">✔</span> Você está em transição de carreira e quer trabalhar com propósito...</li>
                <li><span className="lp-icon-check">✔</span> Você sente que nasceu para ajudar pessoas, especialmente mulheres...</li>
                <li><span className="lp-icon-check">✔</span> Você é psicóloga, terapeuta, profissional da saúde e quer expandir seu impacto...</li>
                <li><span className="lp-icon-check">✔</span> Você já faz trabalho voluntário com mulheres...</li>
                <li><span className="lp-icon-check">✔</span> Você quer trabalhar de casa, nos seus horários...</li>
                <li><span className="lp-icon-check">✔</span> Você tem ZERO experiência formal mas tem o dom natural...</li>
                <li><span className="lp-icon-check">✔</span> Você quer resultados rápidos - validar se esse caminho é para você...</li>
                <li><span className="lp-icon-check">✔</span> Você está cansada de procrastinar e quer finalmente dar o primeiro passo concreto.</li>
              </ul>
            </div>
            <div className="lp-box lp-box-red">
              <h3>ESTA IMERSÃO NÃO É PARA VOCÊ SE:</h3>
              <ul>
                <li><span className="lp-icon-cross">✖</span> Você busca fórmulas mágicas ou enriquecimento sem trabalho real</li>
                <li><span className="lp-icon-cross">✖</span> Você não tem disponibilidade</li>
                <li><span className="lp-icon-cross">✖</span> Você quer apenas "consumir conteúdo" mas não tem intenção real de aplicar</li>
                <li><span className="lp-icon-cross">✖</span> Você não sente chamado genuíno para trabalhar com mulheres</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PREÇO (COM BACKGROUND IMAGE) */}
      <section id="comprar" className="lp-pricing-wrapper">
        <div className="lp-pricing-card">
          <h2>Qual é o Investimento Para participar?</h2>
          <p className="lp-price-old">De R$ 997,00 por apenas:</p>
          <div className="lp-price-new">12x de R$ 3,70</div>
          <p style={{ marginBottom: '20px' }}>ou R$ 37,00 à vista</p>
          
          <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block', marginBottom: '30px' }}>
            <li>• Acesso aos 2 dias de evento</li>
            <li>• Dinâmicas, Vivências</li>
            <li>• Grupo de Acompanhamento</li>
            <li>• Certificado de Participação</li>
          </ul>
          <br/>
          <a href="#" className="lp-btn" style={{ width: '100%', maxWidth: '300px' }}>QUERO O MEU INGRESSO</a>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="lp-container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px' }}>Dúvidas Frequentes</h2>
        
        <details className="lp-accordion">
          <summary>Vai ficar gravado?</summary>
          <p>Sim, todos os inscritos terão acesso à gravação após o evento.</p>
        </details>
        <details className="lp-accordion">
          <summary>E se eu já faço círculos de mulheres?</summary>
          <p>A imersão trará novas dinâmicas, estruturação de negócio e expansão da sua metodologia atual.</p>
        </details>
        <details className="lp-accordion">
          <summary>Preciso ter formação em psicologia ou terapia?</summary>
          <p>Não, a metodologia é ensinada do zero para que qualquer mulher com o chamado possa aplicar com segurança.</p>
        </details>
        <details className="lp-accordion">
          <summary>Não tenho tempo, trabalho o dia inteiro. Vai funcionar para mim?</summary>
          <p>Sim, os horários foram pensados para quem tem rotina, e o método ensina a otimizar seu tempo trabalhando em grupos.</p>
        </details>
        <details className="lp-accordion">
          <summary>Moro no interior / em cidade pequena. Vai funcionar?</summary>
          <p>Com certeza. Você pode atuar tanto presencialmente na sua região quanto online para o mundo todo.</p>
        </details>
        <details className="lp-accordion">
          <summary>Posso fazer círculos online ou precisa ser presencial?</summary>
          <p>Você aprenderá dinâmicas e o formato para aplicar em ambos os ambientes (online e presencial).</p>
        </details>
        <details className="lp-accordion">
          <summary>E se eu for tímida ou introvertida?</summary>
          <p>O método te dá a segurança de um roteiro validado, tirando o peso da improvisação e respeitando a sua essência.</p>
        </details>
      </section>

    </div>
  );
}