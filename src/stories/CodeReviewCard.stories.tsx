import React from 'react';
import {CodeReviewCard, CodeReviewCardProps} from "../components/CodeReviewCard";
import { Story, Meta } from '@storybook/react/types-6-0';


export default {
    componenet: CodeReviewCard,
    title: 'CodeReviewCard'
} as Meta;

const Template: Story<CodeReviewCardProps> = (args) => <CodeReviewCard {...args} />;

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
    language: "jsx"
}