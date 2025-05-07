export function isRearrangementCorrect(
  selected: string[],
  correct: string[]
): boolean {
  if (selected.length !== correct.length) return false;
  return selected.every((value, index) => value === correct[index]);
}
