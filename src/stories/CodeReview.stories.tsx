import React from 'react';
import {CodeReview, CodeReviewProps} from "../components/CodeReview";
import { Story, Meta } from '@storybook/react/types-6-0';


export default {
    component: CodeReview,
    title: 'CodeReviewCard'
} as Meta;

const Template: Story<CodeReviewProps> = (args) => <CodeReview {...args} />;

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

export const Default = Template.bind({});
Default.args = {
    code: jsxCode,
    language: "jsx",
    width: 500
}