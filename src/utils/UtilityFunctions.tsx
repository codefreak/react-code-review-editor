import React from 'react'

// filter to only return unique values in an array
export function onlyUnique(value: number, index: number, self: Array<number>) {
  return self.indexOf(value) === index
}
