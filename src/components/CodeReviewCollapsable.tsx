import React from "react";
import {Collapse} from "antd";
import "antd/dist/antd.css";
import CodeReview, {CodeReviewProps} from "./CodeReview";

const { Panel } = Collapse; 

export interface CodeReviewCollapsableProps  {
    width: number,
    title: string,
    getCodeReviewProps: CodeReviewProps;
}
export const CodeReviewCollapsable: React.FC<CodeReviewCollapsableProps> = ({
                                                                                width,
                                                                                title,
                                                                                getCodeReviewProps
}) => {
    return (
        <Collapse style={{ width: width }}>
            <Panel key={1} header={title}>
                <CodeReview language={getCodeReviewProps.language}
                            code={getCodeReviewProps.code}
                            onAdd={(lineNo) => getCodeReviewProps.onAdd(lineNo)}
                />
            </Panel>
        </Collapse>
    )
}

export default CodeReviewCollapsable;