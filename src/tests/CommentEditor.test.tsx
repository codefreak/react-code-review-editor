import React from 'react'
import { cleanup, screen, render, fireEvent } from '@testing-library/react'
import CommentEditor from '../components/CommentEditor'

afterEach(cleanup)

test('placeholder signals line number', () => {
  render(<CommentEditor onSubmit={() => {}} onCancel={() => {}} line={1} />)
  expect(screen.queryByTestId('textArea')).toHaveProperty(
    'placeholder',
    'Add a comment to line 2 ...'
  )

  cleanup()
  render(<CommentEditor onSubmit={() => {}} onCancel={() => {}} line={154} />)
  expect(screen.queryByTestId('textArea')).toHaveProperty(
    'placeholder',
    'Add a comment to line 155 ...'
  )
})

test('add comment button is enabled when text is present', () => {
  render(<CommentEditor onSubmit={() => {}} onCancel={() => {}} line={1} />)

  fireEvent.change(screen.getByTestId('textArea'), {
    target: { value: 'an input' }
  })
  expect(screen.getByTestId('addCommentButton')).not.toHaveAttribute('disabled')
})

test('add comment button is disabled when no text is present', () => {
  render(<CommentEditor onSubmit={() => {}} onCancel={() => {}} line={1} />)
  expect(screen.getByTestId('addCommentButton')).toHaveAttribute('disabled')
})

test('cancel button calls onCancel prop', () => {
  const handleCancel = jest.fn()
  render(<CommentEditor onSubmit={() => {}} onCancel={handleCancel} line={1} />)

  fireEvent.click(screen.getByTestId('cancelButton'))
  expect(handleCancel).toHaveBeenCalledTimes(1)
})

test('add comment button calls onSubmit prop', () => {
  const handleSubmit = jest.fn()
  render(<CommentEditor onSubmit={handleSubmit} onCancel={() => {}} line={1} />)

  fireEvent.change(screen.getByTestId('textArea'), {
    target: { value: 'an input' }
  })
  fireEvent.click(screen.getByTestId('addCommentButton'))
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})
