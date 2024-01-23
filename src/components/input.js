import { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJax } from 'better-react-mathjax';
import Header from './header';

const CoefContext = createContext();

export function CoefProvider({children}){
    const [coefInput, setCoefInput] = useState([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);

    return (
        <CoefContext.Provider value={{ coefInput, setCoefInput }}>
            {children}
        </CoefContext.Provider>
    );
}
export const useCoefInput = () => {
    return useContext(CoefContext);
} 

function CoefInput({ id }){
    const {coefInput, setCoefInput} = useCoefInput();

    function inputChange(event){
        const value = event.target.value;
        let updatedArray = [...coefInput];
        updatedArray[id.row][id.col] = value;
        setCoefInput(updatedArray);
        event.target.size = value.length || 1;
    }

    return (
        <input type="text" value={ coefInput[id.row][id.col] }
        size='1' className="transparent-input"
        onChange={inputChange} placeholder='_'/>
    );
}

function Fields(){
    return (
        <div>
            <div className="row">    
                <CoefInput id={{ row: 0, col: 0 }} /> <p> <MathJax> \( x \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 0, col: 1 }} /> <p> <MathJax> \( y \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 0, col: 2 }} /> <p> <MathJax> \( z \hphantom{1} = \) </MathJax> </p>
                <CoefInput id={{ row: 0, col: 3 }} /> 
            </div>
            <div className="row">
                <CoefInput id={{ row: 1, col: 0 }} /> <p> <MathJax> \( x \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 1, col: 1 }} /> <p> <MathJax> \( y \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 1, col: 2 }} /> <p> <MathJax> \( z \hphantom{1} = \) </MathJax> </p>
                <CoefInput id={{ row: 1, col: 3 }} /> 
            </div>
            <div className="row">
                <CoefInput id={{ row: 2, col: 0 }} /> <p> <MathJax> \( x \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 2, col: 1 }} /> <p> <MathJax> \( y \hphantom{1} + \) </MathJax> </p>
                <CoefInput id={{ row: 2, col: 2 }} /> <p> <MathJax> \( z \hphantom{1} = \) </MathJax> </p>
                <CoefInput id={{ row: 2, col: 3 }} /> 
            </div>
        </div>
    );
}

function Input(){
    const {coefInput, setCoefInput} = useCoefInput();

    const isValid = (str) => { return str !== '' && !isNaN(parseFloat(str)) && isFinite(str) };
    const navigate = useNavigate();
    function onSolveClick(method) {
        for(let i = 0; i < 3; i++){
            if(!coefInput[i].every(isValid)) {
                let errMsg = document.getElementById('errmsg');
                errMsg.innerText = 'Будь ласка, заповніть усі поля матриці числами';
                return false;
            }
        }
        navigate('/solve/' + method);
    }

    const rowStyle = {
        justifyContent: 'space-around',
        width: '50dvw'
    };

    return (
        <section className="Input">
            <Header />
            <div className='container'>
                <p className='big'> Введіть коефіцієнти </p>
                <Fields />
                <p className='error-message' id='errmsg' />
                <div className='row' style={rowStyle}>
                    <button className="act-button" onClick={ () => onSolveClick('gaussian') }> Методом Гауса </button>
                    <button className="act-button" onClick={ () => onSolveClick('cramers') }> Методом Крамера </button>
                </div>
            </div>
        </section>
    );
}

export default Input;