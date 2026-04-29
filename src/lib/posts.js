import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        params: {
          slug: data.slug || fileName.replace(/\.md$/, ""),
        },
      };
    });
}

export async function getPostBySlug(slug) {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const matchedFile = fileNames.find((fileName) => {
    if (!fileName.endsWith(".md")) return false;

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const fileSlug = fileName.replace(/\.md$/, "");

    return data.slug === slug || fileSlug === slug;
  });

  if (!matchedFile) {
    return null;
  }

  const fullPath = path.join(postsDirectory, matchedFile);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    slug: matterResult.data.slug || matchedFile.replace(/\.md$/, ""),
    title: matterResult.data.title || "",
    date: matterResult.data.date
      ? String(matterResult.data.date).slice(0, 10)
      : "",
    thumbnail: matterResult.data.thumbnail || "",
    excerpt: matterResult.data.excerpt || "",
    contentHtml,
  };
}

export function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data } = matter(fileContents);

      return {
        slug: data.slug || fileName.replace(/\.md$/, ""),
        title: data.title || "",
        date: data.date ? String(data.date).slice(0, 10) : "",
        thumbnail: data.thumbnail || "",
        excerpt: data.excerpt || "",
      };
    });

  return posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}