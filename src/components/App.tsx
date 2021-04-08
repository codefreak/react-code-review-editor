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
}

function App() {
  return (
      <div className={"code"}>
        <CodeReviewCard width={500} title={"testReview.jsx"} getCodeReviewProps={getCodeReviewProps}/>
      </div>
  );
}

export default App;
