import React from "react";
import {Card} from "antd";
import "antd/dist/antd.css";
import "./CodeReview.css";
import CodeReview, {CodeReviewProps} from "./CodeReview";

const cardBodyStyle = {
    padding: 0
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
                  title={title} className={"codeReview"}
                  bodyStyle={cardBodyStyle}
                  bordered={true}
            >
                <CodeReview code={getCodeReviewProps.code}
                            language={getCodeReviewProps.language}
                            onAdd={(lineNo) => getCodeReviewProps.onAdd(lineNo)}
                />
            </Card>
        )
}

export default CodeReviewCard;