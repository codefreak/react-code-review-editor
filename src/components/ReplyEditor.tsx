import React, {useState} from "react";
import {extractTargetValue} from "./CommentEditor";
import {Button, Space} from "antd";
import "./ReplyEditor.css";
import TextArea from "antd/lib/input/TextArea";

export interface ReplyEditorProps {
    onSubmit: (value: string) => void
}

const ReplyEditor: React.FC<ReplyEditorProps> = ({onSubmit}) => {
    const[value, setValue] = useState<string>("");
    const[focused, setFocused] = useState<boolean>(false);
    const [rows, setRows] = useState<number>(1);

    const handleFocus = () => {
        setRows(4);
        setFocused(true);
    }

    const handleSubmit = () => {
        onSubmit(value);
        resetReplyEditor();
    }

    const resetReplyEditor = () => {
        setRows(1);
        setFocused(false);
        setValue("");
    }

    return (
        <div className={"replyEditor"} data-testid="replyEditor">
            <TextArea rows={rows}
                      placeholder={"Reply ..."}
                      onChange={extractTargetValue(setValue)}
                      value={value}
                      onFocus={() => handleFocus()}
                      onBlur={() => {
                          if(value === ""){resetReplyEditor();}
                      }}
                      style={{resize: "none"}}
                      data-testid="textArea"
            />
            {focused && (
                <div className={"controlElementsReply"}>
                    <Space>
                        <Button htmlType="reset"
                                onClick={() => resetReplyEditor()}
                                type="default"
                                data-testid="cancelButton"
                                danger
                        >
                            Cancel
                        </Button>

                        {value && (
                            <Button htmlType="submit"
                                    onClick={() => handleSubmit()}
                                    type="primary"
                                    data-testid="replyButton"
                            >
                                Add Reply
                            </Button>
                        )}

                        {!value && (
                            <Button htmlType="submit"
                                    onClick={() => handleSubmit()}
                                    type="primary"
                                    data-testid="replyButton"
                                    disabled
                            >
                                Add Reply
                            </Button>
                        )}
                    </Space>
                </div>
            )}
        </div>
    )
}

export default ReplyEditor;