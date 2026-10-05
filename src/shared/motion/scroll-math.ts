export const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
export function railPosition(
  pointer: number,
  top: number,
  height: number,
  thumb: number,
  maxScroll: number,
  grabOffset = thumb / 2,
) {
  return (
    clamp((pointer - top - grabOffset) / Math.max(1, height - thumb)) *
    Math.max(0, maxScroll)
  );
}
export function galleryProgress(top: number, travel: number) {
  return clamp(-top / Math.max(1, travel));
}
