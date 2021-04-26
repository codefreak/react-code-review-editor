import React, {useEffect, useState} from "react";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsLight";
import {Pre} from "./styles";
import "./CodeReview.css";
import CodeLine from "./CodeLine";
import {CustomComment} from "./CommentViewer";

export interface CodeReviewProps {
    code: string;
    language: Language;
    commentContainer?: CustomComment[];
    onCommentCreated: (comment: CustomComment) => void;
}


export const CodeReview: React.FC<CodeReviewProps> = ({
                                                          code,
                                                          language,
                                                          commentContainer,
                                                          onCommentCreated
}) => {
    const [linesWithComment, setLinesWithComment] = useState<number[]>(new Array<number>());

    // "constructor"
    useEffect(() => {
        if(commentContainer) {
            commentContainer.forEach(comment => {
                addCommentLine(comment.line);
            })
        }
    })

    const createComment = (line: number, content: string, author: string) => {
        const newComment: CustomComment = {
            line: line,
            content: content,
            author : author
        }

        return newComment;
    }

    const addCommentLine = (line: number) => {
        if(!linesWithComment.includes(line)) {
            setLinesWithComment([...linesWithComment, line]);
        }
    }

    const getCommentsOfLine = (line: number) => {
        const CommentsOfLine = new Array<CustomComment>();
        commentContainer?.forEach(element => {
            if(element.line === line) {
                CommentsOfLine.push(element);
            }
        })
        return CommentsOfLine;
    }

    const mockOne = (line: number) => {
        if(line === 4) return true
        return line === 3;

    }

    const mockTwo = (line: number) => {
        if(line === (4)) return true
        if(line === 3) return true
        return line === 7;
    }

    return (
        <Highlight {...defaultProps} theme={theme} code={code} language={language} >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <Pre className={className} style={style} data-testid="highlight">
                            {tokens.map((line, i) => (
                                <div key={i}>
                                    <CodeLine lineNo={i}
                                              line={line}
                                              getLineProps={getLineProps}
                                              getTokenProps={getTokenProps}
                                              onSubmit={(value) => {onCommentCreated(createComment(i, value, "placeholder"))}}
                                              mildInfo={mockOne(i)}
                                              severeInfo={mockTwo(i)}
                                              commentThread={linesWithComment.includes(i)}
                                              comments={getCommentsOfLine(i)}
                                              onReplyCreated={(value) => onCommentCreated(createComment(i, value, "placeholder"))}
                                    />
                                </div>
                            ))}
                        </Pre>
                    )}
        </Highlight>
    )
}

export default CodeReview;
