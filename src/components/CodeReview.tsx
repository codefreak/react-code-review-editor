import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import { Pre } from './styles'
import './CodeReview.css'
import CodeLine from './CodeLine'
import CommentViewer from './CommentViewer'
import { CustomComment, Role } from '../types/types'
import { Button, Dropdown, Tooltip } from 'antd'
import { onlyUnique } from '../utils/UtilityFunctions'
import { State, Action } from '../types/types'
import { SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import moment from 'moment'

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
  user: string
  role: Role
}

const setupMemo = (comments: CustomComment[]) => {
  const memo: number[] = []
  comments.forEach(comment => {
    if (comment.line !== undefined) {
      memo.push(comment.line)
    }
  })
  return memo.filter(onlyUnique).sort((a, b) => a - b)
}

const setupState = (state: State, linesWithCommentViewer: number[]): State => {
  let newState: State = []
  const dif = linesWithCommentViewer.length + 1 - state.length

  // new comments added
  if (dif > 0 && state.length !== 0) {
    let toAdd: State = []
    for (let i = 0; i < dif; i++) {
      toAdd = [...toAdd, true]
    }
    newState = state.concat(toAdd)
    return newState
  }

  // initial setup
  if (state.length === 0) {
    // length +1 to add a value for the result viewer
    for (let i = 0; i < linesWithCommentViewer.length + 1; i++) {
      newState = [...newState, false]
    }
    return newState
  }

  // default
  return state
}

const reducer = (state: State, action: Action) => {
  const newState = state

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
      return setupState(state, action.linesWithComments)

    case 'remove':
      newState.splice(action.index, 1)
      return newState

    default:
      return state
  }
}

export const CodeReview: React.FC<CodeReviewProps> = ({
  code,
  language,
  commentContainer,
  onCommentCreated,
  showResult,
  user,
  onCommentDeleted,
  onCommentEdited,
  role
}) => {
  const linesWithCommentViewer: number[] = useMemo(
    () => setupMemo(commentContainer),
    [commentContainer]
  )
  const [state, dispatch] = useReducer(reducer, [])
  const [showComments, setShowComments] = useState<boolean>(true)

  const handleShortcuts = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyE') {
        dispatch({ type: 'expand-all' })
        e.preventDefault()
      }
      if (e.altKey && e.code === 'KeyC') {
        dispatch({ type: 'collapse-all' })
        e.preventDefault()
      }
      if (e.altKey && e.code === 'KeyH') {
        setShowComments(!showComments)
        e.preventDefault()
      }
    },
    [showComments]
  )

  // setup collapse state
  useEffect(() => {
    dispatch({ type: 'setup', linesWithComments: linesWithCommentViewer })
  }, [commentContainer, linesWithCommentViewer])

  // setup shortcut listeners
  useEffect(() => {
    document.addEventListener('keydown', handleShortcuts)

    // cleanup
    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  }, [handleShortcuts])

  const createComment = (content: string, author: string, line?: number) => {
    let newComment: CustomComment

    if (line !== undefined) {
      // standard comment
      newComment = {
        line: line,
        content: content,
        author: author,
        type: 'comment',
        timeAdded: moment().format('DD-MM-YY HH:mm')
      }
    } else {
      // result comment
      newComment = {
        content: content,
        author: author,
        type: 'comment',
        timeAdded: moment().format('DD-MM-YY HH:mm')
      }
    }
    return newComment
  }

  // returns all comments of a given line
  const getCommentsOfLine = (line: number) => {
    const commentsOfLine: CustomComment[] = []
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

  const handleDelete = (comment: CustomComment) => {
    // check if the deleted comment was the only comment in that line
    let isAlone = true
    commentContainer.forEach(element => {
      if (element.line === comment.line && element !== comment) isAlone = false
    })

    if (isAlone && comment.line) {
      // update collapse state
      dispatch({
        type: 'remove',
        index: linesWithCommentViewer.indexOf(comment.line)
      })
    }
    onCommentDeleted(comment)
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

  // TODO refactor to own component
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
      <Menu.Item onClick={() => setShowComments(!showComments)}>
        <div style={menuItemStyle}>
          {showComments ? <p>Hide comments</p> : <p>Show comments</p>}
          <p style={shortcutStyle}>alt + h</p>
        </div>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="codeReview">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          borderLeft: '1px solid #d9d9d9',
          marginLeft: '4.65em'
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
                  comments={getCommentsOfLine(i)}
                  onReplyCreated={value =>
                    onCommentCreated(createComment(value, user, i))
                  }
                  onCommentEdited={onCommentEdited}
                  onCommentDeleted={handleDelete}
                  showComments={showComments}
                  active={state[linesWithCommentViewer.indexOf(i) + 1]}
                  onToggle={() => {
                    dispatch({
                      type: 'toggle',
                      index: linesWithCommentViewer.indexOf(i) + 1
                    })
                  }}
                  user={user}
                  role={role}
                />
              </div>
            ))}
          </Pre>
        )}
      </Highlight>

      {showResult && showComments && (
        <div>
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
            onCommentEdited={handleDelete}
          />
        </div>
      )}
    </div>
  )
}

export default CodeReview
