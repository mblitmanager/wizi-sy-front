export function isRearrangementCorrect(
  selected: string[],
  correct: string[]
): boolean {
  if (selected.length !== correct.length) return false;
  return selected.every((value, index) => value === correct[index]);
}

export function stripHtmlTags(html: unknown): string {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]+>/g, "");
}
