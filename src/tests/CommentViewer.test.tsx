import React from 'react';
import {cleanup, screen, render} from '@testing-library/react';
import CommentViewer, {CustomComment} from "../components/CommentViewer";

afterEach(cleanup);

const customComment1: CustomComment = {
    line: 0,
    author: "Captain Falcon",
    content: "Falcoooon PUNCH!!"
}

const customComment2: CustomComment = {
    line: 3,
    author: "Spock",
    content: "Live long and prosper."
}

let customCommentContainer = [customComment1];

test('title displays comment count', () => {
    render(<CommentViewer comments={customCommentContainer} onReplyCreated={(value => console.log(value))}/>)

    expect(screen.getByRole('header')).toHaveTextContent('1 comment')
})