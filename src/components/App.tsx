import React from 'react';
import './App.css';
import CodeReviewCard from "./CodeReviewCard";
import CommentEditor from "./CommentEditor";
import {CodeReviewProps} from "./CodeReview";

const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

const getCodeReviewProps: CodeReviewProps = {
    code: exampleCode,
    language: "jsx",
    onAdd: (lineNo) => alert(lineNo + 1)
}

function App() {
  return (
      <div className={"code"}>
        <CodeReviewCard width={500} title={"testReview.jsx"} getCodeReviewProps={getCodeReviewProps}/>
        <CommentEditor onSubmit={(value) => {console.log(value)}} />
      </div>
  );
}

export default App;
