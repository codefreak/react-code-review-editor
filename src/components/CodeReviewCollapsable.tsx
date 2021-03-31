import React from "react";
import {Collapse} from "antd";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import {Line, LineContent, LineNo, Pre} from "./styles";
import "antd/dist/antd.css";

const { Panel } = Collapse; 

export interface CodeReviewCollapsableProps  {
    code: string;
    language: Language;
    width: number;
    title: string;
}
export const CodeReviewCollapsable: React.FC<CodeReviewCollapsableProps> = ({
                                                                  code,
                                                                  language,
                                                                  width ,
                                                                  title
                                                              }) => {
    return (
        <Collapse style={{ width: width }}>
            <Panel key={1} header={title}>
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
            </Panel>
        </Collapse>
    )
}

export default CodeReviewCollapsable;