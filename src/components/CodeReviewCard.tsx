import React from "react";
import {Card} from "antd";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsLight";
import {Line, LineContent, LineNo, Pre} from "./styles";
import "antd/dist/antd.css";

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
                  type={"inner"}
            >
                <Highlight {...defaultProps} theme={theme} code={code} language={language}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <Pre className={className} style={style}>
                            {tokens.map((line, i) => (
                                <Line key={i} {...getLineProps({ line, key: i })}>
                                    <LineNo>{i + 1}</LineNo>
                                    <LineContent>
                                        {line.map((token, key) => (
                                            <span key={key} {...getTokenProps({ token, key })} />
                                        ))}
                                    </LineContent>
                                </Line>
                            ))}
                        </Pre>
                    )}
                </Highlight>
            </Card>
        )
}

export default CodeReviewCard;