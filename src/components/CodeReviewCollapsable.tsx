import React from 'react'
import { Collapse } from 'antd'
import 'antd/dist/antd.css'
import CodeReview, { CodeReviewProps } from './CodeReview'
import './CodeReviewCollapsable.css'
import { Language } from 'prism-react-renderer'
import { CustomComment } from './CommentViewer'

const { Panel } = Collapse

export interface CodeReviewCollapsableProps {
  width: number
  title: string
  code: string
  language: Language
  commentContainer: CustomComment[]
  onCommentCreated: (comment: CustomComment) => void
  author: string
  showResult: boolean
  showComments: boolean
}
export const CodeReviewCollapsable: React.FC<CodeReviewCollapsableProps> = ({
  width,
  title,
  code,
  showComments,
  showResult,
  commentContainer,
  onCommentCreated,
  author,
  language
}) => {
  return (
    <Collapse style={{ width: width }} defaultActiveKey={1}>
      <Panel key={1} header={title}>
        <CodeReview
          language={language}
          code={code}
          commentContainer={commentContainer}
          onCommentCreated={onCommentCreated}
          showResult={showResult}
          showComments={showComments}
          author={author}
        />
      </Panel>
    </Collapse>
  )
}

export default CodeReviewCollapsable
