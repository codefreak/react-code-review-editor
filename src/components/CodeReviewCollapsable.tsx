import React from 'react'
import { Collapse } from 'antd'
import 'antd/dist/antd.css'
import CodeReview, { CodeReviewProps } from './CodeReview'
import './CodeReviewCollapsable.css'

const { Panel } = Collapse

export interface CodeReviewCollapsableProps {
  width: number
  title: string
  getCodeReviewProps: CodeReviewProps
}
export const CodeReviewCollapsable: React.FC<CodeReviewCollapsableProps> = ({
  width,
  title,
  getCodeReviewProps
}) => {
  return (
    <Collapse style={{ width: width }} defaultActiveKey={1}>
      <Panel key={1} header={title}>
        <CodeReview
          language={getCodeReviewProps.language}
          code={getCodeReviewProps.code}
          commentContainer={getCodeReviewProps.commentContainer}
          onCommentCreated={getCodeReviewProps.onCommentCreated}
        />
      </Panel>
    </Collapse>
  )
}

export default CodeReviewCollapsable
