import React from 'react';
import './App.less';
import CodeReviewCard from "./CodeReviewCard";

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
      </div>
  );
}

export default App;
