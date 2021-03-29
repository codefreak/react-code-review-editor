import React from "react";
import {Card} from "antd";
import CodeReview from "./CodeReview";

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

export interface CodeReviewCardProps  {
    code: string;
    language: Language;
}
export const CodeReviewCard: React.FC<CodeReviewCardProps> = ({ code, language }) => {
    return (
            <Card style={{ width: 500 }}>
                <CodeReview code={code} language={language}/>
            </Card>
        )
}

export default CodeReviewCard;