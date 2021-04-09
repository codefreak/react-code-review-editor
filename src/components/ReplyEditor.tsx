import React, {useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {extractTargetValue} from "./CommentEditor";
import {Button, Space} from "antd";
import {ReplyEditorProps} from "./CommentViewer";
import "./ReplyEditor.css";

const ReplyEditor: React.FC<ReplyEditorProps> = ({onSubmit}) => {
    const[value, setValue] = useState<string>("");
    const[focused, setFocused] = useState<boolean>(false);
    const [rows, setRows] = useState<number>(1);

    const handleFocusChange = () => {
        if(focused) {
            setRows(1);
            setFocused(false);
            setValue("");
        } else {
            setRows(4);
            setFocused(true);
        }
    }

    return (
        <div className={"replyEditor"}>
            <TextArea rows={rows}
                      placeholder={"Reply ..."}
                      onChange={extractTargetValue(setValue)}
                      value={value}
                      onFocus={() => handleFocusChange()}
                      onBlur={() => handleFocusChange()}
            />
            {focused && (
                <div className={"controlElementsReply"}>
                    <Space>
                        <Button htmlType={"submit"}
                                onClick={() => setFocused(false)}
                                type={"default"}
                                danger
                        >
                            Cancel
                        </Button>

                        {value && (
                            <Button htmlType={"submit"}
                                    onClick={() => onSubmit(value)}
                                    type={"primary"}
                            >
                                Add Reply
                            </Button>
                        )}

                        {!value && (
                            <Button htmlType={"button"}
                                    onClick={() => onSubmit(value)}
                                    type={"primary"}
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