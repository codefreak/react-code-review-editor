import React from 'react';
import {CodeReviewCollapsable, CodeReviewCollapsableProps} from "../components/CodeReviewCollapsable";
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
    component: CodeReviewCollapsable,
    title: 'CodeReviewCollapsable'
} as Meta;

const Template: Story<CodeReviewCollapsableProps> = (args) => <CodeReviewCollapsable {...args} />;

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

export const Collapsable = Template.bind({});
Collapsable.args = {
    getCodeReviewProps: {
        code: jsxCode,
        language: "jsx",
        onAdd: (lineNo) => alert(lineNo + 1)
    },
    width: 500,
    title: "testReview.jsx"
}