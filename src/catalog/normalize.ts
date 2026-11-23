// Text normalization rules (R-02, R-04, R-08).

const FORBIDDEN = /[\p{Cc}\p{Cf}]/u;
const FORBIDDEN_ALL = /[\p{Cc}\p{Cf}]/gu;
const UNICODE_SPACE = /\p{Zs}/gu;

/** R-02 steps 1–4: NFC, Unicode spaces to plain space, trim and collapse spaces, uppercase. */
function normalizeBase(raw: string): string {
  return raw
    .normalize("NFC")
    .replace(UNICODE_SPACE, " ")
    .replace(/^ +| +$/g, "")
    .replace(/ {2,}/g, " ")
    .toUpperCase();
}

/** R-08: subdivision names keep zeros and accents. */
export function normalizeName(raw: string): string {
  return normalizeBase(raw);
}

/** R-02: unit labels also drop leading zeros; all zeros becomes "0". */
export function normalizeLabel(raw: string): string {
  return normalizeBase(raw).replace(/^0+(?=.)/, "");
}

/** Length in code points, not UTF-16 units. */
export function textLength(text: string): number {
  return [...text].length;
}

/** R-04, R-08: control (Cc) and invisible format (Cf) characters are not allowed. */
export function hasForbiddenCharacters(text: string): boolean {
  return FORBIDDEN.test(text);
}

/** Text shown in messages: the normalized text without Cc/Cf characters (spec §5.5). */
export function visibleText(text: string): string {
  return text.replace(FORBIDDEN_ALL, "");
}
