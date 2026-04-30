import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

const SITE_URL = "https://ericavilarpsi.com.br";
const WHATSAPP_URL =
  "https://wa.me/5582996657825?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20entender%20melhor%20como%20funciona%20o%20seu%20trabalho%20e%20quais%20seriam%20os%20pr%C3%B3ximos%20passos.";

export default function BlogPost({ post }) {
  const [storyBlob, setStoryBlob] = useState(null);
  const [isStoryPreparing, setIsStoryPreparing] = useState(false);
  const [isStorySharing, setIsStorySharing] = useState(false);

  const postUrl = post ? `${SITE_URL}/blog/${post.slug}` : SITE_URL;
  const shareText = post ? `${post.title} | Erica Vilar` : "Erica Vilar";

  const ogImage = getAbsoluteImageUrl(post?.thumbnail || "/IMG_3092.webp");

  const storyBackgroundImage = useMemo(() => {
    return post?.thumbnail || "/IMG_3092.webp";
  }, [post?.thumbnail]);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${postUrl}\n\n${shareText}`
    )}`,

    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      postUrl
    )}&text=${encodeURIComponent(shareText)}`,

    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      postUrl
    )}`,
  };

  useEffect(() => {
    if (!post) return;

    let cancelled = false;

    async function prepareInstagramStoryImage() {
      try {
        setIsStoryPreparing(true);
        setStoryBlob(null);

        const blob = await createInstagramStoryImage({
          title: post.title,
          subtitle: post.excerpt,
          url: postUrl,
          category: "Blog",
          siteName: "Erica Vilar Psicologia",
          backgroundImageSrc: storyBackgroundImage,
        });

        if (!cancelled) {
          setStoryBlob(blob);
        }
      } catch (error) {
        console.error("Erro ao preparar imagem do Instagram:", error);

        if (!cancelled) {
          setStoryBlob(null);
        }
      } finally {
        if (!cancelled) {
          setIsStoryPreparing(false);
        }
      }
    }

    prepareInstagramStoryImage();

    return () => {
      cancelled = true;
    };
  }, [post, postUrl, storyBackgroundImage]);

  if (!post) {
    return null;
  }

  async function shareInstagramStory(event) {
    const button = event?.currentTarget;

    if (!storyBlob) {
      alert(
        "A imagem ainda está sendo preparada. Aguarde alguns segundos e toque novamente."
      );
      return;
    }

    try {
      setIsStorySharing(true);

      if (button) {
        button.disabled = true;
        button.classList.add("is-loading");
      }

      const fileName = createSafeFileName(post.title);

      const file = new File([storyBlob], `${fileName}.png`, {
        type: "image/png",
      });

      const shareData = {
        title: post.title,
        text: `${post.title}\n\n${postUrl}`,
        files: [file],
      };

      const canShareFile =
        typeof navigator !== "undefined" &&
        navigator.share &&
        (!navigator.canShare || navigator.canShare({ files: [file] }));

      if (canShareFile) {
        await navigator.share(shareData);
        return;
      }

      await copyTextToClipboard(postUrl);
      downloadBlob(storyBlob, `${fileName}.png`);

      alert(
        "Seu navegador não permitiu abrir o compartilhamento nativo com imagem. A imagem foi baixada e o link do artigo foi copiado."
      );
    } catch (error) {
      console.error("Erro ao compartilhar no Instagram:", error);

      if (error?.name === "AbortError") {
        return;
      }

      try {
        await copyTextToClipboard(postUrl);
      } catch {}

      alert(
        "Não foi possível abrir o compartilhamento automaticamente. O link do artigo foi copiado para você compartilhar manualmente."
      );
    } finally {
      setIsStorySharing(false);

      if (button) {
        button.disabled = false;
        button.classList.remove("is-loading");
      }
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Blog Erica Vilar</title>
        <meta name="description" content={post.excerpt || post.title} />

        <link rel="canonical" href={postUrl} />

        <meta property="og:site_name" content="Erica Vilar Psicologia" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content={`${post.title} | Erica Vilar`} />
        <meta property="og:description" content={post.excerpt || post.title} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />

        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | Erica Vilar`} />
        <meta name="twitter:description" content={post.excerpt || post.title} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={post.title} />
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
              <section
                className={`blog-post-hero ${
                  !post.thumbnail ? "without-image" : ""
                }`}
              >
                {post.thumbnail && (
                  <div className="blog-post-hero-media">
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                )}

                <div className="blog-post-hero-overlay" />

                <div className="blog-post-hero-inner">
                  <div className="blog-post-hero-top">
                    <Link href="/blog" className="blog-post-hero-back">
                      ← Voltar ao blog
                    </Link>

                    <span className="blog-post-hero-kicker">Blog</span>
                  </div>

                  <div className="blog-post-hero-content">
                    <h1>{post.title}</h1>

                    {post.excerpt && <p>{post.excerpt}</p>}

                    <div className="blog-post-hero-meta">
                      <span>Por Erica Vilar</span>
                      {post.date && <span>{post.date}</span>}
                    </div>
                  </div>
                </div>
              </section>

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

                    <p>De uma mulher real, para mulheres reais.</p>

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

                  <div className="post-share-buttons post-share-icon-buttons">
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-share-icon-btn post-share-whatsapp"
                      aria-label="Compartilhar no WhatsApp"
                      title="Compartilhar no WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.3l1.1-4a8.4 8.4 0 1 1 15.4-4.5Z" />
                        <path d="M9.2 7.9c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.4s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.5 2.6 1 3.1.8 3.7.8.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.7-.4l-2.1-1c-.3-.1-.6-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6l-1-2.2Z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={shareLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-share-icon-btn post-share-x"
                      aria-label="Compartilhar no X"
                      title="Compartilhar no X"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 4h4.7l4.1 5.8L17.8 4H20l-6.2 7.1L21 20h-4.7l-4.6-6.5L6.1 20H4l6.7-7.7L4 4Z" />
                      </svg>
                      <span>Twitter</span>
                    </a>

                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-share-icon-btn post-share-facebook"
                      aria-label="Compartilhar no Facebook"
                      title="Compartilhar no Facebook"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14 8.5V6.9c0-.7.2-1.1 1.2-1.1H17V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v1H7v3.1h3V21h3.6v-9.4H17l.5-3.1H14Z" />
                      </svg>
                      <span>Facebook</span>
                    </a>

                    <button
                      type="button"
                      onClick={shareInstagramStory}
                      disabled={isStoryPreparing || isStorySharing}
                      className="post-share-icon-btn post-share-instagram"
                      aria-label="Criar imagem para compartilhar no Instagram"
                      title={
                        isStoryPreparing
                          ? "Preparando imagem para compartilhar"
                          : "Compartilhar imagem do artigo"
                      }
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="4" y="4" width="16" height="16" rx="5" />
                        <circle cx="12" cy="12" r="3.4" />
                        <circle cx="17.2" cy="6.8" r="1" />
                      </svg>

                      <span>
                        {isStoryPreparing
                          ? "Preparando..."
                          : isStorySharing
                          ? "Abrindo..."
                          : "Instagram"}
                      </span>
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

async function createInstagramStoryImage({
  title,
  subtitle,
  url,
  category = "Blog",
  siteName = "Erica Vilar Psicologia",
  backgroundImageSrc,
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const width = 1080;
  const height = 1920;

  canvas.width = width;
  canvas.height = height;

  const backgroundImage = await loadCanvasImage(backgroundImageSrc);

  if (backgroundImage) {
    ctx.save();
    ctx.filter = "blur(22px)";
    drawImageCover(ctx, backgroundImage, -50, -50, width + 100, height + 100);
    ctx.restore();

    ctx.fillStyle = "rgba(38, 28, 26, 0.46)";
    ctx.fillRect(0, 0, width, height);

    const imageOverlay = ctx.createLinearGradient(0, 0, 0, height);
    imageOverlay.addColorStop(0, "rgba(248, 235, 231, 0.32)");
    imageOverlay.addColorStop(0.48, "rgba(155, 111, 103, 0.34)");
    imageOverlay.addColorStop(1, "rgba(47, 38, 36, 0.68)");

    ctx.fillStyle = imageOverlay;
    ctx.fillRect(0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#f8ebe7");
    gradient.addColorStop(0.42, "#e9c9c0");
    gradient.addColorStop(1, "#9b6f67");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 90; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 3.5 + 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  roundedRect(ctx, 52, 72, width - 104, height - 144, 72);
  ctx.fill();

  const cardX = 90;
  const cardY = 300;
  const cardW = width - 180;
  const cardH = 1140;

  ctx.fillStyle = "rgba(255, 255, 255, 0.86)";
  roundedRect(ctx, cardX, cardY, cardW, cardH, 58);
  ctx.fill();

  ctx.fillStyle = "#9b6f67";
  ctx.font = "600 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(String(category || "Blog").toUpperCase(), width / 2, cardY + 95);

  ctx.strokeStyle = "#b98c82";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 90, cardY + 160);
  ctx.lineTo(width / 2 + 90, cardY + 160);
  ctx.stroke();

  ctx.fillStyle = "#2f2624";
  ctx.font = "700 72px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  wrapCanvasText({
    ctx,
    text: title || "Novo artigo publicado",
    x: width / 2,
    y: cardY + 260,
    maxWidth: cardW - 140,
    lineHeight: 88,
    maxLines: 7,
  });

  if (subtitle) {
    ctx.fillStyle = "#6b5450";
    ctx.font = "400 42px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    wrapCanvasText({
      ctx,
      text: subtitle,
      x: width / 2,
      y: cardY + 880,
      maxWidth: cardW - 150,
      lineHeight: 58,
      maxLines: 4,
    });
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 42px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(siteName, width / 2, height - 300);

  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.font = "400 30px Arial";
  ctx.fillText("Leia o artigo completo no site", width / 2, height - 238);

  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "400 29px Arial";
  ctx.fillText("ericavilarpsi.com.br", width / 2, height - 188);

  return new Promise((resolve) => {
    try {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png",
        1
      );
    } catch (error) {
      console.error("Erro ao exportar imagem do canvas:", error);
      resolve(null);
    }
  });
}

function loadCanvasImage(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      resolve(null);
    };

    image.src = src;
  });
}

function drawImageCover(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (imageRatio > boxRatio) {
    sourceHeight = image.height;
    sourceWidth = sourceHeight * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceWidth = image.width;
    sourceHeight = sourceWidth / boxRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}

function wrapCanvasText({ ctx, text, x, y, maxWidth, lineHeight, maxLines }) {
  const words = String(text || "").trim().split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }

    if (lines.length >= maxLines) {
      break;
    }
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  const finalLines = lines.slice(0, maxLines);

  if (finalLines.length === maxLines) {
    const usedWords = finalLines.join(" ").split(/\s+/).length;

    if (usedWords < words.length) {
      const lastIndex = finalLines.length - 1;
      finalLines[lastIndex] = finalLines[lastIndex].replace(/[.,;:!?]?$/, "...");

      while (
        ctx.measureText(finalLines[lastIndex]).width > maxWidth &&
        finalLines[lastIndex].includes(" ")
      ) {
        finalLines[lastIndex] = finalLines[lastIndex]
          .replace(/\s+\S+\.\.\.$/, "...")
          .trim();
      }
    }
  }

  finalLines.forEach((item, index) => {
    ctx.fillText(item, x, y + index * lineHeight);
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function createSafeFileName(title) {
  const base = String(title || "story-erica-vilar")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

  return base || "story-erica-vilar";
}

function getAbsoluteImageUrl(imagePath) {
  if (!imagePath) {
    return `${SITE_URL}/IMG_3092.webp`;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${SITE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

async function copyTextToClipboard(text) {
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function downloadBlob(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
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