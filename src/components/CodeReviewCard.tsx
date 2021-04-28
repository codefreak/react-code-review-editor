import React from 'react'
import { Card } from 'antd'
import 'antd/dist/antd.css'
import './CodeReview.css'
import CodeReview, {CodeReviewProps} from './CodeReview'


const cardBodyStyle = {
  paddingTop: '0.5em',
  paddingBottom: '0em'
}

export interface CodeReviewCardProps {
  width: number
  title: string
  reviewProps: CodeReviewProps
}

export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({
  width,
  title,
  reviewProps
}) => {
  return (
    <Card
      style={{ width: width }}
      title={title}
      className="codeReview"
      bodyStyle={cardBodyStyle}
      bordered
      size={'small'}
    >
      <CodeReview
        code={reviewProps.code}
        author={reviewProps.author}
        language={reviewProps.language}
        commentContainer={reviewProps.commentContainer}
        onCommentCreated={reviewProps.onCommentCreated}
        showResult={reviewProps.showResult}
        showComments={reviewProps.showComments}
      />
    </Card>
  )
}

export default CodeReviewCard
