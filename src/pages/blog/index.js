import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage({ posts }) {
  return (
    <>
      <Head>
        <title>Blog | Érica Vilar</title>
        <meta
          name="description"
          content="Reflexões sobre escuta clínica, saúde emocional, presença, identidade e vida real."
        />
      </Head>

      <div className="blog-site-shell">
        <aside className="sidebar blog-sidebar">
          <div className="brand-wrap">
            <Link href="/" className="brand-badge">
              EV
            </Link>

            <span className="brand-vertical">Érica Vilar</span>
          </div>

          <nav className="sidebar-nav" aria-label="Navegação do blog">
            <Link href="/" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10.5V20h14v-9.5" />
              </svg>
              <span>Início</span>
            </Link>

            <Link href="/#sobre" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              <span>Sobre</span>
            </Link>

            <Link href="/#servicos" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M4 7h16" />
                <path d="M4 12h10" />
                <path d="M4 17h7" />
              </svg>
              <span>Serviços</span>
            </Link>

            <Link href="/blog" className="nav-link active">
              <svg viewBox="0 0 24 24">
                <path d="M5 5h14v14H5z" />
                <path d="M8 9h8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
              <span>Blog</span>
            </Link>
          </nav>

          <div className="sidebar-foot">
            <span className="mini-pill">CRP 15/7179</span>
            <span className="mini-pill">Maceió e Online</span>
          </div>
        </aside>

        <main className="blog-main">
          <div className="mobile-topbar blog-mobile-topbar">
            <div className="left">
              <strong>Érica Vilar</strong>
              <span>Blog</span>
            </div>

            <Link href="/" className="mobile-avatar" aria-label="Voltar ao início">
              <img src="/favicon-32x32.png" alt="Érica Vilar" />
            </Link>
          </div>

          <section className="blog-landing-hero">
            <div className="blog-landing-copy">
              <span className="section-label">Blog</span>

              <h1>Reflexões para mulheres que desejam se escutar de verdade.</h1>

              <p>
                Textos sobre saúde emocional, relações, identidade, maternidade,
                rotina, presença e o cuidado possível na vida real.
              </p>

              <div className="blog-landing-actions">
                <Link href="/" className="btn btn-secondary">
                  Voltar ao site
                </Link>

                <Link href="/#contato" className="btn btn-primary btn-pulse">
                  Agendar atendimento
                </Link>
              </div>
            </div>

            <div className="blog-landing-visual">
              <img src="/IMG_3092.webp" alt="Érica Vilar" />
            </div>
          </section>

          <section className="blog-list-section">
            <div className="blog-section-head">
              <span className="section-label">Artigos recentes</span>
              <h2>Leituras para pausar, sentir e elaborar.</h2>
            </div>

            {posts.length === 0 && (
              <p className="blog-empty">Nenhum artigo publicado ainda.</p>
            )}

            {posts.length > 0 && (
              <div className="blog-list">
                {posts.map((post) => (
                  <article className="blog-card" key={post.slug}>
                    {post.thumbnail && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-card-image"
                      >
                        <img src={post.thumbnail} alt={post.title} />
                      </Link>
                    )}

                    <div className="blog-card-content">
                      {post.date && <span>{post.date}</span>}

                      <h2>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      {post.excerpt && <p>{post.excerpt}</p>}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-card-link"
                      >
                        Ler artigo
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <nav className="mobile-tabbar blog-mobile-tabbar">
            <Link href="/" className="tab-link">
              <svg viewBox="0 0 24 24">
                <path d="M3 11.5 12 4l9 7.5" />
                <path d="M5 10.5V20h14v-9.5" />
              </svg>
              Início
            </Link>

            <Link href="/#sobre" className="tab-link">
              <svg viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
              </svg>
              Sobre
            </Link>

            <Link href="/blog" className="tab-link active">
              <svg viewBox="0 0 24 24">
                <path d="M5 5h14v14H5z" />
                <path d="M8 9h8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
              Blog
            </Link>

            <Link href="/#contato" className="tab-link">
              <svg viewBox="0 0 24 24">
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              Contato
            </Link>
          </nav>
        </main>
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