import React from 'react';
import {CodeReviewCard, CodeReviewCardProps} from "../components/CodeReviewCard";
import { Story, Meta } from '@storybook/react/types-6-0';


export default {
    component: CodeReviewCard,
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

export const jsx = Template.bind({});
jsx.args = {
    code: jsxCode,
    language: "jsx",
    width: 500,
    title: "testReview.jsx",
    onAdd: (lineNo) => alert(lineNo + 1)
}

export const css = Template.bind({});
css.args = {
    code: cssCode,
    language: "css",
    width: 600,
    title: "layout.css",
    onAdd: (lineNo) => alert(lineNo + 1)
}

export const cpp = Template.bind({});
cpp.args = {
    code: cppCode,
    language: "cpp",
    width: 500,
    title: "matrix.cpp",
    onAdd: (lineNo) => alert(lineNo + 1)
}