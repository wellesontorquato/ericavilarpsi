import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    // ---- SCROLL OBSERVER (NAV ATIVA) ----
    const navLinks = document.querySelectorAll('.nav-link, .tab-link');
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink(id) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  useEffect(() => {
    // ---- HERO SLIDER LOGIC ----
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    const slides = document.querySelectorAll('.hero-slide');
    setHeroIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    const slides = document.querySelectorAll('.hero-slide');
    setHeroIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const distance = touchEndX.current - touchStartX.current;

    if (Math.abs(distance) > 50) {
      if (distance < 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Erica Vilar | Psicóloga</title>
        <meta
          name="description"
          content="Erica Vilar — Psicóloga para mulheres reais. Um espaço de escuta, identidade, maternidade e reconexão com quem você é."
        />
      </Head>

      <div className="app">
        <aside className="sidebar">
          <div className="brand-wrap">
            <div className="brand-badge">EV</div>
            <div className="brand-vertical">Erica Vilar</div>
          </div>

          <nav className="sidebar-nav">
            <a href="#inicio" className="nav-link active">
              <svg viewBox="0 0 24 24">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
              <span>Início</span>
            </a>
            <a href="#sobre" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
              </svg>
              <span>Sobre</span>
            </a>
            <a href="#como-funciona" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M4 6h16" />
                <path d="M4 12h10" />
                <path d="M4 18h7" />
              </svg>
              <span>Atendimento</span>
            </a>
            <a href="#contato" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
              <span>Contato</span>
            </a>
          </nav>

          <div className="sidebar-foot">
            <div className="mini-pill">CRP 15/7179</div>
            <div className="mini-pill">Maceió e Online</div>
          </div>
        </aside>

        <main className="main">
          <div className="container">
            <div className="mobile-topbar">
              <div className="left">
                <strong>Erica Vilar</strong>
                <span>Psicóloga para mulheres reais</span>
              </div>
              <div className="mobile-avatar">
                <img src="/IMG_3092.webp" alt="Erica Vilar" />
              </div>
            </div>

            <section className="hero hero-slider-section" id="inicio">
              <div className="hero-slider-shell">
                <div
                  className="hero-slider"
                  ref={heroSliderRef}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <article className={`hero-slide ${heroIndex === 0 ? 'is-active' : ''}`}>
                    <div className="hero-slide-media">
                      <img src="/IMG_3092.webp" alt="Retrato da psicóloga" className="img-destaque-1" />
                    </div>
                    <div className="hero-slide-overlay"></div>
                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">Psicóloga para mulheres reais</div>
                      <h1>
                        Um espaço de <span>escuta</span>, presença e reencontro com quem você é.
                      </h1>
                      <p>
                        A terapia aqui nasce da delicadeza, da profundidade e da possibilidade de voltar para si com mais verdade, clareza e presença.
                      </p>
                      <div className="hero-slide-meta">
                        <span>CRP 15/7179</span>
                        <span>Maceió e Online</span>
                      </div>
                      <div className="hero-actions hero-slide-actions">
                        <a
                          href="https://linktr.ee/agendamento_psiericavilar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Agendar atendimento
                        </a>
                        <a href="#sobre" className="btn btn-secondary">
                          Conhecer meu trabalho
                        </a>
                      </div>
                    </div>
                  </article>

                  <article className={`hero-slide ${heroIndex === 1 ? 'is-active' : ''}`}>
                    <div className="hero-slide-media">
                      <img src="/erica.jfif" alt="Psicóloga em momento de atendimento" />
                    </div>
                    <div className="hero-slide-overlay"></div>
                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">Atendimento com presença clínica</div>
                      <h2>Um cuidado sério, sensível e feito para mulheres que desejam se escutar de verdade.</h2>
                      <p>
                        Um acompanhamento que respeita seu tempo, sua história e o que hoje pede elaboração, pausa e reconexão emocional.
                      </p>
                      <div className="hero-slide-meta">
                        <span>Escuta acolhedora</span>
                        <span>Profundidade clínica</span>
                      </div>
                      <div className="hero-actions hero-slide-actions">
                        <a
                          href="https://linktr.ee/agendamento_psiericavilar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          Quero agendar
                        </a>
                        <a href="#como-funciona" className="btn btn-secondary">
                          Como funciona
                        </a>
                      </div>
                    </div>
                  </article>

                  {/* <article className={`hero-slide ${heroIndex === 2 ? 'is-active' : ''}`}>
                    <div className="hero-slide-media">
                      <img
                        src="https://www.psicologosberrini.com.br/wp-content/uploads/cropped-psicologo-tudo-sobre-psicologia-2-1.jpg"
                        alt="Retrato complementar da psicóloga"
                      />
                    </div>
                    <div className="hero-slide-overlay"></div>
                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">Identidade · Maternidade · Profissão</div>
                      <h2>Questões reais da vida feminina podem ter, sim, um lugar de cuidado e elaboração.</h2>
                      <p>
                        Meu trabalho conversa com identidade, maternidade, sobrecarga emocional, autocobrança e com a sensação de ter se afastado de si.
                      </p>
                      <div className="hero-slide-meta">
                        <span>Identidade</span>
                        <span>Maternidade</span>
                        <span>Profissão</span>
                      </div>
                      <div className="hero-actions hero-slide-actions">
                        <a href="#temas" className="btn btn-primary">
                          Ver temas
                        </a>
                        <a href="#faq" className="btn btn-secondary">
                          Tirar dúvidas
                        </a>
                      </div>
                    </div>
                  </article>

                  <article className={`hero-slide ${heroIndex === 3 ? 'is-active' : ''}`}>
                    <div className="hero-slide-media">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80"
                        alt="Imagem de acolhimento e presença"
                      />
                    </div>
                    <div className="hero-slide-overlay"></div>
                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">Maceió e também Online</div>
                      <h2>Um espaço possível para a sua rotina, sem perder acolhimento, constância e profundidade.</h2>
                      <p>
                        Seja presencialmente em Maceió ou Online, a proposta é oferecer um lugar seguro, humano e consistente para o seu processo terapêutico.
                      </p>
                      <div className="hero-slide-meta">
                        <span>Presencial em Maceió</span>
                        <span>Online</span>
                      </div>
                      <div className="hero-actions hero-slide-actions">
                        <a href="#contato" className="btn btn-primary">
                          Entrar em contato
                        </a>
                        <a href="#sobre" className="btn btn-secondary">
                          Sobre a psicóloga
                        </a>
                      </div>
                    </div>
                  </article> */}
                </div>

                <div className="hero-slider-controls">
                  <button
                    className="hero-arrow hero-arrow-prev"
                    type="button"
                    aria-label="Slide anterior"
                    onClick={handlePrevSlide}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    className="hero-arrow hero-arrow-next"
                    type="button"
                    aria-label="Próximo slide"
                    onClick={handleNextSlide}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>

                <div className="hero-highlights">
                  <div className="hero-highlight-card">
                    <strong>Escuta clínica</strong>
                    <span>Um cuidado psicológico que acolhe sua história sem fórmulas prontas.</span>
                  </div>
                  <div className="hero-highlight-card">
                    <strong>Mulheres reais</strong>
                    <span>Questões de identidade, maternidade, rotina, vínculos e sobrecarga emocional.</span>
                  </div>
                  <div className="hero-highlight-card">
                    <strong>Presença + profundidade</strong>
                    <span>Um espaço para elaborar, sustentar perguntas e reencontrar sua própria voz.</span>
                  </div>
                  <div className="hero-highlight-card">
                    <strong>Maceió e Online</strong>
                    <span>Atendimento pensado para ser possível, consistente e acolhedor na sua rotina.</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section" id="sobre">
              <div className="section-header">
                <div>
                  <span className="section-label">Sobre</span>
                  <h2>Meu trabalho nasce da escuta, delicadeza e de uma Psicologia baseada em ciência.</h2>
                </div>
                <p>
                  Acredito que muitas mulheres seguem funcionando, dando conta de tudo e cumprindo papéis, mas acabam se afastando de si no processo. A terapia pode ser um lugar de volta: para se ouvir, se perceber e se reconstruir com mais presença.
                </p>
              </div>

              <div className="about-grid">
                <article className="card about-main-card">
                  <div className="card-body about-main">
                    <div className="about-quote">“Te ajudo a sair do papel que te ensinaram.”</div>
                    <p>
                      Meu trabalho é voltado para mulheres que desejam compreender melhor sua história, suas emoções, seus vínculos e a forma como vêm ocupando seus lugares na vida. Mais do que buscar respostas prontas, o processo é um convite para se escutar com mais honestidade.
                    </p>
                    <p>
                      Vejo a terapia como um espaço de pausa, elaboração e reencontro. Um lugar em que é possível sustentar perguntas importantes, acolher limites, reconhecer desejos e construir uma relação mais verdadeira consigo mesma.
                    </p>
                  </div>
                </article>

                <article className="card about-care-card">
                  <div className="card-body">
                    <h3>Maneira como eu enxergo o cuidado</h3>
                    <p>
                      Não vejo o cuidado como um lugar de corrigir quem você é. Vejo como um espaço em que você pode se encontrar com mais honestidade, compreender o que sente e sustentar sua própria história com mais gentileza.
                    </p>
                  </div>
                </article>

                <article className="card about-audience-card">
                  <div className="card-body">
                    <h3>Para quem é esse espaço</h3>
                    <p>
                      Este espaço é para mulheres que vivem questões ligadas à identidade, maternidade, sobrecarga emocional, autocobrança, cansaço e à sensação de estarem vivendo apenas o papel que esperam delas.
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <section className="section" id="como-funciona">
              <div className="section-header">
                <div>
                  <span className="section-label">Atendimento</span>
                  <h2>Como funciona o acompanhamento</h2>
                </div>
                <p>
                  O primeiro passo é entrar em contato, conhecer melhor minha proposta de atendimento e perceber se esse espaço faz sentido para o seu momento de vida.
                </p>
              </div>

              <div className="steps-grid">
                <article className="steps-card">
                  <div className="step-number">1</div>
                  <h3>Primeiro contato</h3>
                  <p>
                    Você pode me chamar para conhecer melhor a proposta do acompanhamento, esclarecer dúvidas e dar o primeiro passo de forma simples e direta.
                  </p>
                </article>

                <article className="steps-card">
                  <div className="step-number">2</div>
                  <h3>Início do processo</h3>
                  <p>
                    O acompanhamento se torna um espaço contínuo de escuta, elaboração e aprofundamento, respeitando sua história, seu tempo e suas questões.
                  </p>
                </article>

                <article className="steps-card">
                  <div className="step-number">3</div>
                  <h3>Maceió e Online</h3>
                  <p>
                    O atendimento acontece presencialmente em Maceió e também Online, ampliando as possibilidades de cuidado com presença, constância e acolhimento.
                  </p>
                </article>
              </div>
            </section>

            <section className="section" id="contato">
              <div className="section-header">
                <div>
                  <span className="section-label">Contato</span>
                </div>
             {/*    <p>
                  Se você sente que chegou a hora de se escutar com mais profundidade, este pode ser um bom começo. O primeiro contato é simples e pode te ajudar a entender se esse espaço faz sentido para você.
                </p> */}
              </div>

              <div className="contact-box">
                <article className="card contact-main-card contact-main">
                  <div className="contact-card">
                    <h2>Vamos conversar?</h2>
                    <p>
                      Um espaço com atmosfera acolhedora, presença clínica e escuta séria — sem perder a delicadeza de uma psicóloga individual que acompanha sua história com cuidado real.
                    </p>
                    <div className="contact-actions">
                      <a
                        href="https://linktr.ee/agendamento_psiericavilar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-pulse"
                      >
                        Agendar atendimento
                      </a>
                    </div>
                  </div>
                </article>

                {/* <article className="card contact-info-card">
                  <div className="contact-card">
                    <h3>Informações importantes</h3>
                    <ul className="contact-list">
                      <li>Atendimento em Maceió e também Online.</li>
                      <li>Escuta clínica voltada para mulheres e suas travessias reais.</li>
                      <li>Contato inicial para conhecer a proposta e tirar dúvidas.</li>
                    </ul>
                  </div>
                </article>

                <article className="card contact-escuta-card">
                  <div className="contact-card">
                    <h3>Atmosfera do cuidado</h3>
                    <p>
                      A proposta aqui não é de um consultório impessoal. É de uma presença clínica autoral, com ambiente acolhedor, profundidade e espaço para você existir com mais verdade.
                    </p>
                  </div>
                </article> */}
              </div>
            </section>

            <footer className="footer">
              <div className="footer-inner">
                <div className="footer-brand">
                  <a href="https://instagram.com/dev.torquato" target="_blank" rel="noopener noreferrer">
                    Desenvolvido por DevTorquato
                  </a>
                </div>
                <div className="footer-center">
                  <span>© 2026 Erica Vilar. Cuidado psicológico com escuta, presença e profundidade.</span>
                </div>
              </div>
            </footer>
          </div>
        </main>

        <nav className="mobile-tabbar">
          <a href="#inicio" className="tab-link active">
            <svg viewBox="0 0 24 24">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            <span>Início</span>
          </a>
          <a href="#sobre" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
            </svg>
            <span>Sobre</span>
    </a>
          <a href="#como-funciona" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16" />
              <path d="M4 12h10" />
              <path d="M4 18h7" />
            </svg>
            <span>Atend.</span>
          </a>
          <a href="#contato" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
            <span>Contato</span>
          </a>
        </nav>
      </div>
    </>
  );
}