import React, {useState} from "react";
import {Line, LineContent, LineNo} from "./styles";
import {Button} from "antd";
import { PlusOutlined, ExclamationCircleTwoTone, InfoCircleTwoTone, MessageTwoTone } from '@ant-design/icons';
import CommentEditor from "./CommentEditor";
import CommentViewer, {CustomComment} from "./CommentViewer";

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
    mildInfo: boolean,
    severeInfo: boolean,
    commentThread: boolean,
    comments: CustomComment[]
    onReplyCreated: (value: string) => void
}

export const CodeLine: React.FC<CodeLineProps> = ({line,
                                                      lineNo,
                                                      getLineProps,
                                                      getTokenProps,
                                                      onSubmit,
                                                      mildInfo,
                                                      severeInfo,
                                                      commentThread,
                                                      comments,
                                                      onReplyCreated
                                                      }) => {

    // isShown manages visibility of addButton
    const [isShown, setIsShown] = useState(false);
    const lineNoRef = React.createRef<HTMLSpanElement>();
    const [isEditorShown, setIsEditorShown] = useState(false);
    const [collapseState, setCollapseState] = useState<boolean>(false)

    const getPaddingLeft = () => {
        if((commentThread && !(mildInfo || severeInfo))
            || (mildInfo && !(commentThread ||severeInfo))
            || (severeInfo && !(commentThread || mildInfo))) {
            return 2.95;
        }
        if((commentThread && mildInfo && !severeInfo)
            || (mildInfo && severeInfo && !commentThread)
            || (commentThread && severeInfo && !mildInfo)) {
            return 1.65
        }
        if(commentThread && mildInfo && severeInfo) {
            return 0.35
        }
        return 4.3;
    }

    const handleMouseEnter = () => {
        if(!commentThread) {
            lineNoRef.current!.style.paddingLeft = (getPaddingLeft() - 1.5) + getPaddingLeftOffset() + "em";
            setIsShown(true);
        }
    }

    const handleMouseLeave = () => {
        lineNoRef.current!.style.paddingLeft = getPaddingLeft() + getPaddingLeftOffset() + "em";
        setIsShown(false)
    }

    const handleAdd = () => {
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
                  data-testid={"line" + lineNo}
            >
                <div className="lineLeft">
                    {isShown && (
                        <>
                            <Button icon={<PlusOutlined style={{paddingLeft: "0.1em"}}/>}
                                    size="small"
                                    onClick={() => handleAdd()}
                                    style={{width: "1.5em", height: "1.5em"}}
                                    data-testid="addButton"
                            />
                        </>
                    )}

                    {severeInfo && (
                        <ExclamationCircleTwoTone style={{ paddingLeft: "0.15em",paddingRight: "0.15em"}}
                                                  onClick={() => setCollapseState(!collapseState)}
                                                  twoToneColor="#F00E3B"
                        />

                    )}

                    {mildInfo && (
                        <InfoCircleTwoTone style={{paddingLeft: "0.15em", paddingRight: "0.15em"}}
                                           twoToneColor="#FAC302"
                                           onClick={() => setCollapseState(!collapseState)}
                        />

                    )}

                    {commentThread && (
                        <MessageTwoTone style={{paddingLeft: "0.15em", paddingRight: "0.15em"}}
                                        onClick={() => setCollapseState(!collapseState)}
                        />
                    )}

                    <LineNo style={{paddingLeft: getPaddingLeft() + getPaddingLeftOffset() + "em"}} ref={lineNoRef}>
                        {lineNo + 1}
                    </LineNo>
                </div>

                <LineContent>
                    {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                </LineContent>
            </Line>

            {commentThread &&(
                <div data-testid={"commentViewer" + lineNo}>
                    <CommentViewer comments={comments}
                                   toggle={collapseState}
                                   onReplyCreated={onReplyCreated}
                    />
                </div>
            )}

            {isEditorShown && (
                <CommentEditor onCancel={() => setIsEditorShown(false)}
                               line={lineNo}
                               onSubmit={(value) => {
                    onSubmit(value);
                    setIsEditorShown(false);
                }}/>
            )}
        </>
    )
}

export default CodeLine;