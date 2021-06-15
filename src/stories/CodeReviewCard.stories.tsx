import React from 'react'
import {
  CodeReviewCard,
  CodeReviewCardProps
} from '../components/CodeReviewCard'
import { Story, Meta } from '@storybook/react/types-6-0'
import { CustomComment } from '../types/types'
import { forceReRender } from '@storybook/react'
import moment from 'moment'

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
  type: 'comment',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const customComment2: CustomComment = {
  line: 3,
  author: 'Lehrpersonal',
  content: 'Dieser Teil ist ausbaufähig.',
  type: 'comment',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const customComment3: CustomComment = {
  line: 1,
  author: 'Code Quality',
  content: 'Use const for readonly values.',
  type: 'mildInfo',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const customComment4: CustomComment = {
  author: 'Test1',
  content: `Expected: 10\nBut was: 0`,
  type: 'severeInfo',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const customComment5: CustomComment = {
  author: 'Test2',
  content: `Test2 passed without error.`,
  type: 'success',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

let customCommentContainer = [
  customComment1,
  customComment2,
  customComment3,
  customComment4,
  customComment5
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
  story: Story<CodeReviewCardProps>
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
  story: Story<CodeReviewCardProps>
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

export const jsxWithResult = Template.bind({})
jsxWithResult.args = {
  reviewProps: {
    code: jsxCode,
    language: 'jsx',
    showResult: true,
    commentContainer: customCommentContainer,
    onCommentCreated: comment => handleCommentCreated(comment, jsxWithResult),
    onCommentDeleted: comment => handleCommentDeleted(comment, jsxWithResult),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, jsxWithResult),
    user: 'Storybook Tester',
    role: 'student'
  },
  width: 700,
  title: 'testReview.jsx'
}

export const jsxWithoutResult = Template.bind({})
jsxWithoutResult.args = {
  reviewProps: {
    code: jsxCode,
    language: 'jsx',
    showResult: false,
    commentContainer: customCommentContainer,
    onCommentCreated: comment =>
      handleCommentCreated(comment, jsxWithoutResult),
    onCommentDeleted: comment =>
      handleCommentDeleted(comment, jsxWithoutResult),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, jsxWithoutResult),
    user: 'Storybook Tester',
    role: 'student'
  },
  width: 700,
  title: 'testReview.jsx'
}

export const css = Template.bind({})
css.args = {
  reviewProps: {
    code: cssCode,
    language: 'css',
    showResult: true,
    commentContainer: customCommentContainer,
    onCommentCreated: comment => handleCommentCreated(comment, css),
    onCommentDeleted: comment => handleCommentDeleted(comment, css),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, css),
    user: 'Storybook Tester',
    role: 'teacher'
  },
  width: 700,
  title: 'layout.css'
}

export const cppStudent = Template.bind({})
cppStudent.args = {
  reviewProps: {
    code: cppCode,
    language: 'cpp',
    showResult: false,
    commentContainer: customCommentContainer,
    onCommentCreated: comment => handleCommentCreated(comment, cppStudent),
    onCommentDeleted: comment => handleCommentDeleted(comment, cppStudent),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, cppStudent),
    user: 'Storybook Tester',
    role: 'student'
  },
  width: 700,
  title: 'matrix.cpp'
}

export const cppTeacher = Template.bind({})
cppTeacher.args = {
  reviewProps: {
    code: cppCode,
    language: 'cpp',
    showResult: false,
    commentContainer: customCommentContainer,
    onCommentCreated: comment => handleCommentCreated(comment, cppTeacher),
    onCommentDeleted: comment => handleCommentDeleted(comment, cppTeacher),
    onCommentEdited: (oldComment, newComment) =>
      handleCommentEdited(oldComment, newComment, cppTeacher),
    user: 'Storybook Tester',
    role: 'teacher'
  },
  width: 700,
  title: 'matrix.cpp'
}
