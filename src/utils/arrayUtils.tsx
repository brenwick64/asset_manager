export const range = (start: number, end: number): number[] => {
  if (end < start) return []
  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )
}
