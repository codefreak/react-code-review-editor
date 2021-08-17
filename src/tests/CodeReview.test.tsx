import React from 'react'
import {
  cleanup,
  screen,
  render,
  fireEvent,
  waitFor,
  within
} from '@testing-library/react'
import CodeReview from '../components/CodeReview'
import { CustomComment } from '../types/types'
import moment from 'moment'
afterEach(cleanup)
const nothing = jest.fn()

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim()

test('code passed as a prop gets displayed', () => {
  const mockFunction = jest.fn()
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      onCommentCreated={() => mockFunction}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
      commentContainer={[]}
    />
  )

  expect(screen.getByTestId('line0')).toHaveTextContent(
    '(function someDemo() {'
  )
  expect(screen.getByTestId('line1')).toHaveTextContent(
    'var test = "Hello World!";'
  )
  expect(screen.getByTestId('line2')).toHaveTextContent('console.log(test);')
  expect(screen.getByTestId('line3')).toHaveTextContent('})();')
  expect(screen.getByTestId('line5')).toHaveTextContent('return () => <App />;')
})

test('line numbers get displayed correctly', () => {
  const mockFunction = jest.fn()
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      onCommentCreated={() => mockFunction}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
      commentContainer={[]}
    />
  )
  expect(screen.getByTestId('line0')).toHaveTextContent('1')
  expect(screen.getByTestId('line1')).toHaveTextContent('2')
  expect(screen.getByTestId('line2')).toHaveTextContent('3')
  expect(screen.getByTestId('line3')).toHaveTextContent('4')
  expect(screen.getByTestId('line4')).toHaveTextContent('5')
  expect(screen.getByTestId('line5')).toHaveTextContent('6')
})

test('hover over line displays add button', async () => {
  const mockFunction = jest.fn()
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      onCommentCreated={() => mockFunction}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
      commentContainer={[]}
    />
  )
  fireEvent.mouseEnter(screen.getByTestId('line1'))
  await waitFor(() => screen.getByTestId('addButton'))
  expect(screen.getByTestId('addButton')).toBeInTheDocument()
})

test('klicking the add button opens the comment editor in the correct line', async () => {
  const mockFunction = jest.fn()
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      onCommentCreated={() => mockFunction}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult={false}
      commentContainer={[]}
    />
  )
  fireEvent.mouseEnter(screen.getByTestId('line1'))
  await waitFor(() => screen.getByTestId('addButton'))
  expect(screen.getByTestId('addButton')).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('addButton'))
  expect(
    screen.getByPlaceholderText('Add a Comment to line 2 ...')
  ).toBeInTheDocument()

  // expect line 2 as line id starts at 0
  expect(screen.getByTestId('textArea')).toHaveProperty(
    'placeholder',
    'Add a Comment to line 2 ...'
  )
})

let commentContainer: CustomComment[]

test('comment gets properly added to the correct line', async () => {
  // setup
  commentContainer = []
  const clickCounter = jest.fn()

  const addComment = (value: CustomComment) => {
    commentContainer = [...commentContainer, value]
    clickCounter()
  }

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // hover on line and click add button
  fireEvent.mouseEnter(screen.getByTestId('line1'))
  await waitFor(() => screen.getByTestId('addButton'))
  fireEvent.click(screen.getByTestId('addButton'))
  fireEvent.mouseLeave(screen.getByTestId('line1'))

  // change input of text area and add as comment
  fireEvent.change(screen.getByPlaceholderText('Add a Comment to line 2 ...'), {
    target: { value: 'an input' }
  })
  fireEvent.click(screen.getByTestId('replyButton'))

  // rerender to simulate state change
  cleanup()
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // check if comment got placed in correct line
  await waitFor(() => screen.getByTestId('commentViewer1'))
  expect(screen.getByTestId('commentViewer1')).toHaveTextContent('1 comment')
  fireEvent.click(screen.getByText('1 comment'))
  expect(screen.getByTestId('commentViewer1')).toHaveTextContent('an input')
})

test('Editor placeholder changes depending on the role', async () => {
  commentContainer = []

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  fireEvent.mouseEnter(screen.getByTestId('line1'))
  await waitFor(() => screen.getByTestId('addButton'))
  expect(screen.getByTestId('addButton')).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('addButton'))
  expect(
    screen.getByPlaceholderText('Add a Comment to line 2 ...')
  ).toBeInTheDocument()
  cleanup()

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="student"
      user="Tester"
      showResult
    />
  )

  fireEvent.mouseEnter(screen.getByTestId('line1'))
  await waitFor(() => screen.getByTestId('addButton'))
  expect(screen.getByTestId('addButton')).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('addButton'))
  expect(
    screen.getByPlaceholderText('Add a Question to line 2 ...')
  ).toBeInTheDocument()
})

