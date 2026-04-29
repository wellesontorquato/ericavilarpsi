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
          content="Artigos sobre imagem pessoal, estilo, presença e posicionamento."
        />
      </Head>

      <main className="blog-page">
        <section className="blog-hero">
          <span>Blog</span>
          <h1>Imagem, presença e estilo com intenção</h1>
          <p>
            Conteúdos sobre imagem pessoal, autoestima, elegância,
            posicionamento e construção de presença.
          </p>
        </section>

        <section className="blog-list">
          {posts.length === 0 && (
            <p className="blog-empty">
              Nenhum post publicado ainda.
            </p>
          )}

          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              {post.thumbnail && (
                <Link href={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={post.thumbnail} alt={post.title} />
                </Link>
              )}

              <div className="blog-card-content">
                {post.date && <span>{post.date}</span>}

                <h2>
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && <p>{post.excerpt}</p>}

                <Link href={`/blog/${post.slug}`} className="blog-card-link">
                  Ler artigo
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
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