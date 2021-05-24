import React from 'react'
import { cleanup, screen, render } from '@testing-library/react'
import { CustomComment } from '../types/types'
import CommentViewer from '../components/CommentViewer'
import moment from 'moment'
afterEach(cleanup)
const nothing = jest.fn()

const comment1: CustomComment = {
  line: 0,
  author: 'Captain Falcon',
  content: 'Falcoooon PUNCH!!',
  type: 'comment',
  timeAdded: '23-05-21 13:26'
}

const comment2: CustomComment = {
  line: 3,
  author: 'Spock',
  content: 'Live long and prosper.',
  type: 'comment',
  timeAdded: '23-05-21 13:26'
}

const comment3: CustomComment = {
  line: 3,
  author: 'Code Quality',
  content: 'Syntaktischer Zucker in Linie 4',
  type: 'mildInfo',
  timeAdded: moment().format('DD-MM-YY HH:mm')
}

const commentContainer = [comment1]

test('title displays comment count', () => {
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={() => nothing}
      onCommentEdited={() => nothing}
      onCommentDeleted={() => nothing}
      onToggle={() => nothing}
      active={false}
      user="Tester"
    />
  )
  expect(screen.getByTestId('commentViewer')).toHaveTextContent('1 comment')
  cleanup()

  commentContainer.push(comment2)
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={() => nothing}
      onCommentEdited={() => nothing}
      onCommentDeleted={() => nothing}
      onToggle={() => nothing}
      active={false}
      user="Tester"
    />
  )
  expect(screen.getByTestId('commentViewer')).toHaveTextContent('2 comments')
})

test("comment's content gets displayed correctly", () => {
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={() => nothing}
      onCommentEdited={() => nothing}
      onCommentDeleted={() => nothing}
      onToggle={() => nothing}
      active
      user="Tester"
    />
  )

  expect(screen.getByTestId('comments')).toHaveTextContent('Captain Falcon')
  expect(screen.getByTestId('comments')).toHaveTextContent('Falcoooon PUNCH!!')
  expect(screen.getByTestId('comments')).toHaveTextContent('Spock')
  expect(screen.getByTestId('comments')).toHaveTextContent(
    'Live long and prosper.'
  )
})

test('comments display their creation time correctly', () => {
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={() => nothing}
      onCommentEdited={() => nothing}
      onCommentDeleted={() => nothing}
      onToggle={() => nothing}
      active
      user="Tester"
    />
  )

  expect(screen.getByTestId('comment0')).toHaveTextContent('23-05-21 13:26')
})

test('title displays present comment types', () => {
  commentContainer.push(comment3)
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={() => nothing}
      onCommentEdited={() => nothing}
      onCommentDeleted={() => nothing}
      onToggle={() => nothing}
      active={false}
      user="Tester"
    />
  )
  expect(screen.getByTestId('commentViewer')).toHaveTextContent(
    '2 comments, 1 info'
  )
})
