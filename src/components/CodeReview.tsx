import React, { useEffect, useReducer, useState } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import { Pre } from './styles'
import './CodeReview.css'
import CodeLine from './CodeLine'
import CommentViewer, { CustomComment } from './CommentViewer'
import { Button, Space } from 'antd'

export interface CodeReviewProps {
  code: string
  language: Language
  commentContainer: CustomComment[]
  onCommentCreated: (comment: CustomComment) => void
  author: string
  showResult: boolean
  showComments: boolean
}

type Action =
  | { type: 'expand-all' }
  | { type: 'collapse-all' }
  | { type: 'initialize' }
  | { type: 'toggle'; index: number }
type State = boolean[]

function onlyUnique(value: number, index: number, self: Array<number>) {
  return self.indexOf(value) === index
}

export const CodeReview: React.FC<CodeReviewProps> = ({
  code,
  language,
  commentContainer,
  onCommentCreated,
  author,
  showResult,
  showComments
}) => {
  const [linesWithComment, setLinesWithComment] = useState<number[]>(
    new Array<number>()
  )
  const [linesWithMildInfo, setLinesWithMildInfo] = useState<number[]>(
    new Array<number>()
  )

  const reducer = (state: State, action: Action) => {
    let newState = []
    switch (action.type) {
      case 'toggle':
        return state.map((value, index) => {
          if (index === action.index) {
            return !value
          } else {
            return value
          }
        })

      case 'expand-all':
        return state.map(element => {
          return true
        })

      case 'collapse-all':
        return state.map(element => {
          return false
        })

      case 'initialize':
        newState = initializeState(state)
        return newState
      default:
        return state
    }
  }

  const initializeState = (state: State): State => {
    // check the amount of values in the current state
    // and check if new values need to get pushed in case of a new comment
    const count: number = combinedCommentLinesUnique.length
    const dif: number = count - state.length

    // add values
    // +1 to add a value for the result viewer
    if (state.length !== count + 1) {
      for (let i = 0; i < dif + 1; i++) {
        state.push(false)
      }
    }
    return state
  }

  const combinedCommentLinesUnique = linesWithComment
    .concat(linesWithMildInfo)
    .filter(onlyUnique)

  const initialState: State = []
  const [state, dispatch] = useReducer(reducer, initialState, initializeState)

  // "constructor"
  useEffect(() => {
    // keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.altKey && e.code === 'KeyE') {
        dispatch({ type: 'expand-all' })
        e.preventDefault()
      }
      if (e.altKey && e.code === 'KeyC') {
        dispatch({ type: 'collapse-all' })
        e.preventDefault()
      }
    })

    // gather intel about present comments and infos
    if (commentContainer) {
      commentContainer.forEach(comment => {
        if (comment.type === 'comment' && comment.line !== undefined) {
          if (!linesWithComment.includes(comment.line)) {
            setLinesWithComment([...linesWithComment, comment.line])
          }
        }
        if (comment.type === 'mildInfo' && comment.line !== undefined) {
          if (!linesWithMildInfo.includes(comment.line)) {
            setLinesWithMildInfo([...linesWithMildInfo, comment.line])
          }
        }
      })
    }
    dispatch({ type: 'initialize' })
  }, [commentContainer, linesWithComment, linesWithMildInfo])

  const createComment = (content: string, author: string, line?: number) => {
    let newComment: CustomComment

    if (line !== undefined) {
      // standard comment
      newComment = {
        line: line,
        content: content,
        author: author,
        type: 'comment'
      }
    } else {
      // result comment
      newComment = {
        content: content,
        author: author,
        type: 'comment'
      }
    }
    return newComment
  }

  // returns comments of a given line
  const getCommentsOfLine = (line: number) => {
    const commentsOfLine = new Array<CustomComment>()
    commentContainer?.forEach(element => {
      if (element.line === line) {
        commentsOfLine.push(element)
      }
    })
    return commentsOfLine
  }

  // returns all results
  const getResults = () => {
    const results = new Array<CustomComment>()
    commentContainer?.forEach(element => {
      if (element.line === undefined || element.type === 'severeInfo') {
        results.push(element)
      }
    })
    return results
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          paddingBottom: '1em'
        }}
      >
        <Space>
          <Button
            type="default"
            onClick={() => dispatch({ type: 'expand-all' })}
          >
            Expand all
          </Button>

          <Button
            type="default"
            onClick={() => dispatch({ type: 'collapse-all' })}
          >
            Collapse all
          </Button>
        </Space>
      </div>

      <Highlight
        {...defaultProps}
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style} data-testid="highlight">
            {tokens.map((line, i) => (
              <div key={i}>
                <CodeLine
                  lineNo={i}
                  line={line}
                  getLineProps={getLineProps}
                  getTokenProps={getTokenProps}
                  onSubmit={value => {
                    onCommentCreated(createComment(value, author, i))
                  }}
                  mildInfo={linesWithMildInfo.includes(i)}
                  severeInfo={false}
                  commentThread={linesWithComment.includes(i)}
                  comments={getCommentsOfLine(i)}
                  onReplyCreated={value =>
                    onCommentCreated(createComment(value, author, i))
                  }
                  showComments={showComments}
                  active={state[combinedCommentLinesUnique.indexOf(i) + 1]}
                  onToggle={() => {
                    dispatch({
                      type: 'toggle',
                      index: combinedCommentLinesUnique.indexOf(i) + 1
                    })
                  }}
                />
              </div>
            ))}
          </Pre>
        )}
      </Highlight>
      {showResult && showComments && (
        <div
          style={{
            paddingLeft: '0.5em',
            paddingRight: '0.5em',
            paddingTop: '1em'
          }}
        >
          <CommentViewer
            comments={getResults()}
            result
            onReplyCreated={value =>
              onCommentCreated(createComment(value, author))
            }
            active={state[0]}
            onToggle={() => dispatch({ type: 'toggle', index: 0 })}
          />
        </div>
      )}
    </div>
  )
}

export default CodeReview
