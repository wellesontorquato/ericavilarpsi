const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(publicDir, "uploads");

const optimizedRootDir = path.join(publicDir, "optimized");
const optimizedUploadsDir = path.join(uploadsDir, "optimized");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".jfif"];

// Imagens da raiz do public, como:
// public/IMG_3092.webp
const rootImageSizes = [
  { width: 96, suffix: "96", quality: 74 },
  { width: 320, suffix: "320", quality: 76 },
  { width: 640, suffix: "640", quality: 78 },
  { width: 768, suffix: "768", quality: 80 },
  { width: 1024, suffix: "1024", quality: 82 },
];

// Imagens enviadas pelo CMS, como:
// public/uploads/imagem-do-post.png
const uploadImageSizes = [
  { width: 240, suffix: "240", quality: 74 },
  { width: 320, suffix: "320", quality: 76 },
  { width: 640, suffix: "640", quality: 78 },
  { width: 1024, suffix: "1024", quality: 82 },
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function isImage(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return allowedExtensions.includes(ext);
}

function getBaseName(fileName) {
  return path.basename(fileName, path.extname(fileName));
}

function shouldIgnoreFile(fileName) {
  if (!fileName) return true;

  const ignoredNames = [
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
  ];

  return ignoredNames.includes(fileName.toLowerCase());
}

function shouldSkipOptimizedOutput(outputPath, inputPath) {
  if (!fs.existsSync(outputPath)) {
    return false;
  }

  const outputStat = fs.statSync(outputPath);
  const inputStat = fs.statSync(inputPath);

  // Se a imagem otimizada já existe e foi gerada depois da original,
  // não precisa recriar.
  return outputStat.mtimeMs >= inputStat.mtimeMs;
}

async function createWebpVersions(inputPath, outputDir, fileName, sizes) {
  const baseName = getBaseName(fileName);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${baseName}-${size.suffix}.webp`);

    if (shouldSkipOptimizedOutput(outputPath, inputPath)) {
      console.log(`Já otimizada: ${path.basename(outputPath)}`);
      continue;
    }

    try {
      await sharp(inputPath)
        .rotate()
        .resize({
          width: size.width,
          withoutEnlargement: true,
        })
        .webp({
          quality: size.quality,
          effort: 6,
        })
        .toFile(outputPath);

      console.log(`Criada/atualizada: ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`Erro ao criar ${path.basename(outputPath)}:`, error.message);
    }
  }
}

async function optimizeFolderImages(sourceDir, outputDir, sizes) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Pasta não encontrada: ${sourceDir}`);
    return;
  }

  ensureDir(outputDir);

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => !fileName.startsWith("."))
    .filter((fileName) => !shouldIgnoreFile(fileName))
    .filter((fileName) => isImage(fileName));

  if (files.length === 0) {
    console.log(`Nenhuma imagem encontrada em ${sourceDir}`);
    return;
  }

  for (const fileName of files) {
    const inputPath = path.join(sourceDir, fileName);
    await createWebpVersions(inputPath, outputDir, fileName, sizes);
  }
}

async function run() {
  console.log("Otimizando imagens da raiz do public...");
  await optimizeFolderImages(publicDir, optimizedRootDir, rootImageSizes);

  console.log("Otimizando imagens de public/uploads...");
  await optimizeFolderImages(uploadsDir, optimizedUploadsDir, uploadImageSizes);

  console.log("Otimização de imagens concluída.");
}

run();