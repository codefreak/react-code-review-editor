import React from 'react';
import './App.css';
import CodeReviewCard from "./components/CodeReviewCard";

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
        <CodeReviewCard code={exampleCode} language={"jsx"}/>
      </div>
  );
}

export default App;
