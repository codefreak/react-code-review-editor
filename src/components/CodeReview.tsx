import React, { CSSProperties, useEffect, useReducer, useState } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import { Pre } from './styles'
import './CodeReview.css'
import CodeLine from './CodeLine'
import CommentViewer, { CustomComment } from './CommentViewer'
import { Button, Dropdown, Tooltip } from 'antd'
import { onlyUnique } from '../utils/UtilityFunctions'
import { State, Action } from '../types/types'
import { SettingOutlined } from '@ant-design/icons'

import { Menu } from 'antd'

export interface CodeReviewProps {
  code: string
  language: Language
  commentContainer: CustomComment[]
  onCommentCreated: (comment: CustomComment) => void
  onCommentEdited: (
    oldComment: CustomComment,
    newComment: CustomComment
  ) => void
  onCommentDeleted: (deletedComment: CustomComment) => void
  showResult: boolean
  showComments: boolean
  user: string
}

export const CodeReview: React.FC<CodeReviewProps> = ({
  code,
  language,
  commentContainer,
  onCommentCreated,
  showResult,
  showComments,
  user,
  onCommentDeleted,
  onCommentEdited
}) => {
  // reducer for handling collapse state of potentially present comment viewers
  const reducer = (state: State, action: Action) => {
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

      case 'setup':
        return setupState(state)
      default:
        return state
    }
  }

  const setupState = (state: State): State => {
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

  const [linesWithComment, setLinesWithComment] = useState<number[]>(
    new Array<number>()
  )
  const [linesWithMildInfo, setLinesWithMildInfo] = useState<number[]>(
    new Array<number>()
  )

  // array containing all unique lines that contain comments or infos
  const combinedCommentLinesUnique = linesWithComment
    .concat(linesWithMildInfo)
    .filter(onlyUnique)
  const initialState: State = []
  const [state, dispatch] = useReducer(reducer, initialState, setupState)

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
    dispatch({ type: 'setup' })
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

  // returns all comments of a given line
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

  const menuItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }

  const shortcutStyle: CSSProperties = {
    background: '#ECECEC',
    marginLeft: '1em',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    borderRadius: '5px'
  }

  const dropMenu = (
    <Menu>
      <Menu.Item onClick={() => dispatch({ type: 'expand-all' })}>
        <div style={menuItemStyle}>
          <p>Expand all</p>
          <p style={shortcutStyle}>alt + e</p>
        </div>
      </Menu.Item>
      <Menu.Item onClick={() => dispatch({ type: 'collapse-all' })}>
        <div style={menuItemStyle}>
          <p>Collapse all</p>
          <p style={shortcutStyle}>alt + c</p>
        </div>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          paddingTop: '0.5em'
        }}
      >
        <Dropdown
          overlay={dropMenu}
          placement="bottomCenter"
          trigger={['click']}
        >
          <Tooltip title="shortcuts">
            <Button icon={<SettingOutlined />} type="text" shape="circle" />
          </Tooltip>
        </Dropdown>
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
                    onCommentCreated(createComment(value, user, i))
                  }}
                  mildInfo={linesWithMildInfo.includes(i)}
                  severeInfo={false}
                  commentThread={linesWithComment.includes(i)}
                  comments={getCommentsOfLine(i)}
                  onReplyCreated={value =>
                    onCommentCreated(createComment(value, user, i))
                  }
                  onCommentEdited={onCommentEdited}
                  onCommentDeleted={onCommentDeleted}
                  showComments={showComments}
                  active={state[combinedCommentLinesUnique.indexOf(i) + 1]}
                  onToggle={() => {
                    dispatch({
                      type: 'toggle',
                      index: combinedCommentLinesUnique.indexOf(i) + 1
                    })
                  }}
                  user={user}
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
              onCommentCreated(createComment(value, user))
            }
            active={state[0]}
            onToggle={() => dispatch({ type: 'toggle', index: 0 })}
            user={user}
            onCommentDeleted={onCommentDeleted}
            onCommentEdited={onCommentEdited}
          />
        </div>
      )}
    </div>
  )
}

export default CodeReview
