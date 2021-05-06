import React, { useEffect, useState } from 'react'
import { Line, LineContent, LineNo } from './styles'
import { Button } from 'antd'
import {
  PlusOutlined,
  ExclamationCircleTwoTone,
  InfoCircleTwoTone,
  MessageTwoTone
} from '@ant-design/icons'
import {
  Token,
  LineInputProps,
  LineOutputProps,
  TokenInputProps,
  TokenOutputProps,
  EditorPlaceholder,
  Role
} from '../types/types'
import CommentViewer from './CommentViewer'
import { CustomComment } from '../types/types'
import ReplyEditor from './ReplyEditor'

export interface CodeLineProps {
  line: Token[]
  lineNo: number
  getLineProps: (input: LineInputProps) => LineOutputProps
  getTokenProps: (input: TokenInputProps) => TokenOutputProps
  onSubmit: (value: string) => void
  comments: CustomComment[]
  onReplyCreated: (value: string) => void
  onCommentEdited: (
    oldComment: CustomComment,
    newComment: CustomComment
  ) => void
  onCommentDeleted: (deletedComment: CustomComment) => void
  showComments: boolean
  active: boolean
  onToggle: () => void
  user: string
  role: Role
}

export const CodeLine: React.FC<CodeLineProps> = ({
  line,
  lineNo,
  getLineProps,
  getTokenProps,
  onSubmit,
  comments,
  onReplyCreated,
  showComments,
  active,
  onToggle,
  user,
  onCommentEdited,
  onCommentDeleted,
  role
}) => {
  // isShown manages visibility of addButton
  const [isShown, setIsShown] = useState(false)
  const lineNoRef = React.createRef<HTMLSpanElement>()
  const [isEditorShown, setIsEditorShown] = useState(false)
  const [commentThread, setCommentThread] = useState<boolean>()
  const [mildInfo, setMildInfo] = useState<boolean>(
    comments.map(element => element.type).includes('mildInfo')
  )
  const [severeInfo, setSevereInfo] = useState<boolean>(
    comments.map(element => element.type).includes('severeInfo')
  )

  // check what kind of comments are present to manage annotations
  useEffect(() => {
    if (comments.map(element => element.type).includes('comment')) {
      setCommentThread(true)
    } else {
      setCommentThread(false)
    }

    if (comments.map(element => element.type).includes('mildInfo')) {
      setMildInfo(true)
    } else {
      setMildInfo(false)
    }

    if (comments.map(element => element.type).includes('severeInfo')) {
      setSevereInfo(true)
    } else {
      setSevereInfo(false)
    }
  }, [comments])

  // returns the right padding value depending on the number of annotations present
  const getPaddingLeft = () => {
    if (!showComments) {
      return 4.3
    }
    if (
      (commentThread && !(mildInfo || severeInfo)) ||
      (mildInfo && !(commentThread || severeInfo)) ||
      (severeInfo && !(commentThread || mildInfo))
    ) {
      return 2.95
    }
    if (
      (commentThread && mildInfo && !severeInfo) ||
      (mildInfo && severeInfo && !commentThread) ||
      (commentThread && severeInfo && !mildInfo)
    ) {
      return 1.65
    }
    if (commentThread && mildInfo && severeInfo) {
      return 0.35
    }
    return 4.3
  }

  // show addButton and adjust padding accordingly
  const handleMouseEnter = () => {
    if (!commentThread && !mildInfo && lineNoRef.current && showComments) {
      lineNoRef.current.style.paddingLeft =
        getPaddingLeft() - 1.5 + getPaddingLeftOffset() + 'em'
      setIsShown(true)
    }
  }

  // returns a higher padding offset for higher than double digit lines
  const getPaddingLeftOffset = () => {
    if (lineNo < 9) {
      return 0.55
    } else {
      return 0
    }
  }

  // remove addButton and adjust padding accordingly
  const handleMouseLeave = () => {
    if (lineNoRef.current) {
      lineNoRef.current.style.paddingLeft =
        getPaddingLeft() + getPaddingLeftOffset() + 'em'
      setIsShown(false)
    }
  }

  const getPlaceholder = (): EditorPlaceholder => {
    if (mildInfo && !commentThread) {
      if (role === 'teacher') {
        return 'Comment'
      } else {
        return 'Question'
      }
    }
    if (!mildInfo && !commentThread && !severeInfo) {
      if (role === 'teacher') {
        return 'Comment'
      } else {
        return 'Question'
      }
    }
    return 'Reply'
  }

  return (
    <>
      <Line
        key={lineNo}
        {...getLineProps({ line, key: lineNo })}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
        data-testid={'line' + lineNo}
      >
        <div className="lineLeft">
          {isShown && showComments && (
            <>
              <Button
                icon={<PlusOutlined style={{ paddingLeft: '0.1em' }} />}
                size="small"
                onClick={() => setIsEditorShown(true)}
                style={{ width: '1.5em', height: '1.5em' }}
                data-testid="addButton"
              />
            </>
          )}

          {severeInfo && showComments && (
            <ExclamationCircleTwoTone
              style={{ paddingLeft: '0.15em', paddingRight: '0.15em' }}
              onClick={() => onToggle()}
              twoToneColor="#F00E3B"
            />
          )}

          {mildInfo && showComments && (
            <InfoCircleTwoTone
              style={{ paddingLeft: '0.15em', paddingRight: '0.15em' }}
              twoToneColor="#FAC302"
              onClick={() => onToggle()}
            />
          )}

          {commentThread && showComments && (
            <MessageTwoTone
              style={{ paddingLeft: '0.15em', paddingRight: '0.15em' }}
              onClick={() => onToggle()}
            />
          )}

          <LineNo
            style={{
              paddingLeft: getPaddingLeft() + getPaddingLeftOffset() + 'em'
            }}
            ref={lineNoRef}
          >
            {lineNo + 1}
          </LineNo>
        </div>

        <LineContent>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token, key })} />
          ))}
        </LineContent>
      </Line>

      {showComments && comments.length > 0 && (
        <div data-testid={'commentViewer' + lineNo}>
          <CommentViewer
            comments={comments}
            onReplyCreated={onReplyCreated}
            placeholder={getPlaceholder()}
            active={active}
            onToggle={() => onToggle()}
            user={user}
            onCommentEdited={(oldComment, newComment) =>
              onCommentEdited(oldComment, newComment)
            }
            onCommentDeleted={deletedComment =>
              onCommentDeleted(deletedComment)
            }
          />
        </div>
      )}

      {isEditorShown && showComments && (
        <div
          style={{
            paddingLeft: '6em'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '0.5em',
              paddingBottom: '1em',
              border: '1px solid #d9d9d9',
              paddingLeft: '1.1em',
              paddingRight: '1.1em',
              marginLeft: 0,
              marginBottom: '0.5em',
              marginTop: '0.5em'
            }}
          >
            <ReplyEditor
              onCancel={() => setIsEditorShown(false)}
              line={lineNo}
              onSubmit={value => {
                onSubmit(value)
                setIsEditorShown(false)
              }}
              placeholder={getPlaceholder()}
              focus
            />
          </div>
        </div>
      )}
    </>
  )
}

export default CodeLine
