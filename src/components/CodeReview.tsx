import React, {useState} from "react";
import Highlight, {defaultProps, Language} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsLight";
import {Pre} from "./styles";
import "./CodeReview.css";
import CodeLine from "./CodeLine";

export interface CodeReviewProps {
    code: string;
    language: Language;
}

export const CodeReview: React.FC<CodeReviewProps> = ({
                                                          code,
                                                          language,
}) => {
    const [currentLine, setCurrentLine] = useState<number>();

    return (
        <Highlight {...defaultProps} theme={theme} code={code} language={language}>
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <Pre className={className} style={style}>
                            {tokens.map((line, i) => (
                                <>
                                    <CodeLine lineNo={i}
                                              line={line}
                                              getLineProps={getLineProps}
                                              getTokenProps={getTokenProps}
                                              onAdd={(lineNo) => setCurrentLine(lineNo)}
                                              onSubmit={(value) => alert(value)}
                                    />
                                </>
                            ))}
                        </Pre>
                    )}
        </Highlight>
    )
}

export default CodeReview;
