import Header from './header';
import { useEffect } from 'react';

function Steps(){
    const steps = sessionStorage.getItem('steps');

    useEffect(()=>{
        if(typeof window?.MathJax !== "undefined"){
          window.MathJax.typeset();
        }
        document.getElementById('steps').innerHTML = steps;
      },[])

    return (
        <section>
            <Header />
            <div id='steps' style={{ margin: 'clamp(40px, 10vw, 120px) 2vw 3vh' }} />
        </section>
    );
}

export default Steps;