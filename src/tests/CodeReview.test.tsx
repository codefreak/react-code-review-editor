import React from 'react'
import {
  cleanup,
  screen,
  render,
  fireEvent,
  waitFor
} from '@testing-library/react'
import CodeReview from '../components/CodeReview'
import { CustomComment } from '../types/types'
import moment from "moment";
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

  expect(screen.getByTestId('textArea')).toHaveProperty('placeholder', 'Add Comment ...')
  fireEvent.change(screen.getByTestId('textArea'), {
    target: { value: 'an input' }
  })
  fireEvent.focus(screen.getByTestId('textArea'))
  fireEvent.click((screen.getByTestId('replyButton')))

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
  expect(screen.getByTestId('textArea')).toHaveProperty('placeholder', 'Add Reply ...')

})
