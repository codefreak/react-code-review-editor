import React, {useRef, useState} from "react";
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
    onAdd: (lineNo: number) => void,
    onSubmit: (value: string) => void,
    allowAdd: boolean,
}

export const CodeLine: React.FC<CodeLineProps> = ({line,
                                                      lineNo,
                                                      getLineProps,
                                                      getTokenProps,
                                                      onAdd,
                                                      onSubmit,
                                                      allowAdd,
                                                      }) => {

    // isShown manages visibility of addButton
    const [isShown, setIsShown] = useState(false);
    const lineNoRef = useRef<HTMLSpanElement>(null);
    const [isEditorShown, setIsEditorShown] = useState(false);


    const paddingEnter = "2em";
    const paddingLeave = "4em";

    //TODO ohne @ts-ignore implementieren
    const handleMouseEnter = () => {
        if(allowAdd) {
            // @ts-ignore
            lineNoRef.current.style.paddingLeft= paddingEnter;
            setIsShown(true);
        }
    }

    //TODO ohne @ts-ignore implementieren
    const handleMouseLeave = () => {
        // @ts-ignore
        lineNoRef.current.style.paddingLeft = paddingLeave;
        setIsShown(false)
    }

    const handleAdd = (lineNo: number) => {
        setIsEditorShown(true);
        onAdd(lineNo);
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
                                    style={{width: "1.5em", height: "1.5em", marginLeft: "0.5em"}}
                            />
                        </>
                    )}
                    <LineNo style={{paddingLeft: "4em"}} ref={lineNoRef}>{lineNo + 1}</LineNo>
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