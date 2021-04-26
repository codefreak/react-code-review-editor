import React, {useEffect, useState} from "react";
import {Collapse, Comment} from "antd";
import "./CommentViewer.css";
import ReplyEditor from "./ReplyEditor";
import {ExclamationCircleTwoTone, InfoCircleTwoTone} from "@ant-design/icons";

const { Panel } = Collapse;

export interface CommentViewerProps {
    comments: CustomComment[]
    onReplyCreated: (value: string) => void
    toggle: boolean
    result?: boolean
    replyType: string
}

export type CustomComment = {
    author?: string;
    content: string;
    line?: number;
    type: "comment" | "mildInfo" | "severeInfo"
}

export const CommentViewer: React.FC<CommentViewerProps> = ({comments,
                                                                onReplyCreated,
                                                                toggle,
                                                                result,
                                                                replyType
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
    }, [toggle, oldToggleState, activeKey])

    const getHeader = () => {
        if(result) {
            return "Result"
        }
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

    const getType = () => {
        let noComment = true;
        comments.forEach(element => {
            if(element.type === "comment") {
                noComment = false;
            }
        })
        if(noComment) {
            return "result"
        } else {
            return "reply"
        }

    }

    return(
        <div className="commentViewer" data-testid="commentViewer">
            <Collapse className="commentViewerCollapse" activeKey={activeKey} onChange={handleKeyChange}>
                <Panel  key={1} header={getHeader()} className="customPanel">
                    {!result ? (
                        <>
                            <div data-testid="comments">
                                {comments.map((comment, key) => {
                                    if((comment.type === "comment") && (comment.line)) {
                                        return  <Comment key={key}
                                                         content={comment.content}
                                                         author={comment.author}
                                        />
                                    }
                                })}
                            </div>
                            <ReplyEditor onSubmit={onReplyCreated}
                                         type={replyType}
                            />
                            <div style={{paddingTop: "0.5em"}}>
                                {comments.map((comment, key) => {
                                    if(comment.type === "mildInfo") {
                                        return <Comment key={key}
                                                        content={comment.content}
                                                        author={
                                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                                <InfoCircleTwoTone twoToneColor="#FAC302"
                                                                                   style={{
                                                                                       paddingTop: "0.25em",
                                                                                       paddingRight: "0.5em"
                                                                                   }}
                                                                />
                                                                <p>{comment.author}</p>
                                                            </div>
                                                        }
                                        />
                                    }
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {comments.map((comment, key) => {
                                if((comment.type === "comment") && (!comment.line)) {
                                    return  <Comment key={key}
                                                     content={comment.content}
                                                     author={comment.author}
                                    />
                                }
                            })}
                            <ReplyEditor onSubmit={onReplyCreated}
                                         type={getType()}
                            />
                            <div style={{paddingTop: "0.5em"}}>
                                {comments.map((comment, key) => {
                                    if(comment.type === "severeInfo") {
                                        return <Comment key={key}
                                                        content={comment.content}
                                                        author={
                                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                                <ExclamationCircleTwoTone twoToneColor="#F00E3B"
                                                                                   style={{
                                                                                       paddingTop: "0.25em",
                                                                                       paddingRight: "0.5em"
                                                                                   }}
                                                                />
                                                                <p>{comment.author}</p>
                                                            </div>
                                                        }
                                        />
                                    }
                                })}
                            </div>
                        </>
                    )}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CommentViewer;