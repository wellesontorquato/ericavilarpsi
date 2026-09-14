import {
  readFileSync,
} from "node:fs";

import {
  describe,
  expect,
  it,
} from "vitest";

const launchUrl =
  new URL(
    "../../src/pages/admin/supervisao/lancamento-semanal.js",
    import.meta.url
  );

const source =
  readFileSync(
    launchUrl,
    "utf8"
  );

const compact =
  source.replace(
    /\s+/g,
    ""
  );

function sliceBetween(
  startToken,
  endToken
) {
  const start =
    source.indexOf(
      startToken
    );

  const end =
    source.indexOf(
      endToken,
      start + 1
    );

  expect(
    start
  ).toBeGreaterThan(
    -1
  );

  expect(
    end
  ).toBeGreaterThan(
    start
  );

  return source.slice(
    start,
    end
  );
}

describe(
  "lancamento-semanal - summary global",
  () => {
    it(
      "mantém estado e carregamento dedicados da summary",
      () => {
        expect(
          source
        ).toContain(
          "globalLaunchSummary"
        );

        expect(
          source
        ).toMatch(
          /async\s+function\s+loadLaunchSummary\s*\(/
        );

        expect(
          compact
        ).toContain(
          "summary:1"
        );
      }
    );

    it(
      "mantém contadores globais fora do page-1 cursor",
      () => {
        expect(
          compact
        ).toMatch(
          /globalLaunchSummary\?\.statusCounts/
        );

        expect(
          compact
        ).toMatch(
          /globalLaunchSummary\?\.summary/
        );

        expect(
          compact
        ).toMatch(
          /summary\?\.totalAtivos/
        );

        expect(
          compact
        ).toMatch(
          /summary\?\.terapeutasAtivos/
        );

        expect(
          compact
        ).toMatch(
          /summary\?\.pacientesAtivos/
        );

        expect(
          compact
        ).toMatch(
          /summary\?\.competenciaMedia/
        );
      }
    );

    it(
      "navegação anterior não recalcula nem sobrescreve a summary global",
      () => {
        const block =
          sliceBetween(
            "async function handlePreviousPage",
            "async function handleNextPage"
          );

        expect(
          block
        ).not.toMatch(
          /loadLaunchSummary|setGlobalLaunchSummary/
        );

        expect(
          block
        ).toContain(
          "loadLaunches"
        );
      }
    );

    it(
      "navegação seguinte não recalcula nem sobrescreve a summary global",
      () => {
        const block =
          sliceBetween(
            "async function handleNextPage",
            "function isMetricIgnored"
          );

        expect(
          block
        ).not.toMatch(
          /loadLaunchSummary|setGlobalLaunchSummary/
        );

        expect(
          block
        ).toContain(
          "loadLaunches"
        );
      }
    );
  }
);