test('Editor placeholder changes when a comment gets added', async () => {
  const comment1: CustomComment = {
    line: 0,
    author: 'Code Quality',
    content: 'Syntaktischer Zucker in Linie 4',
    type: 'mildInfo',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  commentContainer = [comment1]
  const addComment = (value: CustomComment) => {
    commentContainer = [...commentContainer, value]
  }

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('1 info')).toBeInTheDocument()
  fireEvent.click(screen.getByText('1 info'))

  expect(screen.getByTestId('textArea')).toHaveProperty(
    'placeholder',
    'Add Comment ...'
  )
  fireEvent.change(screen.getByTestId('textArea'), {
    target: { value: 'an input' }
  })
  fireEvent.focus(screen.getByTestId('textArea'))
  fireEvent.click(screen.getByTestId('replyButton'))

  cleanup()

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  await waitFor(() => screen.getByTestId('commentViewer0'))
  expect(screen.getByText('1 comment, 1 info')).toBeInTheDocument()
  fireEvent.click(screen.getByText('1 comment, 1 info'))
  expect(screen.getByTestId('textArea')).toHaveProperty(
    'placeholder',
    'Add Reply ...'
  )
})

test('a line shows the correct annotation symbols', () => {
  // test data for the two annotation symbols
  const comment1: CustomComment = {
    line: 0,
    author: 'Code Quality',
    content: 'Syntaktischer Zucker in Linie 4',
    type: 'mildInfo',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  const comment2: CustomComment = {
    line: 0,
    author: 'Tester',
    content: 'wow',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  commentContainer = [comment1]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // check for mildInfo annotation
  expect(screen.getByTestId('line0')).toBeInTheDocument()
  expect(screen.getByTestId('infoAnnotation')).toBeInTheDocument()
  cleanup()

  // adjust data for next test
  commentContainer.slice(0, 1)
  commentContainer.push(comment2)

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // check for comment annotation
  expect(screen.getByTestId('line0')).toBeInTheDocument()
  expect(screen.getByTestId('commentAnnotation')).toBeInTheDocument()
  cleanup()

  // adjust data
  commentContainer.push(comment1)

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // check for both annotation icons at once
  expect(screen.getByTestId('line0')).toBeInTheDocument()
  expect(screen.getByTestId('commentAnnotation')).toBeInTheDocument()
  expect(screen.getByTestId('infoAnnotation')).toBeInTheDocument()
})

test('result prop shows result', () => {
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('Result')).toBeInTheDocument()
})

test('comments without line get displayed in the result section', () => {
  // test data for the result
  const comment1: CustomComment = {
    author: 'Tester',
    content: 'a result',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const commentContainer = [comment1]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('Result')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Result'))
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('Tester')
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('a result')
})

test('severeInfo gets displayed in the result section', () => {
  // test data for the result
  const comment1: CustomComment = {
    author: 'Tester',
    content: 'a severeInfo',
    type: 'severeInfo',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const commentContainer = [comment1]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('Result')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Result'))
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('Tester')
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('a severeInfo')
})

test('success gets displayed in the result section', () => {
  // test data for the result
  const comment1: CustomComment = {
    author: 'Tester',
    content: 'a success',
    type: 'success',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const commentContainer = [comment1]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('Result')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Result'))
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('Tester')
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('a success')
})

test('present result comments get displayed correctly in the panel extras', () => {
  // test data for the result
  const comment1: CustomComment = {
    author: 'Tester',
    content: 'a success',
    type: 'success',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  const comment2: CustomComment = {
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  const comment3: CustomComment = {
    author: 'Tester',
    content: 'a severInfo',
    type: 'severeInfo',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const commentContainer = [comment1]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  // check for success icon
  expect(screen.getByText('Result')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('resultViewer')).getByTestId('checkIcon')
  ).toBeTruthy()

  cleanup()
  commentContainer.push(comment2)
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  //check for success and comment icons
  expect(screen.getByText('Result')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('resultViewer')).getByTestId('checkIcon')
  ).toBeTruthy()
  expect(
    within(screen.getByTestId('resultViewer')).getByTestId('commentIcon')
  ).toBeTruthy()

  cleanup()
  commentContainer.push(comment3)
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  //check for severInfo icon instead of success icon
  expect(screen.getByText('Result')).toBeInTheDocument()
  expect(
    within(screen.getByTestId('resultViewer')).queryByTestId('checkIcon')
  ).toBeFalsy()
  expect(
    within(screen.getByTestId('resultViewer')).getByTestId('exclamationIcon')
  ).toBeTruthy()
  expect(
    within(screen.getByTestId('resultViewer')).getByTestId('commentIcon')
  ).toBeTruthy()
})

test('shortcut menu opens on click', async () => {
  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByTestId('shortcuts')).toBeInTheDocument()
  expect(screen.getByTestId('shortcutButton')).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('shortcutButton'))
  await waitFor(() => screen.getByTestId('shortcutMenu'))
  expect(screen.getByTestId('shortcutMenu')).toBeInTheDocument()
})

test('expand-all shortcut expands all present comments', async () => {
  const comment1: CustomComment = {
    line: 1,
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const comment2: CustomComment = {
    line: 2,
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const comment3: CustomComment = {
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  commentContainer = [comment1, comment2, comment3]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByTestId('shortcutButton')).toBeInTheDocument()

  //check if content isnt present to check if test starts closed
  expect(screen.getByTestId('commentViewer1')).not.toHaveTextContent(
    'a comment'
  )
  expect(screen.getByTestId('commentViewer2')).not.toHaveTextContent(
    'a comment'
  )
  expect(screen.getByTestId('resultViewer')).not.toHaveTextContent('a comment')

  fireEvent.click(screen.getByTestId('shortcutButton'))
  await waitFor(() => screen.getByTestId('shortcutMenu'))
  fireEvent.click(screen.getByTestId('expandButton'))

  // if content is present the commentviewers are open
  expect(screen.getByTestId('commentViewer1')).toHaveTextContent('a comment')
  expect(screen.getByTestId('commentViewer2')).toHaveTextContent('a comment')
  expect(screen.getByTestId('resultViewer')).toHaveTextContent('a comment')
})

test('show/hide functionality works as expected', async () => {
  const comment1: CustomComment = {
    line: 1,
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const comment2: CustomComment = {
    line: 2,
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }
  const comment3: CustomComment = {
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  commentContainer = [comment1, comment2, comment3]

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={() => nothing}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  //check if content is present
  expect(screen.getByTestId('commentViewer1')).toBeInTheDocument()
  expect(screen.getByTestId('commentViewer2')).toBeInTheDocument()
  expect(screen.getByTestId('resultViewer')).toBeInTheDocument()

  expect(screen.getByTestId('shortcutButton')).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('shortcutButton'))
  await waitFor(() => screen.getByTestId('shortcutMenu'))
  fireEvent.click(screen.getByTestId('showButton'))

  //check if content is present
  expect(screen.queryByTestId('commentViewer1')).not.toBeInTheDocument()
  expect(screen.queryByTestId('commentViewer2')).not.toBeInTheDocument()
  expect(screen.queryByTestId('resultViewer')).not.toBeInTheDocument()

  fireEvent.click(screen.getByTestId('shortcutButton'))
  await waitFor(() => screen.getByTestId('shortcutMenu'))
  fireEvent.click(screen.getByTestId('showButton'))

  expect(screen.getByTestId('commentViewer1')).toBeInTheDocument()
  expect(screen.getByTestId('commentViewer2')).toBeInTheDocument()
  expect(screen.getByTestId('resultViewer')).toBeInTheDocument()
})

test('possible to reply to comments', () => {
  const comment1: CustomComment = {
    line: 1,
    author: 'Tester',
    content: 'a comment',
    type: 'comment',
    timeAdded: moment().format('DD-MM-YY HH:mm')
  }

  commentContainer = [comment1]

  const addComment = (value: CustomComment) => {
    commentContainer = [...commentContainer, value]
  }

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('1 comment')).toBeInTheDocument()
  fireEvent.click(screen.getByText('1 comment'))
  expect(screen.getByTestId('textArea')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Add Reply ...')).toBeInTheDocument()

  fireEvent.focus(screen.getByTestId('textArea'))
  // change input of text area and add as comment
  fireEvent.change(screen.getByTestId('textArea'), {
    target: { value: 'an input' }
  })
  fireEvent.click(screen.getByTestId('replyButton'))

  cleanup()

  render(
    <CodeReview
      code={jsxCode}
      language="jsx"
      commentContainer={commentContainer}
      onCommentCreated={addComment}
      onCommentDeleted={() => nothing}
      onCommentEdited={() => nothing}
      role="teacher"
      user="Tester"
      showResult
    />
  )

  expect(screen.getByText('2 comments')).toBeInTheDocument()
  fireEvent.click(screen.getByText('2 comments'))
  expect(screen.getByText('an input')).toBeInTheDocument()
})
