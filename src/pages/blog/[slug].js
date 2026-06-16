import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import PostReactions from "@/components/PostReactions";
import PostComments from "@/components/PostComments";

// Importa o CSS isolado para o post do Blog
import "@/styles/post-blog.css";

const SITE_URL = "https://ericavilarpsi.com.br";

export default function BlogPost({ post }) {
  const [isStoryPreparing, setIsStoryPreparing] = useState(false);

  // Lógica para compartilhar artigo (story)
  const handleShareStory = async () => {
    setIsStoryPreparing(true);
    // ... sua lógica de geração de story ...
    setIsStoryPreparing(false);
  };

  return (
    <>
      <Head>
        <title>{post.title} | Erica Vilar</title>
        <meta name="description" content={post.excerpt} />
      </Head>

      <main className="blog-post-page">
        <header className="blog-post-header">
          <span className="blog-post-category">Blog Erica Vilar</span>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            {new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </header>

        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title} className="blog-post-hero-image" />
        )}

        <article className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        <section className="blog-post-actions">
          <button 
            type="button" 
            className="story-share-button" 
            onClick={handleShareStory}
            disabled={isStoryPreparing}
          >
            {isStoryPreparing ? "Preparando..." : "Compartilhar nos Stories"}
          </button>
          
          <PostReactions slug={post.slug} />
          <PostComments slug={post.slug} title={post.title} />
        </section>
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const slugs = getAllPostSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  return {
    props: { post },
  };
}