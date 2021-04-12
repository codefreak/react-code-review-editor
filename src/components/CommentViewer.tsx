import React from "react";
import {Collapse, Comment} from "antd";
import "./CommentViewer.css";
import ReplyEditor from "./ReplyEditor";

const { Panel } = Collapse;

export interface CommentViewerProps {
    comments: CustomComment[];
    onReplyCreated: (value: string) => void
}

export type CustomComment = {
    author: string;
    content: string;
    line: number;
}

export const CommentViewer: React.FC<CommentViewerProps> = ({comments, onReplyCreated}) => {
    const getHeader = () => {
        const commentNumber = comments.length;
        if(commentNumber === 1) {
            return commentNumber + " comment";
        } else {
            return commentNumber + " comments";
        }
    }

    return(
        <div className="commentViewer">
            <Collapse className="commentViewerCollapse">
                <Panel key={1} header={getHeader()} className="customPanel">
                    {comments.map(((comment, key) =>
                            <Comment key={key} content={comment.content} author={comment.author}/>
                    ))}
                    <ReplyEditor onSubmit={onReplyCreated} />
                </Panel>
            </Collapse>
        </div>
    )
}

export default CommentViewer;