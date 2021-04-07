import React from "react";
import {CommentEditor, CommentEditorProps} from "../components/CommentEditor"
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
    component: CommentEditor,
    title: 'CommentEditor'
} as Meta;

const Template: Story<CommentEditorProps> = (args) => <CommentEditor {...args} />;

export const Editor = Template.bind({});
Editor.args = {
    onSubmit: (value) => {console.log(value)}
}