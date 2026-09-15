import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRequire,
} from "node:module";

import fs from "node:fs";

import path from "node:path";

import {
  fileURLToPath,
} from "node:url";


const require =
  createRequire(
    import.meta.url
  );


const backend =
  require(
    "../../netlify/functions/supervisao-api.js"
  );


const {
  validateRecord,
} = backend.__test;


const currentFile =
  fileURLToPath(
    import.meta.url
  );


const currentDirectory =
  path.dirname(
    currentFile
  );


const base = {
  ano: 2026,
  mes: 9,
  semana: 1,

  clinicaId:
    "clinic-a3",

  terapeutaId:
    "therapist-a3",

  pacienteId:
    "patient-a3",

  supervisorId:
    "supervisor-a3",

  supervisorIds: [
    "supervisor-a3",
  ],

  arquivado:
    false,

  statusRegistro:
    "Ativo",
};


describe(
  "A3 - compatibilidade de lancamentos legados",
  () => {

    it(
      "mantem novo lancamento sem competencia rejeitado",
      () => {

        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...base,
              }
            )
        ).toThrow(
          "competência clínica"
        );
      }
    );


    it(
      "mantem novo lancamento sem indicador rejeitado",
      () => {

        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...base,

                qualidadeConceitualizacao:
                  4,
              }
            )
        ).toThrow(
          "indicador de evolução"
        );
      }
    );


    it(
      "mantem novo lancamento completo aceito",
      () => {

        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...base,

                qualidadeConceitualizacao:
                  4,

                qualidadeSono:
                  8,
              }
            )
        ).not.toThrow();
      }
    );


    it(
      "permite legado sem competencia e sem indicador preservar ausencia",
      () => {

        const existing = {
          ...base,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...existing,
              },
              {
                existing,
              }
            )
        ).not.toThrow();
      }
    );


    it(
      "permite legado sem indicador preservar ausencia",
      () => {

        const existing = {
          ...base,

          qualidadeConceitualizacao:
            4,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...existing,
              },
              {
                existing,
              }
            )
        ).not.toThrow();
      }
    );


    it(
      "permite legado sem competencia preservar ausencia",
      () => {

        const existing = {
          ...base,

          qualidadeSono:
            8,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...existing,
              },
              {
                existing,
              }
            )
        ).not.toThrow();
      }
    );


    it(
      "permite legado ganhar competencia sem inventar indicador",
      () => {

        const existing = {
          ...base,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...existing,

                qualidadeConceitualizacao:
                  4,
              },
              {
                existing,
              }
            )
        ).not.toThrow();
      }
    );


    it(
      "nao permite registro completo perder todos os indicadores",
      () => {

        const existing = {
          ...base,

          qualidadeConceitualizacao:
            4,

          qualidadeSono:
            8,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...base,

                qualidadeConceitualizacao:
                  4,
              },
              {
                existing,
              }
            )
        ).toThrow(
          "indicador de evolução"
        );
      }
    );


    it(
      "nao permite registro completo perder todas as competencias",
      () => {

        const existing = {
          ...base,

          qualidadeConceitualizacao:
            4,

          qualidadeSono:
            8,
        };


        expect(
          () =>
            validateRecord(
              "lancamentos",
              {
                ...base,

                qualidadeSono:
                  8,
              },
              {
                existing,
              }
            )
        ).toThrow(
          "competência clínica"
        );
      }
    );


    it(
      "backend passa existing real para validacao de edicao",
      () => {

        const source =
          fs.readFileSync(
            path.resolve(
              currentDirectory,
              "../../netlify/functions/supervisao-api.js"
            ),
            "utf8"
          );


        expect(
          source
        ).toMatch(
          /validateRecord\(\s*resource,\s*merged,\s*\{ existing \}\s*\)/
        );
      }
    );


    it(
      "frontend passa originalLaunch aos dois grupos",
      () => {

        const source =
          fs.readFileSync(
            path.resolve(
              currentDirectory,
              "../../src/pages/admin/supervisao/lancamento-semanal.js"
            ),
            "utf8"
          );


        expect(
          source
        ).toMatch(
          /originalHadComputedValue/
        );


        expect(
          source
        ).toMatch(
          /originalLaunch\s*&&\s*!originalHadComputedValue/
        );


        expect(
          source
        ).toMatch(
          /scoreFields,[\s\S]*?"competência clínica",[\s\S]*?originalLaunch/
        );


        expect(
          source
        ).toMatch(
          /evolucaoFields,[\s\S]*?"evolução do paciente",[\s\S]*?originalLaunch/
        );
      }
    );
  }
);