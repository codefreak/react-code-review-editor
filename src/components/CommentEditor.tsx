import React, {useState} from "react";
import "antd/dist/antd.css";
import { Input, Form, Button } from 'antd';

const { TextArea } = Input;

export interface CommentEditorProps {
    onSubmit: (value: string | undefined) => void
}

export function extractTargetValue<V, T>(fn: (value: V) => T) {
    return (e: { target: { value: V } }) => fn(e.target.value)
}

export const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit }) => {
   const [value, setValue] = useState<string>();

   const handleSubmit = () => {
       onSubmit(value);
   }

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
                <Button htmlType={"submit"} onClick={handleSubmit} type={"primary"}>Add Comment</Button>
            </Form.Item>
        </>

    )
}

export default CommentEditor;