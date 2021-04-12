import React, {useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {extractTargetValue} from "./CommentEditor";
import {Button, Space} from "antd";
import "./ReplyEditor.css";

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
        <div className={"replyEditor"}>
            <TextArea rows={rows}
                      placeholder={"Reply ..."}
                      onChange={extractTargetValue(setValue)}
                      value={value}
                      onFocus={() => handleFocus()}
            />
            {focused && (
                <div className={"controlElementsReply"}>
                    <Space>
                        <Button htmlType="submit"
                                onClick={() => resetReplyEditor()}
                                type="default"
                                danger
                        >
                            Cancel
                        </Button>

                        {value && (
                            <Button htmlType="submit"
                                    onClick={() => handleSubmit()}
                                    type="primary"
                            >
                                Add Reply
                            </Button>
                        )}

                        {!value && (
                            <Button htmlType="button"
                                    onClick={() => handleSubmit()}
                                    type="primary"
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