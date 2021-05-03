import React, { useEffect, useState } from 'react'
import { Button, Collapse, Comment, Dropdown, Menu, Modal } from 'antd'
import './CommentViewer.css'
import ReplyEditor from './ReplyEditor'
import {
  ExclamationCircleTwoTone,
  InfoCircleTwoTone,
  MessageTwoTone,
  EllipsisOutlined
} from '@ant-design/icons'
import { EditorTypes } from '../types/types'

const { Panel } = Collapse

export interface CommentViewerProps {
  comments: CustomComment[]
  onReplyCreated: (value: string) => void
  onCommentEdited: (
    oldComment: CustomComment,
    newComment: CustomComment
  ) => void
  onCommentDeleted: (deletedComment: CustomComment) => void
  result?: boolean
  replyType?: EditorTypes
  active: boolean
  onToggle: () => void
  user: string
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
  onCommentEdited,
  onCommentDeleted,
  result,
  replyType,
  active,
  onToggle,
  user
}) => {
  const [activeKey, setActiveKey] = useState<string | string[]>('0')
  const [commentContext, setCommentContext] = useState<CustomComment>()
  const [isEditing, setIsEditing] = useState<boolean>(false)

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
  const getType = (): EditorTypes => {
    if (!replyType) {
      let noComment = true
      comments.forEach(element => {
        if (element.type === 'comment') {
          noComment = false
        }
      })
      if (noComment) {
        return 'Result'
      } else {
        return 'Reply'
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

  const handleEdit = (value: string) => {
    if (commentContext !== undefined) {
      const newComment: CustomComment = {
        author: commentContext.author,
        content: value,
        type: commentContext.type,
        line: commentContext.line
      }
      onCommentEdited(commentContext, newComment)
    }
  }

  const handleDelete = () => {
    if (commentContext !== undefined) {
      onCommentDeleted(commentContext)
    }
  }

  const confirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete your comment?',
      icon: <ExclamationCircleTwoTone twoToneColor="#F00E3B" />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDelete(),
      mask: true,
      centered: true
    })
  }

  const dropMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setIsEditing(true)}>
        <p>Edit</p>
      </Menu.Item>
      <Menu.Item key="2" onClick={() => confirm()}>
        <p>Delete</p>
      </Menu.Item>
    </Menu>
  )

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
                    if (comment.author === user && !isEditing) {
                      return (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingRight: '0.5em'
                          }}
                        >
                          <Comment
                            key={key}
                            content={comment.content}
                            author={comment.author}
                          />
                          <Dropdown
                            overlay={dropMenu}
                            placement="bottomCenter"
                            trigger={['click']}
                          >
                            <Button
                              icon={<EllipsisOutlined />}
                              type="text"
                              shape="circle"
                              onClick={() => setCommentContext(comment)}
                            />
                          </Dropdown>
                        </div>
                      )
                    } else {
                      if (
                        comment.author === user &&
                        isEditing &&
                        comment === commentContext
                      ) {
                        return (
                          <Comment
                            key={key}
                            content={
                              <ReplyEditor
                                onSubmit={handleEdit}
                                type="Edit"
                                textValue={comment.content}
                                onCancel={() => setIsEditing(false)}
                              />
                            }
                            author={comment.author}
                          />
                        )
                      }
                      return (
                        <Comment
                          key={key}
                          content={comment.content}
                          author={comment.author}
                        />
                      )
                    }
                  } else {
                    return <></>
                  }
                })}

                {!isEditing && (
                  <ReplyEditor onSubmit={handleReplyCreated} type={getType()} />
                )}
              </div>

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
                  if (
                    comment.type === 'comment' &&
                    comment.line === undefined
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
