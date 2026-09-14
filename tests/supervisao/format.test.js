import {
  describe,
  expect,
  it,
} from "vitest";

import {
  average,
  formatDecimal,
  formatPercent,
  isNumericValue,
} from "../../src/lib/supervisao/format.js";

describe(
  "supervisao/format - semântica de valores ausentes",
  () => {
    it(
      "não trata null, undefined ou string vazia como score numérico",
      () => {
        expect(
          isNumericValue(null)
        ).toBe(false);

        expect(
          isNumericValue(undefined)
        ).toBe(false);

        expect(
          isNumericValue("")
        ).toBe(false);

        expect(
          isNumericValue("   ")
        ).toBe(false);

        expect(
          isNumericValue(0)
        ).toBe(true);
      }
    );

    it(
      "preserva null quando nenhuma entrada da média é computável",
      () => {
        expect(
          average([
            null,
            undefined,
            "",
            "   ",
          ])
        ).toBeNull();
      }
    );

    it(
      "ignora ausentes sem converter em falso zero",
      () => {
        expect(
          average([
            null,
            "",
            0,
            4,
            undefined,
          ])
        ).toBe(2);
      }
    );

    it(
      "usa fallback textual para decimal e percentual ausentes",
      () => {
        expect(
          formatDecimal(
            null,
            1,
            "Não computado"
          )
        ).toBe(
          "Não computado"
        );

        expect(
          formatPercent(
            "",
            0,
            "Não computado"
          )
        ).toBe(
          "Não computado"
        );
      }
    );
  }
);