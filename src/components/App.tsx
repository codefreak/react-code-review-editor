import React from 'react';
import './App.less';
import CodeReviewCard from "./CodeReviewCard";
import CommentEditor from "./CommentEditor";

const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

function App() {
  return (
      <div className={"code"}>
        <CodeReviewCard code={exampleCode}
                        language={"jsx"}
                        width={500}
                        title={"testReview.jsx"}
        />
        <CommentEditor onSubmit={() => {}} />
      </div>
  );
}

export default App;
