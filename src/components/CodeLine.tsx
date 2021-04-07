import React, {useRef, useState} from "react";
import {Line, LineContent, LineNo} from "./styles";
import {Button, Space} from "antd";
import { PlusOutlined } from '@ant-design/icons';


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
    lineNo: number
    getLineProps: (input: LineInputProps) => LineOutputProps;
    getTokenProps: (input: TokenInputProps) => TokenOutputProps;
    onAdd: (lineNo: number) => void;
}

export const CodeLine: React.FC<CodeLineProps> = ({line,
                                                      lineNo,
                                                      getLineProps,
                                                      getTokenProps,
                                                      onAdd}) => {

    // isShown manages visibility of addButton
    const [isShown, setIsShown] = useState(false);
    const lineNoRef = useRef<HTMLSpanElement>(null);

    const paddingEnter = "2em";
    const paddingLeave = "4em";

    const handleMouseEnter = () => {
        // @ts-ignore
        lineNoRef.current.style.paddingLeft= paddingEnter;
        setIsShown(true);
    }

    const handleMouseLeave = () => {
        // @ts-ignore
        lineNoRef.current.style.paddingLeft = paddingLeave;
        setIsShown(false)
    }

    return (
        <Line key={lineNo}
              {...getLineProps({ line, key: lineNo })}
              onMouseEnter={() => handleMouseEnter()}
              onMouseLeave={() => handleMouseLeave()}
        >
            <div className={"lineLeft"} >
                {isShown && (
                    <>
                        <Space size={"small"}></Space>
                        <Button icon={<PlusOutlined />}
                                size={"small"}
                                onClick={() => onAdd(lineNo)}
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
    )
}

export default CodeLine;