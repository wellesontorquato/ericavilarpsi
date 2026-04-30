const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(publicDir, "uploads");
const optimizedRootDir = path.join(publicDir, "optimized");
const optimizedUploadsDir = path.join(uploadsDir, "optimized");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".jfif"];

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

async function createWebpVersions(inputPath, outputDir, fileName) {
  const baseName = getBaseName(fileName);

  const sizes = [
    { width: 320, suffix: "320", quality: 76 },
    { width: 480, suffix: "480", quality: 78 },
    { width: 640, suffix: "640", quality: 80 },
    { width: 768, suffix: "768", quality: 80 },
    { width: 1024, suffix: "1024", quality: 82 },
    { width: 1200, suffix: "1200", quality: 82 }
  ];

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${baseName}-${size.suffix}.webp`);

    if (fs.existsSync(outputPath)) {
      console.log(`Já existe: ${path.basename(outputPath)}`);
      continue;
    }

    await sharp(inputPath)
      .rotate()
      .resize({
        width: size.width,
        withoutEnlargement: true
      })
      .webp({
        quality: size.quality,
        effort: 6
      })
      .toFile(outputPath);

    console.log(`Criada: ${path.basename(outputPath)}`);
  }
}

async function optimizeFolderImages(sourceDir, outputDir, options = {}) {
  if (!fs.existsSync(sourceDir)) {
    console.log(`Pasta não encontrada: ${sourceDir}`);
    return;
  }

  ensureDir(outputDir);

  const files = fs
    .readdirSync(sourceDir)
    .filter((fileName) => isImage(fileName));

  if (files.length === 0) {
    console.log(`Nenhuma imagem encontrada em ${sourceDir}`);
    return;
  }

  for (const fileName of files) {
    if (fileName.startsWith(".")) continue;

    const inputPath = path.join(sourceDir, fileName);

    if (fs.statSync(inputPath).isDirectory()) continue;

    try {
      await createWebpVersions(inputPath, outputDir, fileName);
    } catch (error) {
      console.error(`Erro ao otimizar ${fileName}:`, error.message);
    }
  }
}

async function run() {
  console.log("Otimizando imagens da raiz do public...");
  await optimizeFolderImages(publicDir, optimizedRootDir);

  console.log("Otimizando imagens de public/uploads...");
  await optimizeFolderImages(uploadsDir, optimizedUploadsDir);

  console.log("Otimização de imagens concluída.");
}

run();