import React from "react";
import {Card} from "antd";
import Highlight, {defaultProps} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/github";
import {Line, LineContent, LineNo, Pre} from "./styles";

type Language =
    | "markup"
    | "bash"
    | "clike"
    | "c"
    | "cpp"
    | "css"
    | "javascript"
    | "jsx"
    | "coffeescript"
    | "actionscript"
    | "css-extr"
    | "diff"
    | "git"
    | "go"
    | "graphql"
    | "handlebars"
    | "json"
    | "less"
    | "makefile"
    | "markdown"
    | "objectivec"
    | "ocaml"
    | "python"
    | "reason"
    | "sass"
    | "scss"
    | "sql"
    | "stylus"
    | "tsx"
    | "typescript"
    | "wasm"
    | "yaml";

export interface CodeReviewProps  {
    code: string;
    language: Language;
    width: number;
}
export const CodeReview: React.FC<CodeReviewProps> = ({ code, language, width }) => {
    return (
            <Card style={{ width: width }}>
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

export default CodeReview;