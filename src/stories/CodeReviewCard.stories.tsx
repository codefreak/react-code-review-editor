import React from 'react';
import {CodeReviewCard, CodeReviewCardProps} from "../components/CodeReviewCard";
import { Story, Meta } from '@storybook/react/types-6-0';
import {CustomComment} from "../components/CommentViewer";
import {forceReRender} from "@storybook/react";


export default {
    component: CodeReviewCard,
    title: 'CodeReviewCard'
} as Meta;


const Template: Story<CodeReviewCardProps> = (args) => {
    return (
        <CodeReviewCard {...args} />
    )
}

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

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
}`.trim();

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

/* TODO: Kopierkonstruktor */`.trim();

const customComment1: CustomComment = {
    author: "Teacher",
    content: "Das war ja wohl nichts.",
    type: "comment"
}

const customComment2: CustomComment = {
    line: 3,
    author: "Spock",
    content: "Live long and prosper.",
    type: "comment"
}

const customComment3: CustomComment = {
    line: 1,
    author: "Code Quality",
    content: "Syntaktischer Zucker in Linie 4",
    type: "mildInfo"
}

const customComment4: CustomComment = {
    author: "Test1",
    content: `
    Expected: 10
    But was: 0
    `,
    type: "severeInfo"
}

let customCommentContainer = [customComment1, customComment2, customComment3, customComment4];

const handleCommentCreatedJsx = (comment: CustomComment) => {
    jsx.args!.commentContainer = [...jsx.args!.commentContainer!, comment]
    forceReRender();
}

const handleCommentCreatedCss = (comment: CustomComment) => {
    css.args!.commentContainer = [...css.args!.commentContainer!, comment]
    forceReRender();
}

const handleCommentCreatedCpp = (comment: CustomComment) => {
    cpp.args!.commentContainer = [...cpp.args!.commentContainer!, comment]
    forceReRender();
}

export let jsx = Template.bind({});
jsx.args = {
    author: "Storybook Tester",
    code: jsxCode,
    language: "jsx",
    showResult: true,
    commentContainer:  customCommentContainer,
    onCommentCreated: handleCommentCreatedJsx,
    width: 500,
    title: "testReview.jsx",
    showComments: true

}

export const css = Template.bind({});
css.args = {
    author: "Storybook Tester",
    code: cssCode,
    language: "css",
    showResult: true,
    commentContainer:  customCommentContainer,
    onCommentCreated: handleCommentCreatedCss,
    width: 600,
    title: "layout.css",
    showComments: true
}

export const cpp = Template.bind({});
cpp.args = {
    author: "Storybook Tester",
    code: cppCode,
    language: "cpp",
    showResult: false,
    commentContainer:  customCommentContainer,
    onCommentCreated: handleCommentCreatedCpp,
    width: 500,
    title: "matrix.cpp",
    showComments: false
}