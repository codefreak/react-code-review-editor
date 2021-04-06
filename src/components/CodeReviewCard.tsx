import React from "react";
import {Card} from "antd";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import {Pre} from "./styles";
import "antd/dist/antd.css";
import "./CodeReview.css";
import CodeLine from "./CodeLine";

export interface CodeReviewCardProps  {
    code: string;
    language: Language;
    width: number;
    title: string;
}

const cardBodyStyle = {
    padding: 0
}

export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({
                                                          code,
                                                          language,
                                                          width ,
                                                          title
}) => {
    return (
            <Card style={{ width: width }}
                  title={title} className={"codeReview"}
                  bodyStyle={cardBodyStyle}
                  bordered={true}
            >
                <Highlight {...defaultProps} theme={theme} code={code} language={language}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <Pre className={className} style={style}>
                            {tokens.map((line, i) => (
                                <CodeLine lineNo={i}
                                          line={line}
                                          getLineProps={getLineProps}
                                          getTokenProps={getTokenProps}
                                          onAdd={(lineNo) => console.log(lineNo)}
                                />
                            ))}
                        </Pre>
                    )}
                </Highlight>
            </Card>
        )
}

export default CodeReviewCard;