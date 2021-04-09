import React, {useState} from "react";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsLight";
import {Pre} from "./styles";
import "./CodeReview.css";
import CodeLine from "./CodeLine";
import CommentViewer, {CustomComment} from "./CommentViewer";

export interface CodeReviewProps {
    code: string;
    language: Language;
}


export const CodeReview: React.FC<CodeReviewProps> = ({
                                                          code,
                                                          language,
}) => {
    const [currentLine, setCurrentLine] = useState<number>(0);
    const [commentContainer, setCommentContainer] = useState<CustomComment[]>();
    const [linesWithComment, setLinesWithComment] = useState<number[]>(new Array<number>());

    const addComment = (line: number, content: string, author?: string) => {
        const newComment: CustomComment = {
            line: line,
            content: content,
            author : "placeholder"
        }

        if(!commentContainer) {
            const newCommentContainer = new Array<CustomComment>(newComment);
            setCommentContainer(newCommentContainer)
        } else {
            const copyCommentContainer = commentContainer;

            copyCommentContainer.push(newComment);
            setCommentContainer(copyCommentContainer);
        }

        addCommentLine(line);
    }

    const addCommentLine = (line: number) => {
        if(!linesWithComment.includes(line)) {
           const commentLineCopy = linesWithComment;
           commentLineCopy.push(line);
           setLinesWithComment(commentLineCopy);
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


    return (
        <Highlight {...defaultProps} theme={theme} code={code} language={language}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <Pre className={className} style={style}>
                            {tokens.map((line, i) => (
                                <>
                                    <CodeLine lineNo={i}
                                              line={line}
                                              getLineProps={getLineProps}
                                              getTokenProps={getTokenProps}
                                              onAdd={(lineNo) => setCurrentLine(lineNo)}
                                              onSubmit={(value) => addComment(currentLine, value)}
                                              allowAdd={!linesWithComment.includes(i)}
                                    />
                                    {linesWithComment.includes(i) && (
                                        <CommentViewer comments={getCommentsOfLine(i)} />
                                    )}
                                </>
                            ))}
                        </Pre>
                    )}
        </Highlight>
    )
}

export default CodeReview;
