const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const optimizedDir = path.join(uploadsDir, "optimized");

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

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

async function optimizeImage(fileName) {
  const inputPath = path.join(uploadsDir, fileName);
  const baseName = getBaseName(fileName);

  const thumbPath = path.join(optimizedDir, `${baseName}-640.webp`);
  const mediumPath = path.join(optimizedDir, `${baseName}-1024.webp`);

  if (fs.existsSync(thumbPath) && fs.existsSync(mediumPath)) {
    console.log(`Imagem já otimizada: ${fileName}`);
    return;
  }

  try {
    await sharp(inputPath)
      .rotate()
      .resize({
        width: 640,
        withoutEnlargement: true,
      })
      .webp({
        quality: 78,
        effort: 6,
      })
      .toFile(thumbPath);

    await sharp(inputPath)
      .rotate()
      .resize({
        width: 1024,
        withoutEnlargement: true,
      })
      .webp({
        quality: 82,
        effort: 6,
      })
      .toFile(mediumPath);

    console.log(`Imagem otimizada: ${fileName}`);
  } catch (error) {
    console.error(`Erro ao otimizar ${fileName}:`, error.message);
  }
}

async function run() {
  if (!fs.existsSync(uploadsDir)) {
    console.log("Pasta public/uploads não encontrada.");
    return;
  }

  ensureDir(optimizedDir);

  const files = fs
    .readdirSync(uploadsDir)
    .filter((fileName) => isImage(fileName));

  if (files.length === 0) {
    console.log("Nenhuma imagem encontrada em public/uploads.");
    return;
  }

  for (const fileName of files) {
    await optimizeImage(fileName);
  }

  console.log("Otimização de imagens concluída.");
}

run();