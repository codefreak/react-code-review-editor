import React from 'react';
import {cleanup, screen, render, fireEvent, waitFor} from '@testing-library/react';
import CodeReview from "../components/CodeReview";
import {CustomComment} from "../components/CommentViewer";

afterEach(cleanup)

const jsxCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

test("code passed as a prop gets displayed", () => {
    render(<CodeReview code={jsxCode} language={"jsx"} onCommentCreated={() => {}}/>)

    expect(screen.getByTestId("line0")).toHaveTextContent("(function someDemo() {")
    expect(screen.getByTestId("line1")).toHaveTextContent("var test = \"Hello World!\";")
    expect(screen.getByTestId("line2")).toHaveTextContent("console.log(test);")
    expect(screen.getByTestId("line3")).toHaveTextContent("})();")
    expect(screen.getByTestId("line5")).toHaveTextContent("return () => <App />;")
})

test("line numbers get displayed correctly", () => {
    render(<CodeReview code={jsxCode} language={"jsx"} onCommentCreated={() => {}}/>)
    expect(screen.getByTestId("line0")).toHaveTextContent("1")
    expect(screen.getByTestId("line1")).toHaveTextContent("2")
    expect(screen.getByTestId("line2")).toHaveTextContent("3")
    expect(screen.getByTestId("line3")).toHaveTextContent("4")
    expect(screen.getByTestId("line4")).toHaveTextContent("5")
    expect(screen.getByTestId("line5")).toHaveTextContent("6")
})

test("hover over line displays add button", async () => {
    render(<CodeReview code={jsxCode} language={"jsx"} onCommentCreated={() => {}}/>)
    fireEvent.mouseEnter(screen.getByTestId("line1"))
    await waitFor(() => screen.getByTestId("addButton"))
    expect(screen.getByTestId("addButton")).toBeInTheDocument()
})

test("klicking the add button opens the comment editor in the correct line", async () => {
    render(<CodeReview code={jsxCode} language={"jsx"} onCommentCreated={() => {}}/>)
    fireEvent.mouseEnter(screen.getByTestId("line1"))
    await waitFor(() => screen.getByTestId("addButton"))
    fireEvent.click(screen.getByTestId("addButton"))
    expect(screen.getByTestId("textArea")).toBeInTheDocument()

    // expect line 2 as line id starts at 0
    expect(screen.getByTestId("textArea")).toHaveProperty("placeholder","Add a comment to line 2 ...")
})

let commentContainer: CustomComment[];


test("comment gets properly added to the correct line", async () => {

    // setup
    commentContainer = []
    const clickCounter = jest.fn()
    const addComment = (value: CustomComment) => {
        commentContainer = [...commentContainer, value];
        clickCounter();
    }

    render(<CodeReview code={jsxCode}
                       language={"jsx"}
                       commentContainer={commentContainer}
                       onCommentCreated={addComment}/>)

    // hover on line and click add button
    fireEvent.mouseEnter(screen.getByTestId("line1"))
    await waitFor(() => screen.getByTestId("addButton"))
    fireEvent.click(screen.getByTestId("addButton"))
    fireEvent.mouseLeave(screen.getByTestId("line1"))

    // change input of text area and add as comment
    fireEvent.change(screen.getByTestId("textArea"), {target: { value: "an input"} })
    fireEvent.click(screen.getByTestId("addCommentButton"))

    // rerender to simulate state change
    cleanup()
    render(<CodeReview code={jsxCode}
                       language={"jsx"}
                       commentContainer={commentContainer}
                       onCommentCreated={addComment}/>)

    // check if comment got placed in correct line
    await waitFor(() => screen.getByTestId("commentViewer1"))
    expect(screen.getByTestId("commentViewer1")).toHaveTextContent("1 comment")
    fireEvent.click(screen.getByText('1 comment'))
    expect(screen.getByTestId("commentViewer1")).toHaveTextContent("an input")
})