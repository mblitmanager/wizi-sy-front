export function isRearrangementCorrect(
  selected: string[],
  correct: string[]
): boolean {
  if (selected.length !== correct.length) return false;
  return selected.every((value, index) => value === correct[index]);
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}
