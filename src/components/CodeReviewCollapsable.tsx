import React from 'react'
import { Collapse } from 'antd'
import 'antd/dist/antd.css'
import CodeReview, { CodeReviewProps } from './CodeReview'
import './CodeReviewCollapsable.css'

const { Panel } = Collapse

export interface CodeReviewCollapsableProps {
  width: number
  title: string
  reviewProps: CodeReviewProps
}
export const CodeReviewCollapsable: React.FC<CodeReviewCollapsableProps> = ({
  width,
  title,
  reviewProps
}) => {
  return (
    <Collapse style={{ width: width }} defaultActiveKey={1}>
      <Panel key={1} header={title}>
        <CodeReview
            code={reviewProps.code}
            language={reviewProps.language}
            commentContainer={reviewProps.commentContainer}
            onCommentCreated={reviewProps.onCommentCreated}
            showResult={reviewProps.showResult}
            user={reviewProps.user}
            onCommentEdited={reviewProps.onCommentEdited}
            onCommentDeleted={reviewProps.onCommentDeleted}
            role={reviewProps.role}
        />
      </Panel>
    </Collapse>
  )
}

export default CodeReviewCollapsable
