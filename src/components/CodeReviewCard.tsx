import React from "react";
import {Card} from "antd";
import "antd/dist/antd.css";
import "./CodeReview.css";
import CodeReview, {CodeReviewProps} from "./CodeReview";

const cardBodyStyle = {
    paddingTop: "0.5em",
    paddingBottom: "0em"
}

export interface CodeReviewCardProps {
    width: number,
    title: string,
    getCodeReviewProps: CodeReviewProps
}

export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({
                                                          getCodeReviewProps,
                                                          width ,
                                                          title,
}) => {
    return (
            <Card style={{ width: width }}
                  title={title} className="codeReview"
                  bodyStyle={cardBodyStyle}
                  bordered={true}
                  size={"small"}
            >
                <CodeReview code={getCodeReviewProps.code}
                            author={getCodeReviewProps.author}
                            language={getCodeReviewProps.language}
                            commentContainer={getCodeReviewProps.commentContainer}
                            onCommentCreated={getCodeReviewProps.onCommentCreated}
                />
            </Card>
        )
}

export default CodeReviewCard;