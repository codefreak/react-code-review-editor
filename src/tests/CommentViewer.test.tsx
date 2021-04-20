import React from 'react';
import {cleanup, screen, render, fireEvent} from '@testing-library/react';
import CommentViewer, {CustomComment} from "../components/CommentViewer";

afterEach(cleanup);

const comment1: CustomComment = {
    line: 0,
    author: "Captain Falcon",
    content: "Falcoooon PUNCH!!"
}

const comment2: CustomComment = {
    line: 3,
    author: "Spock",
    content: "Live long and prosper."
}

let commentContainer = [comment1];

test("title displays comment count", () => {
    render(<CommentViewer comments={commentContainer} onReplyCreated={(value => console.log(value))}/>)
    expect(screen.getByTestId('commentViewer')).toHaveTextContent('1 comment')
    cleanup()

    commentContainer.push(comment2)
    render(<CommentViewer comments={commentContainer} onReplyCreated={(value => console.log(value))}/>)
    expect(screen.getByTestId('commentViewer')).toHaveTextContent('2 comments')
})

test("comments get displayed", () => {
    render(<CommentViewer comments={commentContainer} onReplyCreated={(value => console.log(value))}/>)

    fireEvent.click(screen.getByText('2 comments'))
    expect(screen.getByTestId('comments')).toHaveTextContent('Captain Falcon')
    expect(screen.getByTestId('comments')).toHaveTextContent('Falcoooon PUNCH!!')
    expect(screen.getByTestId('comments')).toHaveTextContent('Spock')
    expect(screen.getByTestId('comments')).toHaveTextContent('Live long and prosper.')
})