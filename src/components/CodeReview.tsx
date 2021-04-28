import React, { useEffect, useState } from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/vsLight'
import { Pre } from './styles'
import './CodeReview.css'
import CodeLine from './CodeLine'
import CommentViewer, { CustomComment } from './CommentViewer'

export interface CodeReviewProps {
  code: string
  language: Language
  commentContainer?: CustomComment[]
  onCommentCreated: (comment: CustomComment) => void
  author: string
  showResult: boolean
  showComments: boolean
}

export const CodeReview: React.FC<CodeReviewProps> = ({
  code,
  language,
  commentContainer,
  onCommentCreated,
  author,
  showResult,
  showComments
}) => {
  const [linesWithComment, setLinesWithComment] = useState<number[]>(
    new Array<number>()
  )
  const [linesWithMildInfo, setLinesWithMildInfo] = useState<number[]>(
    new Array<number>()
  )

  // "constructor"
  useEffect(() => {
    // gather intel about present comments and infos
    if (commentContainer) {
      commentContainer.forEach(comment => {
        if (comment.type === 'comment') {
          addLineWithComment(comment.line!)
        }

        if (comment.type === 'mildInfo') {
          if (!linesWithMildInfo.includes(comment.line!)) {
            setLinesWithMildInfo([...linesWithMildInfo, comment.line!])
          }
        }
      })
    }
  })

  const createComment = (content: string, author: string, line?: number) => {
    let newComment: CustomComment

    if (line) {
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

  // adds a line to the linesWithComment array
  const addLineWithComment = (line: number) => {
    if (!linesWithComment.includes(line)) {
      setLinesWithComment([...linesWithComment, line])
    }
  }

  // returns comments of a given line
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
      if (!element.line || element.type === 'severeInfo') {
        results.push(element)
      }
    })
    return results
  }

  return (
    <div>
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
                    onCommentCreated(createComment(value, author, i))
                  }}
                  mildInfo={linesWithMildInfo.includes(i)}
                  severeInfo={false}
                  commentThread={linesWithComment.includes(i)}
                  comments={getCommentsOfLine(i)}
                  onReplyCreated={value =>
                    onCommentCreated(createComment(value, author, i))
                  }
                  showComments={showComments}
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
            result={true}
            onReplyCreated={value =>
              onCommentCreated(createComment(value, author))
            }
            toggle={true}
          />
        </div>
      )}
    </div>
  )
}

export default CodeReview
