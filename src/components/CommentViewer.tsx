import React from "react";
import {Collapse, Comment} from "antd";
import "./CommentViewer.css";

const { Panel } = Collapse;

export interface CodeViewerProps {
    comments: CustomComment[];
}

export type CustomComment = {
    author: string;
    content: string;
    line: number;
}


export const CommentViewer: React.FC<CodeViewerProps> = ({comments}) => {
    const getLineNumber = () => {
        const lineNumber = comments[0].line + 1;
        return "line " + lineNumber;
    }

    const getHeader = () => {
        const commentNumber = comments.length;
        if(commentNumber === 1) {
            return commentNumber + " comment";
        } else {
            return commentNumber + " comments";
        }
    }

    return(
        <Collapse defaultActiveKey={1} style={{padding: 0}} ghost>
            <Panel key={1} header={getHeader()} extra={getLineNumber()} className={"customPanel"}>
                {comments.map(((comment) =>
                        <Comment content={comment.content} author={comment.author} style={{ paddingLeft: "2em" }}/>
                ))}
            </Panel>
        </Collapse>
    )
}

export default CommentViewer;