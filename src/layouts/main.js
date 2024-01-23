import React from 'react';
import  { Routes, Route } from 'react-router-dom';
import Intro from '../components/intro';
import Input, { CoefProvider } from '../components/input';
import Solve from '../components/solve';
import Steps from '../components/steps';

function Main() {
    return (
        <main>
            <div className='static-background'/>

            <Routes>
                <Route exact path="/" element={ <Intro /> }/>
                <Route path="/input" element={ <CoefProvider> <Input /> </CoefProvider>}/>
                <Route path="/solve/:method" element={ <CoefProvider> <Solve /> </CoefProvider> }/>
                <Route path="/solve/:method/steps" element={ <Steps /> }/>
            </Routes>
        </main>
    );
}

export default Main;