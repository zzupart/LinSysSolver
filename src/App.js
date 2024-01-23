import React from 'react';
import './App.css';
import { MathJaxContext } from 'better-react-mathjax';
import Main from './layouts/main';

function App() {
  return (
    <MathJaxContext>
      <Main />
    </MathJaxContext>
  );
}

export default App;