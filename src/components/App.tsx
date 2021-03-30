import React from 'react';
import './App.css';
import CodeReview from "./CodeReview";

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
        <CodeReview code={exampleCode} language={"jsx"} width={500}/>
      </div>
  );
}

export default App;
