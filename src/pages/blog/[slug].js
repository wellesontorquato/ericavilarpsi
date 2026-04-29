import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

const SITE_URL = "https://ericavilarpsi.com.br";
const WHATSAPP_URL =
  "https://wa.me/5582996657825?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20entender%20melhor%20como%20funciona%20o%20seu%20trabalho%20e%20quais%20seriam%20os%20pr%C3%B3ximos%20passos.";

export default function BlogPost({ post }) {
  if (!post) {
    return null;
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const shareText = `${post.title} | Erica Vilar`;
  const ogImage = post.thumbnail ? `${SITE_URL}${post.thumbnail}` : `${SITE_URL}/IMG_3092.webp`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${postUrl}`)}`,

    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(shareText)}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`,
  };

  async function copyInstagramLink() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);

        alert(
          "Link do artigo copiado. Agora você pode colar no Instagram, nos stories, na bio ou enviar por direct."
        );

        return;
      }

      alert(`Copie este link para compartilhar no Instagram: ${postUrl}`);
    } catch (error) {
      alert(`Copie este link para compartilhar no Instagram: ${postUrl}`);
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Blog Erica Vilar</title>
        <meta name="description" content={post.excerpt || post.title} />

        <link rel="canonical" href={postUrl} />

        <meta property="og:title" content={`${post.title} | Erica Vilar`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Erica Vilar`} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <div className="app blog-post-app">
        <aside className="sidebar">
          <div className="brand-wrap">
            <Link href="/" className="brand-badge" aria-label="Voltar para a home">
              EV
            </Link>

            <div className="brand-vertical">Erica Vilar</div>
          </div>

          <nav className="sidebar-nav" aria-label="Navegação principal">
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
                <span>Blog</span>
              </div>

              <Link href="/" className="mobile-avatar" aria-label="Ir para a home">
                <img src="/IMG_3092.webp" alt="Erica Vilar" />
              </Link>
            </div>

            <article className="blog-post-page">
              <div className="blog-post-topline">
                <Link href="/blog" className="blog-back-link">
                  ← Voltar ao blog
                </Link>

                {post.date && <span className="blog-post-date">{post.date}</span>}
              </div>

              <header className="blog-post-header">
                <span className="section-label">Blog</span>

                <h1>{post.title}</h1>

                {post.excerpt && <p>{post.excerpt}</p>}
              </header>

              {post.thumbnail && (
                <div className="blog-post-thumbnail">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
              )}

              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              <footer className="blog-post-footer">
                <section className="post-signature">
                  <div className="post-signature-photo">
                    <img src="/IMG_3092.webp" alt="Erica Vilar" />
                  </div>

                  <div className="post-signature-content">
                    <span>Escrito por</span>

                    <h2>Erica Vilar</h2>

                    <p>
                      De uma mulher real, para mulheres reais.
                    </p>

                    <div className="post-signature-actions">
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-pulse"
                      >
                        Agendar atendimento
                      </a>

                      <Link href="/#sobre" className="btn btn-secondary">
                        Conhecer meu trabalho
                      </Link>
                    </div>
                  </div>
                </section>

                <section className="post-share">
                  <div className="post-share-copy">
                    <span className="section-label">Compartilhe</span>

                    <h2>Envie este texto para alguém que precisa ler isso.</h2>

                    <p>
                      Compartilhe este artigo nas redes ou copie o link para enviar
                      a alguém que possa se identificar com essa reflexão.
                    </p>
                  </div>

                  <div className="post-share-buttons">
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no WhatsApp"
                    >
                      WhatsApp
                    </a>

                    <a
                      href={shareLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no X"
                    >
                      X
                    </a>

                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Compartilhar no Facebook"
                    >
                      Facebook
                    </a>

                    <button
                      type="button"
                      onClick={copyInstagramLink}
                      aria-label="Copiar link para compartilhar no Instagram"
                    >
                      Instagram
                    </button>
                  </div>
                </section>

                <div className="blog-post-final-actions">
                  <Link href="/blog" className="btn btn-secondary">
                    ← Voltar ao blog
                  </Link>
                </div>
              </footer>
            </article>

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

export async function getStaticPaths() {
  const paths = getAllPostSlugs();

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}