import {
  describe,
  expect,
  it,
} from "vitest";

import {
  competenciaMedia,
  competencyFields,
  countComputedMetrics,
  evolucaoMedia,
  isArchived,
  normalizedPercent,
  patientIndicatorFields,
} from "../../src/lib/supervisao/dashboardUtils.js";

function missingRecord(
  fields
) {
  return Object.fromEntries(
    fields.map(
      ([field]) => [
        field,
        null,
      ]
    )
  );
}

describe(
  "supervisao/dashboardUtils - semântica clínica",
  () => {
    it(
      "retorna null quando nenhuma competência foi computada",
      () => {
        expect(
          competenciaMedia({})
        ).toBeNull();

        expect(
          competenciaMedia(
            missingRecord(
              competencyFields
            )
          )
        ).toBeNull();
      }
    );

    it(
      "ignora competências não computadas na média",
      () => {
        const item =
          missingRecord(
            competencyFields
          );

        const firstField =
          competencyFields[0][0];

        const secondField =
          competencyFields[1][0];

        item[firstField] =
          4;

        item[secondField] =
          "";

        expect(
          competenciaMedia(item)
        ).toBe(4);
      }
    );

    it(
      "conta somente métricas computáveis e considera zero válido",
      () => {
        const item =
          missingRecord(
            competencyFields
          );

        const firstField =
          competencyFields[0][0];

        const secondField =
          competencyFields[1][0];

        const thirdField =
          competencyFields[2][0];

        item[firstField] =
          0;

        item[secondField] =
          5;

        item[thirdField] =
          "";

        expect(
          countComputedMetrics(
            item,
            competencyFields
          )
        ).toBe(2);
      }
    );

    it(
      "preserva ausência na evolução consolidada",
      () => {
        expect(
          evolucaoMedia({})
        ).toBeNull();
      }
    );

    it(
      "normaliza apenas o indicador computado sem contaminar pelos ausentes",
      () => {
        const [
          field,
          ,
          max,
          invert,
        ] =
          patientIndicatorFields[0];

        const half =
          Number(max) / 2;

        expect(
          normalizedPercent(
            null,
            max,
            invert
          )
        ).toBeNull();

        expect(
          evolucaoMedia({
            [field]:
              half,
          })
        ).toBeCloseTo(
          50,
          8
        );
      }
    );

    it(
      "preserva a regra existente de arquivamento",
      () => {
        expect(
          isArchived({
            arquivado: true,
          })
        ).toBe(true);

        expect(
          isArchived({
            statusRegistro:
              "Arquivado",
          })
        ).toBe(true);

        expect(
          isArchived({
            statusRegistro:
              "ARQUIVADO",
          })
        ).toBe(true);

        expect(
          isArchived({
            arquivado: false,
            statusRegistro:
              "Ativo",
          })
        ).toBe(false);
      }
    );
  }
);