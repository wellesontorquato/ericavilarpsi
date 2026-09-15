import {
  readFileSync,
} from "node:fs";

import {
  resolve,
} from "node:path";

import {
  describe,
  expect,
  it,
} from "vitest";


const backendSource =
  readFileSync(
    resolve(
      process.cwd(),
      "netlify/functions/supervisao-api.js"
    ),
    "utf8"
  );


const frontendSource =
  readFileSync(
    resolve(
      process.cwd(),
      "src/pages/admin/supervisao/lancamento-semanal.js"
    ),
    "utf8"
  );


describe(
  "A3 - compatibilidade estatica de lancamentos legados",
  () => {

    it(
      "validateRecord aceita baseline existente opcional",
      () => {

        expect(
          backendSource
        ).toMatch(
          /function validateRecord\(\s*resource,\s*data,\s*options = \{\}\s*\)/
        );


        expect(
          backendSource
        ).toMatch(
          /const existing =\s*options\.existing \|\|\s*null;/
        );
      }
    );


    it(
      "preserva ausencia historica de competencia somente com existing",
      () => {

        expect(
          backendSource
        ).toMatch(
          /const preserveLegacyMissingCompetency =\s*Boolean\(existing\) &&\s*!hasComputedField\(\s*existing,\s*COMPETENCY_FIELDS\s*\);/
        );


        expect(
          backendSource
        ).toMatch(
          /if\s*\(\s*!hasCompetency &&\s*!preserveLegacyMissingCompetency\s*\)\s*\{/
        );
      }
    );


    it(
      "preserva ausencia historica de indicador somente com existing",
      () => {

        expect(
          backendSource
        ).toMatch(
          /const preserveLegacyMissingIndicator =\s*Boolean\(existing\) &&\s*!hasComputedField\(\s*existing,\s*PATIENT_INDICATOR_FIELDS\s*\);/
        );


        expect(
          backendSource
        ).toMatch(
          /if\s*\(\s*!hasPatientIndicator &&\s*!preserveLegacyMissingIndicator\s*\)\s*\{/
        );
      }
    );


    it(
      "edicao passa o registro original para validateRecord",
      () => {

        expect(
          backendSource
        ).toMatch(
          /validateRecord\(\s*resource,\s*merged,\s*\{ existing \}\s*\)/
        );
      }
    );


    it(
      "frontend recebe originalLaunch na validacao do grupo",
      () => {

        expect(
          frontendSource
        ).toMatch(
          /function validateMetricGroup\(\s*metricFields,\s*groupLabel,\s*originalLaunch = null\s*\)/
        );
      }
    );


    it(
      "frontend identifica se o grupo original possuia valor computado",
      () => {

        expect(
          frontendSource
        ).toMatch(
          /const originalHadComputedValue =\s*originalLaunch\s*\?\s*metricFields\.some\(/
        );
      }
    );


    it(
      "frontend so permite grupo vazio quando ele ja era vazio no legado",
      () => {

        expect(
          frontendSource
        ).toMatch(
          /if\s*\(\s*originalLaunch &&\s*!originalHadComputedValue\s*\)\s*\{\s*return;\s*\}/
        );
      }
    );


    it(
      "frontend passa originalLaunch ao grupo de competencias",
      () => {

        expect(
          frontendSource
        ).toMatch(
          /validateMetricGroup\(\s*scoreFields,\s*"competência clínica",\s*originalLaunch\s*\)/
        );
      }
    );


    it(
      "frontend passa originalLaunch ao grupo de indicadores",
      () => {

        expect(
          frontendSource
        ).toMatch(
          /validateMetricGroup\(\s*evolucaoFields,\s*"evolução do paciente",\s*originalLaunch\s*\)/
        );
      }
    );


    it(
      "permanece teste puramente estatico sem importar backend em runtime",
      () => {

        const forbiddenRuntimeImport =
          [
            "require(",
            '"../../netlify/functions/supervisao-api.js"',
          ].join("");


        const forbiddenDynamicImport =
          [
            "import(",
            '"../../netlify/functions/supervisao-api.js"',
          ].join("");


        const currentTestSource =
          readFileSync(
            resolve(
              process.cwd(),
              "tests/supervisao/a3-legacy-compatibility.test.js"
            ),
            "utf8"
          );


        expect(
          currentTestSource
        ).not.toContain(
          forbiddenRuntimeImport
        );


        expect(
          currentTestSource
        ).not.toContain(
          forbiddenDynamicImport
        );
      }
    );
  }
);