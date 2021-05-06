import React from 'react'

export type Action =
  | { type: 'expand-all' }
  | { type: 'collapse-all' }
  | { type: 'setup'; linesWithComments: number[] }
  | { type: 'toggle'; index: number }
  | { type: 'remove'; index: number }

export type State = boolean[]

export type Direction = 'up' | 'down'

export type EditorPlaceholder =
  | 'Reply'
  | 'Edit'
  | 'Comment'
  | 'Result'
  | 'Question'

export type Role = 'student' | 'teacher'

export type CustomComment = {
  author?: string
  content: string
  line?: number
  type: 'comment' | 'mildInfo' | 'severeInfo'
}

/*
Following types are needed for react-prism-renderer props. Sadly these types aren't exported by the library itself hence
copying. Eslint disable as the [otherProp: string]: any causes trouble with the linter but I can't fix it as it's
defined in react-prim-renderer.
*/
export type Token = {
  types: string[]
  content: string
  empty?: boolean
}

export type LineInputProps = {
  key?: React.Key
  style?: StyleObj
  className?: string
  line: Token[]
  /* eslint-disable */
  [otherProp: string]: any
  /* eslint-enable */
}

export type TokenInputProps = {
  key?: React.Key
  style?: StyleObj
  className?: string
  token: Token
  /* eslint-disable */
  [otherProp: string]: any
  /* eslint-enable */
}

export type TokenOutputProps = {
  key?: React.Key
  style?: StyleObj
  className: string
  children: string
  /* eslint-disable */
  [otherProp: string]: any
  /* eslint-enable */
}

export type LineOutputProps = {
  key?: React.Key
  style?: StyleObj
  className: string
  /* eslint-disable */
  [otherProp: string]: any
  /* eslint-enable */
}

export type StyleObj = {
  [key: string]: string | number | null
}
