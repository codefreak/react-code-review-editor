import React from 'react'
import { cleanup, screen, render, fireEvent } from '@testing-library/react'
import CommentViewer, { CustomComment } from '../components/CommentViewer'

afterEach(cleanup)

const comment1: CustomComment = {
  line: 0,
  author: 'Captain Falcon',
  content: 'Falcoooon PUNCH!!',
  type: 'comment'
}

const comment2: CustomComment = {
  line: 0,
  author: 'Spock',
  content: 'Live long and prosper.',
  type: 'comment'
}

const commentContainer = [comment1]

test('title displays comment count', () => {
  const mockFunction = jest.fn()
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={value => mockFunction}
      toggle
    />
  )
  expect(screen.getByTestId('commentViewer')).toHaveTextContent('1 comment')
  cleanup()

  commentContainer.push(comment2)
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={value => mockFunction}
      toggle
    />
  )
  expect(screen.getByTestId('commentViewer')).toHaveTextContent('2 comments')
})

test('comments get displayed correctly', () => {
  const mockFunction = jest.fn()
  render(
    <CommentViewer
      comments={commentContainer}
      onCommentCreated={value => mockFunction}
      toggle
    />
  )

  fireEvent.click(screen.getByText('2 comments'))
  expect(screen.getByTestId('comments')).toHaveTextContent('Captain Falcon')
  expect(screen.getByTestId('comments')).toHaveTextContent('Falcoooon PUNCH!!')
  expect(screen.getByTestId('comments')).toHaveTextContent('Spock')
  expect(screen.getByTestId('comments')).toHaveTextContent(
    'Live long and prosper.'
  )
})
