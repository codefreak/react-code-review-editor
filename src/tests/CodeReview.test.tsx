import React from 'react';
import {cleanup, screen, render, fireEvent, waitFor} from '@testing-library/react';
import CodeReview from "../components/CodeReview";

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