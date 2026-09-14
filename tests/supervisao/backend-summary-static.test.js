import {
  readFileSync,
} from "node:fs";

import {
  describe,
  expect,
  it,
} from "vitest";

const backendUrl =
  new URL(
    "../../netlify/functions/supervisao-api.js",
    import.meta.url
  );

const source =
  readFileSync(
    backendUrl,
    "utf8"
  );

const compact =
  source.replace(
    /\s+/g,
    ""
  );

describe(
  "supervisao backend - regressão estática da summary",
  () => {
    it(
      "mantém getLaunchCollectionSummary",
      () => {
        expect(
          source
        ).toMatch(
          /async\s+function\s+getLaunchCollectionSummary\s*\(/
        );
      }
    );

    it(
      "mantém averageNullable na média de competência da summary",
      () => {
        expect(
          compact
        ).toMatch(
          /competenciaMedia:averageNullable\(/
        );
      }
    );

    it(
      "mantém o gate resource=lancamentos e summary=1",
      () => {
        const callIndex =
          compact.indexOf(
            "awaitgetLaunchCollectionSummary("
          );

        expect(
          callIndex
        ).toBeGreaterThan(
          -1
        );

        const routeWindow =
          compact.slice(
            Math.max(
              0,
              callIndex - 1800
            ),
            callIndex + 500
          );

        expect(
          routeWindow
        ).toMatch(
          /resource===["']lancamentos["']/
        );

        expect(
          routeWindow
        ).toMatch(
          /queryStringParameters(?:\?\.|\.)summary/
        );

        expect(
          routeWindow
        ).toMatch(
          /summary[^;{}]{0,180}===["']1["']/
        );
      }
    );

    it(
      "permanece teste puramente estático sem importar o backend",
      () => {
        expect(
          typeof source
        ).toBe(
          "string"
        );

        expect(
          source.length
        ).toBeGreaterThan(
          0
        );

        expect(
          source
        ).toMatch(
          /firebase-admin/
        );
      }
    );
  }
);