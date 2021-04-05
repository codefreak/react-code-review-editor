import React, {EventHandler, useState} from "react";
import "antd/dist/antd.css";
import { Input, Form, Button } from 'antd';

const { TextArea } = Input;

export interface CommentEditorProps {
    onSubmit: EventHandler<any>
}

export function extractTargetValue<V, T>(fn: (value: V) => T) {
    return (e: { target: { value: V } }) => fn(e.target.value)
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit }) => {
   const [value, setValue] = useState<string>();

    return (
        <>
            <Form.Item>
                <TextArea rows={4}
                          placeholder={"Add a comment..."}
                          onChange={extractTargetValue(setValue)}
                          value={value}
                />
            </Form.Item>
            <Form.Item>
                <Button htmlType={"submit"} onClick={(e) => {console.log(value)}} type={"primary"}>Add Comment</Button>
            </Form.Item>
        </>

    )
}

export default CommentEditor;