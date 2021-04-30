import React, { useEffect, useState } from 'react'
import { Collapse, Comment } from 'antd'
import './CommentViewer.css'
import ReplyEditor from './ReplyEditor'
import {
  ExclamationCircleTwoTone,
  InfoCircleTwoTone,
  MessageTwoTone
} from '@ant-design/icons'

const { Panel } = Collapse

export interface CommentViewerProps {
  comments: CustomComment[]
  onReplyCreated: (value: string) => void
  result?: boolean
  replyType?: string
  active: boolean
  onToggle: () => void
}

export type CustomComment = {
  author?: string
  content: string
  line?: number
  type: 'comment' | 'mildInfo' | 'severeInfo'
}

export const CommentViewer: React.FC<CommentViewerProps> = ({
  comments,
  onReplyCreated,
  result,
  replyType,
  active,
  onToggle
}) => {
  const [activeKey, setActiveKey] = useState<string | string[]>('0')

  useEffect(() => {
    if (active) {
      setActiveKey('1')
    } else {
      setActiveKey('0')
    }
  }, [active])

  // returns amount of infos present in the component
  const countInfos = () => {
    let count = 0
    comments.forEach(element => {
      if (element.type === ('mildInfo' || 'severeInfo')) {
        count++
      }
    })
    return count
  }

  const handleReplyCreated = (value: string) => {
    setActiveKey('1')
    onReplyCreated(value)
  }

  // returns amount of comments present in the component
  const countComments = () => {
    let count = 0
    comments.forEach(element => {
      if (element.type === 'comment') {
        count++
      }
    })
    return count
  }

  const getCommentWording = () => {
    if (countComments() === 1) {
      return ' comment'
    } else {
      return ' comments'
    }
  }

  const getInfoWording = () => {
    if (countInfos() === 1) {
      return ' info'
    } else {
      return ' infos'
    }
  }

  // returns a custom header depending on count and kind of comments present
  const getHeader = () => {
    if (result) {
      return 'Result'
    }

    if (countComments() > 0) {
      if (countInfos() > 0) {
        return (
          countComments() +
          getCommentWording() +
          ', ' +
          countInfos() +
          getInfoWording()
        )
      } else {
        return countComments() + getCommentWording()
      }
    }
    if (countInfos() > 0) {
      return countInfos() + getInfoWording()
    }
  }

  // returns a custom type for the replyType prop of ReplyEditor
  const getType = () => {
    if (!replyType) {
      let noComment = true
      comments.forEach(element => {
        if (element.type === 'comment') {
          noComment = false
        }
      })
      if (noComment) {
        return 'result'
      } else {
        return 'reply'
      }
    }
    return replyType
  }

  // returns icons for extra context in the result header
  const getExtra = () => {
    if (comments.find(element => element.type === 'severeInfo')) {
      if (comments.find(element => element.type === 'comment')) {
        return (
          <>
            <ExclamationCircleTwoTone twoToneColor="#F00E3B" />
            <MessageTwoTone style={{ paddingLeft: '0.5em' }} />
          </>
        )
      }
      return <ExclamationCircleTwoTone twoToneColor="#F00E3B" />
    } else {
      return <></>
    }
  }

  return (
    <div className="commentViewer" data-testid="commentViewer">
      <Collapse
        className="commentViewerCollapse"
        activeKey={activeKey}
        onChange={() => onToggle()}
      >
        <Panel
          key={1}
          header={getHeader()}
          className="customPanel"
          extra={getExtra()}
        >
          {!result ? (
            <>
              <div className="comments" data-testid="comments">
                {comments.map((comment, key) => {
                  if (
                    comment.type === 'comment' &&
                    comment.line !== undefined
                  ) {
                    return (
                      <Comment
                        key={key}
                        content={comment.content}
                        author={comment.author}
                      />
                    )
                  } else {
                    return <></>
                  }
                })}
              </div>
              <ReplyEditor onSubmit={handleReplyCreated} type={getType()} />

              <div className="comments">
                {comments.map((comment, key) => {
                  if (comment.type === 'mildInfo') {
                    return (
                        <div
                            style={{
                              paddingTop: '0.5em',
                              paddingLeft: '0.15em'
                            }}
                        >
                          <Comment
                              key={key}
                              content={comment.content}
                              author={
                                <div
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                >
                                  <InfoCircleTwoTone
                                      twoToneColor="#FAC302"
                                      style={{
                                        paddingTop: '0.25em',
                                        paddingRight: '0.5em'
                                      }}
                                  />
                                  <p>{comment.author}</p>
                                </div>
                              }
                          />
                        </div>
                    )
                  } else {
                    return <></>
                  }
                })}
              </div>
            </>
          ) : (
            <>
              <div className="comments">
                {comments.map((comment, key) => {
                  if (comment.type === 'comment' && comment.line === undefined) {
                    return (
                        <Comment
                            key={key}
                            content={comment.content}
                            author={comment.author}
                        />
                    )
                  } else {
                    return <></>
                  }
                })}
              </div>
              <ReplyEditor onSubmit={handleReplyCreated} type={getType()} />

              <div className="comments">
                {comments.map((comment, key) => {
                  if (comment.type === 'severeInfo') {
                    return (
                        <div
                            style={{
                              paddingTop: '0.5em',
                              paddingLeft: '0.15em'
                            }}
                        >
                          <Comment
                              key={key}
                              content={comment.content}
                              style={{
                                borderTop: '1px solid #d9d9d9',
                                paddingTop: '0.5em'
                              }}
                              author={
                                <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      margin: '0'
                                    }}
                                >
                                  <ExclamationCircleTwoTone
                                      twoToneColor="#F00E3B"
                                      style={{
                                        paddingTop: '0.25em',
                                        paddingRight: '0.5em'
                                      }}
                                  />
                                  <p>{comment.author}</p>
                                </div>
                              }
                          />
                        </div>
                    )
                  } else {
                    return <></>
                  }
                })}
              </div>
            </>
          )}
        </Panel>
      </Collapse>
    </div>
  )
}

export default CommentViewer
