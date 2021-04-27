import React from "react";
import {Card} from "antd";
import "antd/dist/antd.css";
import "./CodeReview.css";
import CodeReview, {CodeReviewProps} from "./CodeReview";
import {Language} from "prism-react-renderer";
import {CustomComment} from "./CommentViewer";

const cardBodyStyle = {
    paddingTop: "0.5em",
    paddingBottom: "0em"
}

export interface CodeReviewCardProps {
    width: number,
    title: string,
    code: string;
    language: Language;
    commentContainer?: CustomComment[];
    onCommentCreated: (comment: CustomComment) => void;
    author: string;
    showResult: boolean;
}

export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({
                                                                  width ,
                                                                  title,
                                                                  code,
                                                                  language,
                                                                  commentContainer,
                                                                  onCommentCreated, author,
                                                                  showResult
}) => {
    return (
            <Card style={{ width: width }}
                  title={title} className="codeReview"
                  bodyStyle={cardBodyStyle}
                  bordered={true}
                  size={"small"}
            >
                <CodeReview code={code}
                            author={author}
                            language={language}
                            commentContainer={commentContainer}
                            onCommentCreated={onCommentCreated}
                            showResult={showResult}
                />
            </Card>
        )
}

export default CodeReviewCard;