import React from 'react'
import {
  CodeReviewCollapsable,
  CodeReviewCollapsableProps
} from '../components/CodeReviewCollapsable'
import { Story, Meta } from '@storybook/react/types-6-0'
import { CustomComment } from '../types/types'
import { forceReRender } from '@storybook/react'
import moment from "moment";

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
  content: 'Falcoooon PUNCH!!',
  type: 'comment',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const customComment2: CustomComment = {
  line: 3,
  author: 'Spock',
  content: 'Live long and prosper.',
  type: 'comment',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

let customCommentContainer = [customComment1, customComment2]

const handleCommentEdited = (
  oldComment: CustomComment,
  newComment: CustomComment,
  story: Story<CodeReviewCollapsableProps>
) => {
  if (
    story.args &&
    story.args.reviewProps &&
    story.args.reviewProps.commentContainer
  ) {
    const index = story.args.reviewProps.commentContainer.findIndex(
      element => element === oldComment
    )
    if (index > 1) {
      story.args.reviewProps.commentContainer[index] = newComment
      forceReRender()
    }
  }
}

const handleCommentCreated = (
  comment: CustomComment,
  story: Story<CodeReviewCollapsableProps>
) => {
  if (
    story.args &&
    story.args.reviewProps &&
    story.args.reviewProps.commentContainer
  ) {
    customCommentContainer = [...customCommentContainer, comment]
    story.args.reviewProps.commentContainer = customCommentContainer
  }
  forceReRender()
}

const handleCommentDeleted = (
  comment: CustomComment,
  story: Story<CodeReviewCollapsableProps>
) => {
  if (
    story.args &&
    story.args.reviewProps &&
    story.args.reviewProps.commentContainer
  ) {
    const index = story.args.reviewProps.commentContainer.findIndex(
      element => element === comment
    )
    if (index > -1) {
      customCommentContainer.splice(index, 1)
      story.args.reviewProps.commentContainer = customCommentContainer
      forceReRender()
    }
  }
}

export const jsx = Template.bind({})
jsx.args = {
  reviewProps: {
    code: jsxCode,
    language: 'jsx',
    showResult: true,
    commentContainer: customCommentContainer,
    onCommentCreated: comment => handleCommentCreated(comment, jsx),
    onCommentDeleted: comment => handleCommentDeleted(comment, jsx),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, jsx),
    user: 'Storybook Tester',
    role: "student"
  },
  width: 500,
  title: 'testReview.jsx'
}
