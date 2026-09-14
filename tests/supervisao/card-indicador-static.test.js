import {
  readFileSync,
} from "node:fs";

import {
  describe,
  expect,
  it,
} from "vitest";

const cardUrl =
  new URL(
    "../../src/components/supervisao/CardIndicador.jsx",
    import.meta.url
  );

const source =
  readFileSync(
    cardUrl,
    "utf8"
  );

describe(
  "CardIndicador - contrato de renderização",
  () => {
    it(
      "renderiza value diretamente",
      () => {
        expect(
          source
        ).toMatch(
          /<strong>\s*\{\s*value\s*\}\s*<\/strong>/
        );
      }
    );

    it(
      "não injeta fallback global de traço no value",
      () => {
        expect(
          source
        ).not.toMatch(
          /\{\s*value\s*(?:\|\||\?\?)\s*["'][—-]["']\s*\}/
        );
      }
    );
  }
);