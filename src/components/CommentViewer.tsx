import React from "react";
import {Collapse, Comment} from "antd";

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
    return(
        <Collapse>
            <Panel key={1} header={"Comment"}>
                {comments.map(((comment) =>
                        <Comment content={comment.content} author={comment.author} />
                ))}
            </Panel>
        </Collapse>
    )
}

export default CommentViewer;