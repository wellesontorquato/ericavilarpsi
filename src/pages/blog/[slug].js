import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

const SITE_URL = "https://ericavilarpsi.com.br";

export default function BlogPost({ post }) {
  if (!post) {
    return null;
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const shareText = `${post.title} | Érica Vilar`;

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(shareText)}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`,

    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${postUrl}`
    )}`,
  };

  function copyInstagramLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      alert(
        "Link do artigo copiado. Agora você pode colar no Instagram, nos stories ou enviar por mensagem."
      );
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Érica Vilar</title>
        <meta name="description" content={post.excerpt || post.title} />

        <meta property="og:title" content={`${post.title} | Érica Vilar`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />

        {post.thumbnail && (
          <meta property="og:image" content={`${SITE_URL}${post.thumbnail}`} />
        )}
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
              <span>Artigo</span>
            </div>

            <Link href="/blog" className="mobile-avatar" aria-label="Voltar ao blog">
              <img src="/favicon-32x32.png" alt="Érica Vilar" />
            </Link>
          </div>

          <article className="blog-post-wrapper">
            <Link href="/blog" className="blog-back-link">
              ← Voltar para o blog
            </Link>

            {post.thumbnail && (
              <div className="blog-post-thumbnail">
                <img src={post.thumbnail} alt={post.title} />
              </div>
            )}

            <header className="blog-post-header">
              <span className="section-label">Blog</span>

              {post.date && <span className="blog-post-date">{post.date}</span>}

              <h1>{post.title}</h1>

              {post.excerpt && <p>{post.excerpt}</p>}
            </header>

            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />

            <footer className="blog-post-footer">
              <section className="post-signature">
                <div className="post-signature-photo">
                  <img src="/IMG_3092.webp" alt="Érica Vilar" />
                </div>

                <div className="post-signature-content">
                  <span>Escrito por</span>
                  <h2>Érica Vilar</h2>
                  <p>
                    Psicóloga para mulheres reais. Um espaço de escuta,
                    presença e elaboração para quem deseja se reencontrar com
                    mais verdade, clareza e cuidado.
                  </p>

                  <div className="post-signature-actions">
                    <Link href="/#contato" className="btn btn-primary btn-pulse">
                      Agendar atendimento
                    </Link>

                    <Link href="/" className="btn btn-secondary">
                      Conhecer meu trabalho
                    </Link>
                  </div>
                </div>
              </section>

              <section className="post-share">
                <div>
                  <span className="section-label">Compartilhe</span>
                  <h2>Envie este texto para alguém que precisa ler isso.</h2>
                </div>

                <div className="post-share-buttons">
                  <a
                    href={shareLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Compartilhar no X"
                  >
                    X
                  </a>

                  <button
                    type="button"
                    onClick={copyInstagramLink}
                    aria-label="Copiar link para compartilhar no Instagram"
                  >
                    Instagram
                  </button>

                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Compartilhar no Facebook"
                  >
                    Facebook
                  </a>

                  <a
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Compartilhar no WhatsApp"
                  >
                    WhatsApp
                  </a>
                </div>
              </section>
            </footer>
          </article>

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