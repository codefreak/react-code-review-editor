import React from 'react';
import {cleanup, screen, render, fireEvent} from '@testing-library/react';
import ReplyEditor from "../components/ReplyEditor";

afterEach(cleanup);

test("add reply button is disabled when no text is present", () => {
    render(<ReplyEditor onSubmit={value => console.log(value)}/>)

    fireEvent.focus(screen.getByPlaceholderText("Reply ..."))
    expect(screen.getByTestId("replyButton")).toHaveAttribute("disabled")
})

test("add reply button is enabled when text is present", () => {
    render(<ReplyEditor onSubmit={value => console.log(value)}/>)

    fireEvent.focus(screen.getByPlaceholderText("Reply ..."))
    fireEvent.change(screen.getByPlaceholderText("Reply ..."), {target: { value: "an input"} })
    expect(screen.getByTestId("replyButton")).not.toHaveAttribute("disabled")
})

test("component calls onSubmit when clicked", () => {
    const handleSubmit = jest.fn();
    render(<ReplyEditor onSubmit={handleSubmit}/>)

    fireEvent.focus(screen.getByPlaceholderText("Reply ..."))
    fireEvent.change(screen.getByPlaceholderText("Reply ..."), {target: { value: "an input"} })
    fireEvent.click(screen.getByTestId("replyButton"))
    expect(handleSubmit).toHaveBeenCalledTimes(1)

})