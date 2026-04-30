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

function normalizeSearchText(text = "") {
  return String(text)
    .replace(/[#>*_`~\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImagePath(imagePath = "") {
  if (!imagePath) return "";

  const normalized = String(imagePath).trim();

  if (!normalized) return "";

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  return `/${normalized}`;
}

function getOptimizedThumbnail(thumbnail = "") {
  const imagePath = normalizeImagePath(thumbnail);

  if (!imagePath) return "";

  if (!imagePath.startsWith("/uploads/")) {
    return imagePath;
  }

  const extension = path.extname(imagePath);
  const basePath = imagePath.replace(extension, "");
  const fileName = path.basename(basePath);

  const optimizedPath = `/uploads/optimized/${fileName}-640.webp`;
  const optimizedFilePath = path.join(
    process.cwd(),
    "public",
    optimizedPath
  );

  if (fs.existsSync(optimizedFilePath)) {
    return optimizedPath;
  }

  return imagePath;
}

function addImagePerformanceAttributes(imageTag = "") {
  let optimizedTag = imageTag;

  if (!/\sloading=/.test(optimizedTag)) {
    optimizedTag = optimizedTag.replace("<img", '<img loading="lazy"');
  }

  if (!/\sdecoding=/.test(optimizedTag)) {
    optimizedTag = optimizedTag.replace("<img", '<img decoding="async"');
  }

  if (!/\swidth=/.test(optimizedTag)) {
    optimizedTag = optimizedTag.replace("<img", '<img width="900"');
  }

  if (!/\sheight=/.test(optimizedTag)) {
    optimizedTag = optimizedTag.replace("<img", '<img height="600"');
  }

  return optimizedTag;
}

function enhancePostImages(contentHtml = "") {
  let imageIndex = 0;

  return String(contentHtml).replace(
    /<p>\s*(<img[^>]*>)\s*<\/p>/g,
    (match, imageTag) => {
      const alignment = imageIndex % 2 === 0 ? "align-left" : "align-right";
      const optimizedImageTag = addImagePerformanceAttributes(imageTag);

      imageIndex += 1;

      return `
        <figure class="blog-post-image-block ${alignment}">
          ${optimizedImageTag}
        </figure>
      `;
    }
  );
}

function readMarkdownPost(fileName) {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  return matter(fileContents);
}

export function getAllPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const { data } = readMarkdownPost(fileName);

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

    const { data } = readMarkdownPost(fileName);
    const postSlug = getPostSlug(fileName, data);

    return postSlug === slug;
  });

  if (!matchedFile) {
    return null;
  }

  const matterResult = readMarkdownPost(matchedFile);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = enhancePostImages(processedContent.toString());

  return {
    slug: getPostSlug(matchedFile, matterResult.data),
    title: matterResult.data.title || "",
    date: formatPostDate(matterResult.data.date),
    rawDate: normalizeDateValue(matterResult.data.date),
    thumbnail: getOptimizedThumbnail(matterResult.data.thumbnail),
    excerpt: matterResult.data.excerpt || "",
    contentHtml,
    contentText: normalizeSearchText(matterResult.content),
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
      const { data, content } = readMarkdownPost(fileName);

      return {
        slug: getPostSlug(fileName, data),
        title: data.title || "",
        date: formatPostDate(data.date),
        rawDate: normalizeDateValue(data.date),
        timestamp: getPostTimestamp(data.date),
        thumbnail: getOptimizedThumbnail(data.thumbnail),
        excerpt: data.excerpt || "",
        contentText: normalizeSearchText(content),
      };
    });

  return posts.sort((a, b) => b.timestamp - a.timestamp);
}