import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/posts");

function getPostSlug(fileName, data = {}) {
  return data.slug || fileName.replace(/\.md$/, "");
}

function normalizeDateValue(dateValue) {
  if (!dateValue) return "";

  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }

  return String(dateValue);
}

function parsePostDate(dateValue) {
  if (!dateValue) return null;

  const normalizedDate = normalizeDateValue(dateValue);
  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatPostDate(dateValue) {
  const date = parsePostDate(dateValue);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getPostTimestamp(dateValue) {
  const date = parsePostDate(dateValue);

  if (!date) {
    return 0;
  }

  return date.getTime();
}

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
          slug: getPostSlug(fileName, data),
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

    const postSlug = getPostSlug(fileName, data);

    return postSlug === slug;
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
    slug: getPostSlug(matchedFile, matterResult.data),
    title: matterResult.data.title || "",
    date: formatPostDate(matterResult.data.date),
    rawDate: normalizeDateValue(matterResult.data.date),
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
        slug: getPostSlug(fileName, data),
        title: data.title || "",
        date: formatPostDate(data.date),
        rawDate: normalizeDateValue(data.date),
        timestamp: getPostTimestamp(data.date),
        thumbnail: data.thumbnail || "",
        excerpt: data.excerpt || "",
      };
    });

  return posts.sort((a, b) => b.timestamp - a.timestamp);
}