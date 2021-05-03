export type Action =
  | { type: 'expand-all' }
  | { type: 'collapse-all' }
  | { type: 'setup' }
  | { type: 'toggle'; index: number }

export type State = boolean[]

export type EditorTypes = 'Reply' | 'Edit' | 'Comment' | 'Result'
