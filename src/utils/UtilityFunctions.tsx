// filter to only return unique values in an array in combination with array filter()
export function onlyUnique(value: number, index: number, self: Array<number>): boolean {
  return self.indexOf(value) === index
}
