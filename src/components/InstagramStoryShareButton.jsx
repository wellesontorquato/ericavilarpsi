"use client";

import { useState } from "react";

export default function InstagramStoryShareButton({
  title,
  subtitle,
  url,
  category = "Artigo",
  siteName = "Erica Vilar | Psicologia",
  className = "",
  children = "Instagram",
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleShare() {
    const wantsToContinue = window.confirm(
      "Vamos criar uma imagem automática para você compartilhar no Instagram. Deseja continuar?"
    );

    if (!wantsToContinue) return;

    try {
      setIsLoading(true);

      const finalUrl =
        url || (typeof window !== "undefined" ? window.location.href : "");

      const blob = await createStoryImage({
        title,
        subtitle,
        category,
        siteName,
        url: finalUrl,
      });

      if (!blob) {
        throw new Error("Não foi possível criar a imagem.");
      }

      const fileName = createFileName(title);
      const file = new File([blob], `${fileName}.png`, {
        type: "image/png",
      });

      const shareData = {
        title: title || siteName,
        text: `${title || ""}\n\n${finalUrl}`,
        files: [file],
      };

      const canShareFile =
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] });

      if (navigator.share && canShareFile) {
        await navigator.share(shareData);
        return;
      }

      await copyText(finalUrl);
      downloadBlob(blob, `${fileName}.png`);

      alert(
        "Seu navegador não permitiu abrir o compartilhamento nativo com imagem. A imagem foi baixada e o link foi copiado. Agora é só abrir o Instagram e postar nos Stories."
      );
    } catch (error) {
      console.error("Erro ao compartilhar no Instagram:", error);

      try {
        const finalUrl =
          url || (typeof window !== "undefined" ? window.location.href : "");
        await copyText(finalUrl);
      } catch {}

      alert(
        "Não foi possível abrir o compartilhamento automaticamente. O link da notícia foi copiado para você compartilhar manualmente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isLoading}
      className={className}
      aria-label="Compartilhar no Instagram"
    >
      {isLoading ? "Criando..." : children}
    </button>
  );
}

async function createStoryImage({ title, subtitle, category, siteName, url }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const width = 1080;
  const height = 1920;

  canvas.width = width;
  canvas.height = height;

  // Fundo
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f9ebe7");
  gradient.addColorStop(0.5, "#e8c8bf");
  gradient.addColorStop(1, "#9b6f67");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Detalhes decorativos suaves
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";

  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 3 + 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  // Card principal
  const cardX = 90;
  const cardY = 300;
  const cardW = width - 180;
  const cardH = 1130;

  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundedRect(ctx, cardX, cardY, cardW, cardH, 58);
  ctx.fill();

  // Categoria
  ctx.fillStyle = "#9b6f67";
  ctx.font = "600 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(String(category || "Artigo").toUpperCase(), width / 2, cardY + 95);

  // Linha decorativa
  ctx.strokeStyle = "#b98c82";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 90, cardY + 160);
  ctx.lineTo(width / 2 + 90, cardY + 160);
  ctx.stroke();

  // Título
  ctx.fillStyle = "#2f2624";
  ctx.font = "700 72px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  wrapText({
    ctx,
    text: title || "Novo artigo publicado",
    x: width / 2,
    y: cardY + 260,
    maxWidth: cardW - 140,
    lineHeight: 88,
    maxLines: 7,
  });

  // Subtítulo
  if (subtitle) {
    ctx.fillStyle = "#6b5450";
    ctx.font = "400 42px Arial";

    wrapText({
      ctx,
      text: subtitle,
      x: width / 2,
      y: cardY + 870,
      maxWidth: cardW - 150,
      lineHeight: 58,
      maxLines: 4,
    });
  }

  // Rodapé
  ctx.fillStyle = "#2f2624";
  ctx.font = "700 40px Arial";
  ctx.textAlign = "center";
  ctx.fillText(siteName || "Site", width / 2, height - 285);

  ctx.fillStyle = "#6b5450";
  ctx.font = "400 30px Arial";
  ctx.fillText("Leia o artigo completo no site", width / 2, height - 230);

  ctx.fillStyle = "#9b6f67";
  ctx.font = "400 28px Arial";
  ctx.fillText(cleanUrl(url), width / 2, height - 180);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/png",
      1
    );
  });
}

function wrapText({ ctx, text, x, y, maxWidth, lineHeight, maxLines }) {
  const words = String(text || "").split(" ");
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

    if (lines.length >= maxLines) break;
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  const finalLines = lines.slice(0, maxLines);

  if (finalLines.length === maxLines) {
    const lastIndex = finalLines.length - 1;

    if (words.length > finalLines.join(" ").split(" ").length) {
      finalLines[lastIndex] = finalLines[lastIndex].replace(/[.,;:!?]?$/, "...");
    }

    while (ctx.measureText(finalLines[lastIndex]).width > maxWidth) {
      finalLines[lastIndex] = finalLines[lastIndex]
        .replace(/\s+\S+\.\.\.$/, "...")
        .trim();
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

function createFileName(title) {
  const base = String(title || "story-instagram")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 70);

  return base || "story-instagram";
}

function cleanUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace("www.", "");
  } catch {
    return url || "";
  }
}

async function copyText(text) {
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