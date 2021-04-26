import React, {useEffect, useState} from "react";
import {Collapse, Comment} from "antd";
import "./CommentViewer.css";
import ReplyEditor from "./ReplyEditor";

const { Panel } = Collapse;

export interface CommentViewerProps {
    comments: CustomComment[]
    onReplyCreated: (value: string) => void
    toggle: boolean
}

export type CustomComment = {
    author: string;
    content: string;
    line: number;
}

export const CommentViewer: React.FC<CommentViewerProps> = ({comments,
                                                                onReplyCreated,
                                                                toggle
}) => {
    const [activeKey, setActiveKey] = useState<string | string[]>("0")
    const [oldToggleState, setOldToggleState] = useState<boolean>(false)

    useEffect(() => {
        if(toggle !== oldToggleState) {
            if(activeKey === "0") {
                setActiveKey("1")
            } else {
                setActiveKey("0")
            }
        }
        setOldToggleState(toggle)
    })

    const getHeader = () => {
        const commentNumber = comments.length;
        if(commentNumber === 1) {
            return commentNumber + " comment";
        } else {
            return commentNumber + " comments";
        }
    }

    const handleKeyChange = (key: string | string[]) => {
        setActiveKey(key)
    }

    return(
        <div className="commentViewer" data-testid="commentViewer">
            <Collapse className="commentViewerCollapse" activeKey={activeKey} onChange={handleKeyChange}>
                <Panel  key={1} header={getHeader()} className="customPanel">
                    <div data-testid="comments">
                        {comments.map(((comment, key) =>
                                <Comment key={key} content={comment.content} author={comment.author}/>
                        ))}
                    </div>
                    <ReplyEditor onSubmit={onReplyCreated} />
                </Panel>
            </Collapse>
        </div>
    )
}

export default CommentViewer;