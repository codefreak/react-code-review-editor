import React from 'react'
import {
  CodeReviewCard,
  CodeReviewCardProps
} from '../components/CodeReviewCard'
import { Story, Meta } from '@storybook/react/types-6-0'
import { CustomComment } from '../components/CommentViewer'
import { forceReRender } from '@storybook/react'

export default {
  component: CodeReviewCard,
  title: 'CodeReviewCard'
} as Meta

const Template: Story<CodeReviewCardProps> = args => {
  return <CodeReviewCard {...args} />
}

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim()

const cssCode = `
.contentLayout {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: inherit;
    min-height: inherit;
}

.layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: inherit;
    height: inherit;
}

#root {
    min-height: inherit;
    height: inherit;
}

html,
body {
    min-height: 80vh;
    -webkit-font-smoothing: subpixel-antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    text-transform: none !important;
    text-rendering: optimizeLegibility !important;
}

header {
    height: 50px !important;
}`.trim()

const cppCode = `
#include "matrix.h"
#include "zeile.h"

Matrix::Matrix(int _nrows, int _ncols) {
    this->nrows = _nrows;
    this->ncols = _ncols;
    this->mat = new Zeile*[_nrows];

    for(int i = 0; i < _ncols; i++) {
        this->mat[i] = new Zeile(_nrows);
    }
}

Matrix::Matrix(int z, int s, int wert) {
    this->nrows = z;
    this->ncols = s;
    this->mat = new Zeile*[z];

    for(int i = 0; i < s; i++) {
        this->mat[i] = new Zeile(z);
        for(int j = 0; j < z; i++ ) {
            mat[i][j] = wert;
        }
    }
}

/* TODO: Kopierkonstruktor */`.trim()

const customComment1: CustomComment = {
  author: 'Teacher',
  content: 'Das war ja wohl nichts.',
  type: 'comment'
}

const customComment2: CustomComment = {
  line: 3,
  author: 'Spock',
  content: 'Live long and prosper.',
  type: 'comment'
}

const customComment3: CustomComment = {
  line: 1,
  author: 'Code Quality',
  content: 'Syntaktischer Zucker in Linie 4',
  type: 'mildInfo'
}

const customComment4: CustomComment = {
  author: 'Test1',
  content: `
    Expected: 10
    But was: 0
    `,
  type: 'severeInfo'
}

let customCommentContainer = [
  customComment1,
  customComment2,
  customComment3,
  customComment4
]

const handleCommentEdited = (
  oldComment: CustomComment,
  newComment: CustomComment,
  story: Story<CodeReviewCardProps>
) => {
  if (
      story.args &&
      story.args.reviewProps &&
      story.args.reviewProps.commentContainer
  ) {
    const index = story.args.reviewProps.commentContainer.findIndex(element => element === oldComment)
    if(index > 1) {
      story.args.reviewProps.commentContainer[index] = newComment
      forceReRender()
    }
  }
}

const handleCommentCreated = (comment: CustomComment, story: Story<CodeReviewCardProps>) => {
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

const handleCommentDeleted = (comment: CustomComment, story: Story<CodeReviewCardProps>) => {
  if (
      story.args &&
      story.args.reviewProps &&
      story.args.reviewProps.commentContainer
  ) {
    const index = story.args.reviewProps.commentContainer.findIndex(element => element === comment)
    if(index > -1) {
      story.args.reviewProps.commentContainer.splice(index, 1)
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
    onCommentEdited: (oldComment, newComment) => handleCommentEdited(oldComment, newComment, jsx),
    showComments: true,
    user: 'Storybook Tester'
  },
  width: 500,
  title: 'testReview.jsx'
}

export const css = Template.bind({})
css.args = {
  reviewProps: {
    code: cssCode,
    language: 'css',
    showResult: true,
    commentContainer: customCommentContainer,
    onCommentCreated: (comment => handleCommentCreated(comment, css)),
    onCommentDeleted: comment => handleCommentDeleted(comment, css),
    onCommentEdited: (oldComment, newComment) => handleCommentEdited(oldComment, newComment, css),
    showComments: true,
    user: 'Storybook Tester'
  },
  width: 600,
  title: 'layout.css'
}

export const cpp = Template.bind({})
cpp.args = {
  reviewProps: {
    code: cppCode,
    language: 'cpp',
    showResult: false,
    commentContainer: customCommentContainer,
    onCommentCreated: (comment => handleCommentCreated(comment, cpp)),
    onCommentDeleted: comment => handleCommentDeleted(comment, cpp),
    onCommentEdited: (oldComment, newComment) => handleCommentEdited(oldComment, newComment, cpp),
    showComments: false,
    user: 'Storybook Tester'
  },
  width: 500,
  title: 'matrix.cpp'
}
