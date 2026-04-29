import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getAllPosts } from '@/lib/posts';

function formatPostDate(dateString) {
  if (!dateString) return '';

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function BlogPage({ posts = [] }) {
  const [search, setSearch] = useState('');

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return posts;

    return posts.filter((post) => {
      const title = (post.title || '').toLowerCase();
      const excerpt = (post.excerpt || '').toLowerCase();
      const content = (post.contentText || '').toLowerCase();

      return (
        title.includes(term) ||
        excerpt.includes(term) ||
        content.includes(term)
      );
    });
  }, [posts, search]);

  return (
    <>
      <Head>
        <title>Blog | Erica Vilar</title>
        <meta
          name="description"
          content="Leia os artigos do blog da psicóloga Erica Vilar sobre saúde emocional, identidade, maternidade, autocuidado e relações."
        />
      </Head>

      <div className="app">
        <aside className="sidebar">
          <div className="brand-wrap">
            <Link href="/" className="brand-badge" aria-label="Voltar para a home">
              EV
            </Link>
            <div className="brand-vertical">Erica Vilar</div>
          </div>

          <nav className="sidebar-nav">
            <Link href="/#inicio" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 9.5V21h14V9.5" />
              </svg>
              <span>Início</span>
            </Link>

            <Link href="/#sobre" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
              </svg>
              <span>Sobre</span>
            </Link>

            <Link href="/#como-funciona" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M4 6h16" />
                <path d="M4 12h10" />
                <path d="M4 18h7" />
              </svg>
              <span>Atendimento</span>
            </Link>

            <Link href="/#contato" className="nav-link">
              <svg viewBox="0 0 24 24">
                <path d="M4 5h16v11H8l-4 4z" />
              </svg>
              <span>Contato</span>
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

              <Link href="/" className="mobile-avatar" aria-label="Ir para a home">
                <img src="/IMG_3092.webp" alt="Erica Vilar" />
              </Link>
            </div>

            <section className="blog-list-page">
              <div className="blog-list-header">
                <div className="blog-list-heading">
                  <span className="section-label">Blog</span>
                  <h1>Reflexões para se escutar com mais verdade.</h1>
                  <p>
                    Textos sobre saúde emocional, identidade, maternidade,
                    relações, autocobrança e os atravessamentos da vida real.
                  </p>
                </div>
              </div>

              <form
                className="blog-searchbar"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Buscar artigo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Buscar artigo"
                />
                <button type="submit">Buscar</button>
              </form>

              {filteredPosts.length === 0 ? (
                <div className="blog-list-empty">
                  Nenhum artigo encontrado para essa busca.
                </div>
              ) : (
                <div className="blog-list-vertical">
                  {filteredPosts.map((post) => (
                    <article className="blog-list-item" key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="blog-list-thumb"
                        aria-label={`Abrir artigo ${post.title}`}
                      >
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt={post.title} />
                        ) : (
                          <div className="blog-list-thumb-placeholder">
                            Erica Vilar
                          </div>
                        )}
                      </Link>

                      <div className="blog-list-content">
                        <div className="blog-list-meta">
                          <span className="blog-list-category">Blog Erica Vilar</span>
                          {post.date && (
                            <span className="blog-list-date">
                              {formatPostDate(post.date)}
                            </span>
                          )}
                        </div>

                        <h2>
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>

                        {post.excerpt && <p>{post.excerpt}</p>}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="blog-list-readmore"
                        >
                          Ler mais →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
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

        <nav className="mobile-tabbar mobile-tabbar-five">
          <Link href="/#inicio" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            <span>Início</span>
          </Link>

          <Link href="/#sobre" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M12 21s-7-4.6-9-8.7C1.2 8.7 3.8 5 7.7 5c2.1 0 3.5 1 4.3 2.2C12.8 6 14.2 5 16.3 5c3.9 0 6.5 3.7 4.7 7.3-2 4.1-9 8.7-9 8.7Z" />
            </svg>
            <span>Sobre</span>
          </Link>

          <Link href="/#como-funciona" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16" />
              <path d="M4 12h10" />
              <path d="M4 18h7" />
            </svg>
            <span>Atend.</span>
          </Link>

          <Link href="/blog" className="tab-link active">
            <svg viewBox="0 0 24 24">
              <path d="M5 5h14v14H5z" />
              <path d="M8 9h8" />
              <path d="M8 13h8" />
              <path d="M8 17h5" />
            </svg>
            <span>Blog</span>
          </Link>

          <Link href="/#contato" className="tab-link">
            <svg viewBox="0 0 24 24">
              <path d="M4 5h16v11H8l-4 4z" />
            </svg>
            <span>Contato</span>
          </Link>
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