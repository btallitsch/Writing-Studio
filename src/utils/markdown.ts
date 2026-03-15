export function wrapSelection(
  text: string,
  selStart: number,
  selEnd: number,
  before: string,
  after: string
): { newText: string; newStart: number; newEnd: number } {
  const selected = text.slice(selStart, selEnd);
  const newText =
    text.slice(0, selStart) + before + selected + after + text.slice(selEnd);
  return {
    newText,
    newStart: selStart + before.length,
    newEnd: selEnd + before.length,
  };
}

export function insertLine(
  text: string,
  selStart: number,
  prefix: string
): { newText: string; newStart: number } {
  const lineStart = text.lastIndexOf('\n', selStart - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  return { newText, newStart: selStart + prefix.length };
}
