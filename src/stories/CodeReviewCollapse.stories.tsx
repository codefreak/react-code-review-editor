import React from 'react'
import {
  CodeReviewCollapsable,
  CodeReviewCollapsableProps
} from '../components/CodeReviewCollapsable'
import { Story, Meta } from '@storybook/react/types-6-0'
import { CustomComment } from '../components/CommentViewer'
import { forceReRender } from '@storybook/react'

export default {
  component: CodeReviewCollapsable,
  title: 'CodeReviewCollapsable'
} as Meta

const Template: Story<CodeReviewCollapsableProps> = args => (
  <CodeReviewCollapsable {...args} />
)

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim()

const customComment1: CustomComment = {
  line: 0,
  author: 'Captain Falcon',
  content: 'Falcoooon PUNCH!!'
}

const customComment2: CustomComment = {
  line: 3,
  author: 'Spock',
  content: 'Live long and prosper.'
}

let customCommentContainer = [customComment1, customComment2]

const handleCommentCreatedJsx = (comment: CustomComment) => {
  jsx.args!.getCodeReviewProps!.commentContainer = [
    ...jsx.args!.getCodeReviewProps!.commentContainer!,
    comment
  ]
  forceReRender()
}

export const jsx = Template.bind({})
jsx.args = {
  getCodeReviewProps: {
    code: jsxCode,
    language: 'jsx',
    commentContainer: customCommentContainer,
    onCommentCreated: handleCommentCreatedJsx
  },
  width: 500,
  title: 'testReview.jsx'
}
