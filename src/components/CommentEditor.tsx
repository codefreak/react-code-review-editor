import React, {useState} from "react";
import "antd/dist/antd.css";
import "./CommentEditor.css";
import {Input, Button, Space} from 'antd';

const { TextArea } = Input;

export interface CommentEditorProps {
    onSubmit: (value: string) => void
    onCancel: () => void
}

export function extractTargetValue<V, T>(fn: (value: V) => T) {
    return (e: { target: { value: V } }) => fn(e.target.value)
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit, onCancel }) => {
   const [value, setValue] = useState<string>("");

   const handleSubmit = () => {
       onSubmit(value);
   }

    return (
        <div className={"commentEditor"}>
            <TextArea rows={4}
                      placeholder={"Add a comment..."}
                      onChange={extractTargetValue(setValue)}
                      value={value}
            />

            <div className={"controlElements"}>
                <Space>
                    <Button htmlType={"submit"}
                            onClick={onCancel}
                            type={"default"}
                            danger
                    >
                        Cancel
                    </Button>

                    {value && (
                        <Button htmlType={"submit"}
                                onClick={handleSubmit}
                                type={"primary"}
                        >
                            Add Comment
                        </Button>
                    )}

                    {!value && (
                        <Button htmlType={"button"}
                                onClick={onCancel}
                                type={"primary"}
                                disabled
                        >
                            Add Comment
                        </Button>
                    )}
                </Space>
            </div>
        </div>
    )
}

export default CommentEditor;