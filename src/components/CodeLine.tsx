import React, {useState} from "react";
import {Line, LineContent, LineNo} from "./styles";
import {Button} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import CommentEditor from "./CommentEditor";

// types needed for react-prism-renderer props
type Token = {
    types: string[];
    content: string;
    empty?: boolean;
};

type LineInputProps = {
    key?: React.Key;
    style?: StyleObj;
    className?: string;
    line: Token[];
    [otherProp: string]: any;
};

type TokenInputProps = {
    key?: React.Key;
    style?: StyleObj;
    className?: string;
    token: Token;
    [otherProp: string]: any;
};

type TokenOutputProps = {
    key?: React.Key;
    style?: StyleObj;
    className: string;
    children: string;
    [otherProp: string]: any;
};

type LineOutputProps = {
    key?: React.Key;
    style?: StyleObj;
    className: string;
    [otherProps: string]: any;
};

type StyleObj = {
    [key: string]: string | number | null;
};

export interface CodeLineProps {
    line: Token[],
    lineNo: number,
    getLineProps: (input: LineInputProps) => LineOutputProps,
    getTokenProps: (input: TokenInputProps) => TokenOutputProps,
    onSubmit: (value: string) => void,
    allowAdd: boolean,
}

export const CodeLine: React.FC<CodeLineProps> = ({line,
                                                      lineNo,
                                                      getLineProps,
                                                      getTokenProps,
                                                      onSubmit,
                                                      allowAdd,
                                                      }) => {

    // isShown manages visibility of addButton
    const [isShown, setIsShown] = useState(false);
    const lineNoRef = React.createRef<HTMLSpanElement>();
    const [isEditorShown, setIsEditorShown] = useState(false);


    const paddingEnter = 0.5;
    const paddingLeave = 2;

    const handleMouseEnter = () => {
        if(allowAdd) {
            lineNoRef.current!.style.paddingLeft = paddingEnter + getPaddingLeftOffset() + "em";
            setIsShown(true);
        }
    }

    const handleMouseLeave = () => {
        lineNoRef.current!.style.paddingLeft = paddingLeave + getPaddingLeftOffset() + "em";
        setIsShown(false)
    }

    const handleAdd = (lineNo: number) => {
        setIsEditorShown(true);
    }

    const getPaddingLeftOffset = () => {
        if(lineNo < 9) {
            return 0.55
        } else {
            return 0
        }
    }

    return (
        <>
            <Line key={lineNo}
                  {...getLineProps({ line, key: lineNo })}
                  onMouseEnter={() => handleMouseEnter()}
                  onMouseLeave={() => handleMouseLeave()}
            >
                <div className="lineLeft">
                    {isShown && (
                        <>
                            <Button icon={<PlusOutlined />}
                                    size="small"
                                    onClick={() => handleAdd(lineNo)}
                                    style={{width: "1.5em", height: "1.5em"}}
                            />
                        </>
                    )}
                    <LineNo style={{paddingLeft: 2 + getPaddingLeftOffset() + "em"}} ref={lineNoRef}>
                        {lineNo + 1}
                    </LineNo>
                </div>

                <LineContent>
                    {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                </LineContent>
            </Line>

            {isEditorShown && (
                <CommentEditor onCancel={() => setIsEditorShown(false)}
                               onSubmit={(value) => {
                    onSubmit(value);
                    setIsEditorShown(false);
                }}/>
            )}
        </>


    )
}

export default CodeLine;