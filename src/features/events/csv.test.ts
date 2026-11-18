import { describe, expect, it } from "vitest";
import { sanitizeForCsv } from "./csv";

describe("sanitizeForCsv (spreadsheet formula injection protection)", () => {
  it("prefixes values starting with formula characters (=, +, -, @, \\t, \\r) with a single quote", () => {
    expect(sanitizeForCsv('=HYPERLINK("http://evil.example", "click")')).toBe(
      '\'=HYPERLINK("http://evil.example", "click")'
    );
    expect(sanitizeForCsv("+1234567890")).toBe("'+1234567890");
    expect(sanitizeForCsv("-cmd|' /C calc'!A0")).toBe("'-cmd|' /C calc'!A0");
    expect(sanitizeForCsv("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
    expect(sanitizeForCsv("\tmaliciousTab")).toBe("'\tmaliciousTab");
    expect(sanitizeForCsv("\rmaliciousCR")).toBe("'\rmaliciousCR");
  });

  it("leaves normal names and emails untouched", () => {
    expect(sanitizeForCsv("Jane Doe")).toBe("Jane Doe");
    expect(sanitizeForCsv("john.smith@example.org")).toBe("john.smith@example.org");
    expect(sanitizeForCsv("Alice & Bob")).toBe("Alice & Bob");
    expect(sanitizeForCsv("O'Connor")).toBe("O'Connor");
  });

  it("handles empty string gracefully", () => {
    expect(sanitizeForCsv("")).toBe("");
  });
});
