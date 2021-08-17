# react-code-review-editor
The react-code-review-editor is a React component providing an environment for educational code review purposes.
It supports a variety of languages.

![review-editor-screenshot](./screenshot.PNG)

This project was developed as part of a thesis at FH Kiel to be integrated into the CodeFREAK project. The development
process included a usability test with students and teachers at said institution to deliver a component with good usability.

## Features
- [x] display syntax highlighted code 
- [x] create and display comments inside the code 
- [x] create and display results
- [x] different comment types with their own annotation symbols for better usability
- [x] keyboard shortcuts 

## Development
For developing and getting to know the components through storybook examples:
```shell script
git clone https://github.com/codefreak/react-code-review-editor.git
yarn install
yarn storybook
```

## Installation
For using the components:
```shell script
yarn add react-code-review-editor
yarn install
```

## License
The source code for all packages in ./src is licensed under the MIT license, which you can find in the LICENSE 
file.