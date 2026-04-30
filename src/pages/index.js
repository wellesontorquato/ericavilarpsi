import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllPosts } from '@/lib/posts';

const WHATSAPP_URL =
  'https://wa.me/5582996657825?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20entender%20melhor%20como%20funciona%20o%20seu%20trabalho%20e%20quais%20seriam%20os%20pr%C3%B3ximos%20passos.';

const SITE_URL = 'https://ericavilarpsi.com.br';

const HERO_IMAGE_96 = '/optimized/IMG_3092-96.webp';
const HERO_IMAGE_640 = '/optimized/IMG_3092-640.webp';
const HERO_IMAGE_768 = '/optimized/IMG_3092-768.webp';
const HERO_IMAGE_1024 = '/optimized/IMG_3092-1024.webp';

export default function Home({ posts = [] }) {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSliderRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts]);
  const totalSlides = 2;

  useEffect(() => {
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
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    setHeroIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setHeroIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
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

        <title>Erica Vilar | Psicóloga em Maceió e Atendimento Online</title>

        <meta
          name="description"
          content="Psicóloga em Maceió e atendimento online para mulheres. Um espaço de escuta, identidade, maternidade, vínculos e reconexão com quem você é."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${SITE_URL}/`} />

        <meta
          property="og:title"
          content="Erica Vilar | Psicóloga em Maceió e Online"
        />
        <meta
          property="og:description"
          content="Atendimento psicológico para mulheres com escuta clínica, acolhimento, presença e profundidade."
        />
        <meta property="og:image" content={`${SITE_URL}${HERO_IMAGE_1024}`} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Erica Vilar | Psicóloga em Maceió e Online"
        />
        <meta
          name="twitter:description"
          content="Atendimento psicológico para mulheres com escuta clínica, acolhimento, presença e profundidade."
        />
        <meta name="twitter:image" content={`${SITE_URL}${HERO_IMAGE_1024}`} />

        <link
          rel="preload"
          as="image"
          href={HERO_IMAGE_768}
          imageSrcSet={`${HERO_IMAGE_640} 640w, ${HERO_IMAGE_768} 768w, ${HERO_IMAGE_1024} 1024w`}
          imageSizes="(max-width: 768px) 690px, 690px"
          fetchPriority="high"
        />
      </Head>

      <div className="app">
        <aside className="sidebar">
          <div className="brand-wrap">
            <div className="brand-badge">EV</div>
            <div className="brand-vertical">Erica Vilar</div>
          </div>

          <nav className="sidebar-nav" aria-label="Navegação principal">
            <a href="#inicio" className="nav-link active">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
              <span>Início</span>
            </a>

            <a href="#sobre" className="nav-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
              </svg>
              <span>Sobre</span>
            </a>

            <a href="#como-funciona" className="nav-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16" />
                <path d="M4 12h10" />
                <path d="M4 18h7" />
              </svg>
              <span>Atendimento</span>
            </a>

            <a href="#contato" className="nav-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
              <span>Contato</span>
            </a>

            <a href="/blog" className="nav-link">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5h14v14H5z" />
                <path d="M8 9h8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
              <span>Blog</span>
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
                <img
                  src={HERO_IMAGE_96}
                  srcSet={`${HERO_IMAGE_96} 96w, ${HERO_IMAGE_640} 640w`}
                  sizes="96px"
                  alt="Erica Vilar"
                  width="96"
                  height="96"
                  loading="eager"
                  decoding="async"
                  fetchPriority="low"
                />
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
                      <img
                        src={HERO_IMAGE_768}
                        srcSet={`${HERO_IMAGE_640} 640w, ${HERO_IMAGE_768} 768w, ${HERO_IMAGE_1024} 1024w`}
                        sizes="(max-width: 768px) 690px, 690px"
                        alt="Retrato da psicóloga Erica Vilar"
                        className="img-destaque-1"
                        width="768"
                        height="1014"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                      />
                    </div>

                    <div className="hero-slide-overlay" aria-hidden="true"></div>

                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">
                        Psicóloga para mulheres reais
                      </div>

                      <h1>
                        Um espaço de <span>escuta</span>, presença e reencontro
                        com quem você é.
                      </h1>

                      <p>
                        A terapia aqui nasce da delicadeza, da profundidade e da
                        possibilidade de voltar para si com mais verdade, clareza
                        e presença.
                      </p>

                      <div className="hero-slide-meta">
                        <span>CRP 15/7179</span>
                        <span>Maceió e Online</span>
                      </div>

                      <div className="hero-actions hero-slide-actions">
                        <a
                          href={WHATSAPP_URL}
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
                      <img
                        src="/erica.jfif"
                        alt="Psicóloga em momento de atendimento"
                        width="728"
                        height="728"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    </div>

                    <div className="hero-slide-overlay" aria-hidden="true"></div>

                    <div className="hero-slide-content">
                      <div className="hero-slide-eyebrow">
                        Atendimento com presença clínica
                      </div>

                      <h2>
                        Um cuidado sério, sensível e feito para mulheres que
                        desejam se escutar de verdade.
                      </h2>

                      <p>
                        Um acompanhamento que respeita seu tempo, sua história e
                        o que hoje pede elaboração, pausa e reconexão emocional.
                      </p>

                      <div className="hero-slide-meta">
                        <span>Escuta acolhedora</span>
                        <span>Profundidade clínica</span>
                      </div>

                      <div className="hero-actions hero-slide-actions">
                        <a
                          href={WHATSAPP_URL}
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
                </div>

                <div className="hero-slider-controls">
                  <button
                    className="hero-arrow hero-arrow-prev"
                    type="button"
                    aria-label="Slide anterior"
                    onClick={handlePrevSlide}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    className="hero-arrow hero-arrow-next"
                    type="button"
                    aria-label="Próximo slide"
                    onClick={handleNextSlide}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>

                <div className="hero-highlights">
                  <div className="hero-highlight-card">
                    <strong>Escuta clínica</strong>
                    <span>
                      Um cuidado psicológico que acolhe sua história sem fórmulas
                      prontas.
                    </span>
                  </div>

                  <div className="hero-highlight-card">
                    <strong>Mulheres reais</strong>
                    <span>
                      Questões de identidade, maternidade, rotina, vínculos e
                      sobrecarga emocional.
                    </span>
                  </div>

                  <div className="hero-highlight-card">
                    <strong>Presença + profundidade</strong>
                    <span>
                      Um espaço para elaborar, sustentar perguntas e reencontrar
                      sua própria voz.
                    </span>
                  </div>

                  <div className="hero-highlight-card">
                    <strong>Maceió e Online</strong>
                    <span>
                      Atendimento pensado para ser possível, consistente e
                      acolhedor na sua rotina.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section" id="sobre">
              <div className="section-header">
                <div>
                  <span className="section-label">Sobre</span>
                  <h2>
                    Meu trabalho nasce da escuta, delicadeza e de uma Psicologia
                    baseada em ciência.
                  </h2>
                </div>

                <p>
                  Acredito que muitas mulheres seguem funcionando, dando conta
                  de tudo e cumprindo papéis, mas acabam se afastando de si no
                  processo. A terapia pode ser um lugar de volta: para se ouvir,
                  se perceber e se reconstruir com mais presença.
                </p>
              </div>

              <div className="about-grid">
                <article className="card about-main-card">
                  <div className="card-body about-main">
                    <div className="about-quote">
                      “Te ajudo a sair do papel que te ensinaram.”
                    </div>

                    <p>
                      Meu trabalho é voltado para mulheres que desejam
                      compreender melhor sua história, suas emoções, seus
                      vínculos e a forma como vêm ocupando seus lugares na vida.
                      Mais do que buscar respostas prontas, o processo é um
                      convite para se escutar com mais honestidade.
                    </p>

                    <p>
                      Vejo a terapia como um espaço de pausa, elaboração e
                      reencontro. Um lugar em que é possível sustentar perguntas
                      importantes, acolher limites, reconhecer desejos e
                      construir uma relação mais verdadeira consigo mesma.
                    </p>
                  </div>
                </article>

                <article className="card about-care-card">
                  <div className="card-body">
                    <h3>Maneira como eu enxergo o cuidado</h3>
                    <p>
                      Não vejo o cuidado como um lugar de corrigir quem você é.
                      Vejo como um espaço em que você pode se encontrar com mais
                      honestidade, compreender o que sente e sustentar sua
                      própria história com mais gentileza.
                    </p>
                  </div>
                </article>

                <article className="card about-audience-card">
                  <div className="card-body">
                    <h3>Para quem é esse espaço</h3>
                    <p>
                      Este espaço é para mulheres que vivem questões ligadas à
                      identidade, maternidade, sobrecarga emocional,
                      autocobrança, cansaço e à sensação de estarem vivendo
                      apenas o papel que esperam delas.
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
                  O primeiro passo é entrar em contato, conhecer melhor minha
                  proposta de atendimento e perceber se esse espaço faz sentido
                  para o seu momento de vida.
                </p>
              </div>

              <div className="steps-grid">
                <article className="steps-card">
                  <div className="step-number">1</div>
                  <h3>Primeiro contato</h3>
                  <p>
                    Você pode me chamar para conhecer melhor a proposta do
                    acompanhamento, esclarecer dúvidas e dar o primeiro passo de
                    forma simples e direta.
                  </p>
                </article>

                <article className="steps-card">
                  <div className="step-number">2</div>
                  <h3>Início do processo</h3>
                  <p>
                    O acompanhamento se torna um espaço contínuo de escuta,
                    elaboração e aprofundamento, respeitando sua história, seu
                    tempo e suas questões.
                  </p>
                </article>

                <article className="steps-card">
                  <div className="step-number">3</div>
                  <h3>Maceió e Online</h3>
                  <p>
                    O atendimento acontece presencialmente em Maceió e também
                    Online, ampliando as possibilidades de cuidado com presença,
                    constância e acolhimento.
                  </p>
                </article>
              </div>
            </section>

            <section className="section blog-home-compact-section" id="blog">
              <div className="blog-home-compact-head">
                <span className="section-label">Meu Blog</span>

                <h2>Últimos artigos</h2>

                <p>
                  Saúde emocional, identidade, maternidade, vínculos e vida real
                  das mulheres em textos autorais.
                </p>
              </div>

              {featuredPosts.length === 0 && (
                <p className="blog-home-empty">Nenhum artigo publicado ainda.</p>
              )}

              {featuredPosts.length > 0 && (
                <div className="blog-home-compact-grid">
                  {featuredPosts.map((post) => (
                    <article className="blog-home-compact-card" key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-home-compact-image"
                        aria-label={`Ler artigo: ${post.title}`}
                      >
                        {post.thumbnail ? (
                          <img
                            src={post.thumbnail}
                            alt={post.title}
                            width="205"
                            height="137"
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                          />
                        ) : (
                          <span aria-hidden="true">EV</span>
                        )}
                      </Link>

                      <div className="blog-home-compact-content">
                        <span className="blog-home-compact-date">
                          {post.date || 'Artigo'}
                        </span>

                        <h3>
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        {post.excerpt && <p>{post.excerpt}</p>}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="blog-home-compact-link"
                          aria-label={`Ler artigo completo: ${post.title}`}
                        >
                          Ler artigo
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="blog-home-compact-actions">
                <Link href="/blog" className="btn btn-secondary">
                  Ver todos os artigos
                </Link>
              </div>
            </section>

            <section className="section" id="contato">
              <div className="section-header">
                <div>
                  <span className="section-label">Contato</span>
                </div>
              </div>

              <div className="contact-box">
                <article className="card contact-main-card contact-main">
                  <div className="contact-card">
                    <h2>Vamos conversar?</h2>

                    <p>
                      Um espaço com atmosfera acolhedora, presença clínica e
                      escuta séria — sem perder a delicadeza de uma psicóloga
                      individual que acompanha sua história com cuidado real.
                    </p>

                    <div className="contact-actions">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-pulse"
                      >
                        Agendar atendimento
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <footer className="footer">
              <div className="footer-inner">
                <div className="footer-brand">
                  <a
                    href="https://instagram.com/dev.torquato"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Desenvolvido por DevTorquato
                  </a>
                </div>

                <div className="footer-center">
                  <span>
                    © 2026 Erica Vilar. Cuidado psicológico com escuta,
                    presença e profundidade.
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </main>

        <nav className="mobile-tabbar mobile-tabbar-five" aria-label="Navegação mobile">
          <a href="#inicio" className="tab-link active">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            <span>Início</span>
          </a>

          <a href="#sobre" className="tab-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
            </svg>
            <span>Sobre</span>
          </a>

          <a href="#como-funciona" className="tab-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16" />
              <path d="M4 12h10" />
              <path d="M4 18h7" />
            </svg>
            <span>Atend.</span>
          </a>

          <a href="/blog" className="tab-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5h14v14H5z" />
              <path d="M8 9h8" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
            <span>Blog</span>
          </a>

          <a href="#contato" className="tab-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
            <span>Contato</span>
          </a>
        </nav>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();

  return {
    props: {
      posts,
    },
  };
}