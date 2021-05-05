export type Action =
  | { type: 'expand-all' }
  | { type: 'collapse-all' }
  | { type: 'setup'; linesWithComments: number[] }
  | { type: 'toggle'; index: number }
  | { type: 'remove'; index: number }

export type State = boolean[]

export type EditorTypes = 'Reply' | 'Edit' | 'Comment' | 'Result'
