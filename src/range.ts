// python style range function
export function range(l: number, r?: number) {
  if (r === undefined) {
    r = l
    l = 0
  }
  return new Array(r - l).fill(undefined).map((_, k) => k + l)
}
