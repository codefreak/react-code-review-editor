import React, { useEffect, useState } from 'react'
import { Button, Collapse, Comment, Dropdown, Menu, Modal } from 'antd'
import './CommentViewer.css'
import CommentEditor from './CommentEditor'
import {
  ExclamationCircleTwoTone,
  InfoCircleTwoTone,
  MessageTwoTone,
  EllipsisOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons'
import { CustomComment, EditorPlaceholder } from '../types/types'
import BorderWrapper from './BorderWrapper'

const { Panel } = Collapse

export interface CommentViewerProps {
  comments: CustomComment[]
  onCommentCreated: (value: string) => void
  onCommentEdited: (
    oldComment: CustomComment,
    newComment: CustomComment
  ) => void
  onCommentDeleted: (deletedComment: CustomComment) => void
  result?: boolean
  placeholder?: EditorPlaceholder
  active: boolean
  onToggle: () => void
  user: string
}

export const CommentViewer: React.FC<CommentViewerProps> = ({
  comments,
  onCommentCreated,
  onCommentEdited,
  onCommentDeleted,
  result,
  placeholder,
  active,
  onToggle,
  user
}) => {
  const [activeKey, setActiveKey] = useState<string | string[]>('0')
  const [commentContext, setCommentContext] = useState<CustomComment>()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [severInfo, setSevereInfo] = useState<boolean>(false)
  const [commentThread, setCommentThread] = useState<boolean>(false)

  // set toggle state
  useEffect(() => {
    if (active) {
      setActiveKey('1')
    } else {
      setActiveKey('0')
    }
  }, [active])

  // check present comments for result annotations
  useEffect(() => {
    if (result) {
      if (comments.find(element => element.type === 'severeInfo')) {
        setSevereInfo(true)
      }
      if (comments.find(element => element.type === 'success')) {
        setSuccess(true)
      }
      if (comments.find(element => element.type === 'comment')) {
        setCommentThread(true)
      }
    }
  }, [comments, result])

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

  const handleCommentCreated = (value: string) => {
    setActiveKey('1')
    onCommentCreated(value)
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

  // returns a custom type for the placeholder prop of CommentEditor
  const getPlaceholder = (): EditorPlaceholder => {
    if (!placeholder) {
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
    return placeholder
  }

  // returns icons for extra context in the result header
  // if one severeInfo is present only that will get displayed in the extra
  const getExtra = () => {
    if (result) {
      if (severInfo) {
        return (
          <>
            <ExclamationCircleTwoTone
              twoToneColor="#F00E3B"
              data-testid="exclamationIcon"
            />
            {commentThread && (
              <MessageTwoTone
                style={{ paddingLeft: '0.5em' }}
                data-testid="commentIcon"
              />
            )}
          </>
        )
      }
      if (success) {
        return (
          <>
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              data-testid="checkIcon"
            />
            {commentThread && (
              <MessageTwoTone
                style={{ paddingLeft: '0.5em' }}
                data-testid="commentIcon"
              />
            )}
          </>
        )
      }
      return <MessageTwoTone />
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
        line: commentContext.line,
        timeAdded: commentContext.timeAdded
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

  const getWrapperTop = () => {
    if (result) {
      return 2
    } else {
      return 0.5
    }
  }

  const getWrapperBottom = () => {
    if (result) {
      return 0
    } else {
      return 1.5
    }
  }

  return (
    <div className="commentViewer" data-testid="commentViewer">
      <BorderWrapper
        heightTop={getWrapperTop()}
        heightBottom={getWrapperBottom()}
      >
        <Collapse
          className="commentViewerCollapse"
          data-testid="collapseViewer"
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
                            key={key}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingRight: '0.5em'
                            }}
                          >
                            <Comment
                              content={<pre>{comment.content}</pre>}
                              author={comment.author}
                              datetime={comment.timeAdded}
                              data-testid={'comment' + key}
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
                              datetime={comment.timeAdded}
                              content={
                                <CommentEditor
                                  onSubmit={handleEdit}
                                  placeholder="Edit"
                                  textValue={comment.content}
                                  onCancel={() => setIsEditing(false)}
                                />
                              }
                              data-testid={'comment' + key}
                              author={comment.author}
                            />
                          )
                        }
                        return (
                          <Comment
                            key={key}
                            content={<pre>{comment.content}</pre>}
                            author={comment.author}
                            datetime={comment.timeAdded}
                            data-testid={'comment' + key}
                          />
                        )
                      }
                    }
                    return <></>
                  })}

                  {!isEditing && (
                    <CommentEditor
                      onSubmit={handleCommentCreated}
                      placeholder={getPlaceholder()}
                    />
                  )}
                </div>

                {comments.find(element => element.type === 'mildInfo') && (
                  <div className="infoComments">
                    {comments.map((comment, key) => {
                      if (comment.type === 'mildInfo') {
                        return (
                          <div
                            key={key}
                            style={{
                              paddingTop: '0.5em',
                              paddingLeft: '0.15em'
                            }}
                          >
                            <Comment
                              content={<pre>{comment.content}</pre>}
                              datetime={comment.timeAdded}
                              data-testid={'comment' + key}
                              author={
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row'
                                  }}
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
                      }
                      return <></>
                    })}
                  </div>
                )}
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
                          datetime={comment.timeAdded}
                          content={comment.content}
                          author={comment.author}
                          data-testid={'comment' + key}
                        />
                      )
                    }
                    return<></>
                  })}
                  <CommentEditor
                    onSubmit={handleCommentCreated}
                    placeholder={getPlaceholder()}
                  />
                </div>

                <div className="infoComments">
                  {comments.map((comment, key) => {
                    if (
                      comment.type === 'severeInfo' ||
                      comment.type === 'success'
                    ) {
                      return (
                        <div
                          key={key}
                          style={{
                            paddingTop: '0.5em',
                            paddingLeft: '0.15em'
                          }}
                        >
                          <Comment
                            content={<pre>{comment.content}</pre>}
                            datetime={comment.timeAdded}
                            data-testid={'comment' + key}
                            author={
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row'
                                }}
                              >
                                {comment.type === 'severeInfo' ? (
                                  <ExclamationCircleTwoTone
                                    twoToneColor="#F00E3B"
                                    style={{
                                      paddingTop: '0.25em',
                                      paddingRight: '0.5em'
                                    }}
                                  />
                                ) : (
                                  <CheckCircleTwoTone
                                    twoToneColor="#52c41a"
                                    style={{
                                      paddingTop: '0.25em',
                                      paddingRight: '0.5em'
                                    }}
                                  />
                                )}
                                <p>{comment.author}</p>
                              </div>
                            }
                          />
                        </div>
                      )
                    }
                    return <></>
                  })}
                </div>
              </>
            )}
          </Panel>
        </Collapse>
      </BorderWrapper>
    </div>
  )
}

export default CommentViewer
