import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";

export default function BlogPost({ post }) {
  if (!post) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{post.title} | Érica Vilar</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Head>

      <main className="blog-post-page">
        <article className="blog-post-container">
          <Link href="/blog" className="blog-back-link">
            ← Voltar para o blog
          </Link>

          {post.thumbnail && (
            <div className="blog-post-thumbnail">
              <img src={post.thumbnail} alt={post.title} />
            </div>
          )}

          <header className="blog-post-header">
            {post.date && <span className="blog-post-date">{post.date}</span>}

            <h1>{post.title}</h1>

            {post.excerpt && <p>{post.excerpt}</p>}
          </header>

          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </main>
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