import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCoefInput } from './input';
import { MathJax } from 'better-react-mathjax';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Header from './header';

function roundArray(arr){
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            arr[i][j] = +(arr[i][j]).toFixed(3);
        }
    }
}
function mjMatrixB(arr){
    return `\\left[ \n
        \\begin{array}{ccc|c} \n
          ${arr[0][0]}&${arr[0][1]}&${arr[0][2]}&${arr[0][3]}\\\\ \n
          ${arr[1][0]}&${arr[1][1]}&${arr[1][2]}&${arr[1][3]}\\\\ \n
          ${arr[2][0]}&${arr[2][1]}&${arr[2][2]}&${arr[2][3]} \n
        \\end{array} \n
        \\right]`
}
function mjMatrixV(arr){
    return `\\left| \n
        \\begin{array}{ccc} \n
          ${arr[0][0]}&${arr[0][1]}&${arr[0][2]}\\\\ \n
          ${arr[1][0]}&${arr[1][1]}&${arr[1][2]}\\\\ \n
          ${arr[2][0]}&${arr[2][1]}&${arr[2][2]} \n
        \\end{array} \n
        \\right|`
}
function logGaussianStep(i, desc, arr1, arr2){
    let arrClone1 = structuredClone(arr1);
    let arrClone2 = structuredClone(arr2);
    roundArray(arrClone1);
    roundArray(arrClone2);
    let steps = sessionStorage.getItem('steps');

    steps += `<h3>Крок ${i}.</h3>
                <p>${desc}</p>
                <div className="step"> $$${mjMatrixB(arrClone1)} \\to ${mjMatrixB(arrClone2)}$$ </div> \n`

    sessionStorage.setItem('steps', steps);
}
function logCramersStep(i, step, a){
    let arrayClone = structuredClone(a);
    let steps = sessionStorage.getItem('steps');
    if(step === 'det'){
        let formul = [['a_{11}', 'a_{12}', 'a_{13}'],
                      ['a_{21}', 'a_{22}', 'a_{23}'],
                      ['a_{31}', 'a_{32}', 'a_{33}']];
        let calc = [[a[0][0], a[0][1], a[0][2]],
                    [a[1][0], a[1][1], a[1][2]],
                    [a[2][0], a[2][1], a[2][2]]];
        steps += `<h3>Крок ${i}.</h3>
                            <p>Визначимо детермінант головної матриці за формулою</p>
                            <div class="step">
                                <span>$$\\Delta = ${mjMatrixV(formul)} =$$</span> <span>$$=a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} + a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})$$</span>
                                <span>$$\\Delta = ${mjMatrixV(calc)} = ${calcDet(calc)}$$</span>
                            </div>`;

    }
    if(step === 'detx'){
        let formul = [['b_1', 'a_{12}', 'a_{13}'],
                      ['b_2', 'a_{22}', 'a_{23}'],
                      ['b_3', 'a_{32}', 'a_{33}']];
        let calc = [[a[0][3], a[0][1], a[0][2]],
                    [a[1][3], a[1][1], a[1][2]],
                    [a[2][3], a[2][1], a[2][2]]];
        steps += `<h3>Крок ${i}.</h3>
                            <p>Визначимо детермінант головоної матриці з заміненим 1 стовбцем стовбцем вільних членів за формулою</p>
                            <div class="step">
                                <span>$$\\Delta_x = ${mjMatrixV(formul)} =$$</span> <span>$$=b_1(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(b_2a_{33} + a_{23}b_3) + a_{13}(b_2a_{32} - a_{22}b_3)$$</span>
                                <span>$$\\Delta_x = ${mjMatrixV(calc)} = ${calcDet(calc)}$$</span>
                            </div>`
    }
    if(step === 'dety'){
        let formul = [['a_{11}', 'b_1', 'a_{13}'],
                      ['a_{21}', 'b_2', 'a_{23}'],
                      ['a_{31}', 'b_3', 'a_{33}']];
        let calc = [[a[0][0], a[0][3], a[0][2]],
                    [a[1][0], a[1][3], a[1][2]],
                    [a[2][0], a[2][3], a[2][2]]];
        steps += `<h3>Крок ${i}.</h3>
                            <p>Визначимо детермінант головної з заміненим 2 стовбцем стовбцем вільних членів матриці за формулою</p>
                            <div class="step">
                                <span>$$\\Delta_y = ${mjMatrixV(formul)} =$$</span> <span>$$=a_{11}(b_2a_{33} - a_{23}b_3) - b_1(a_{21}a_{33} + a_{23}a_{31}) + a_{13}(a_{21}b_3 - b_2a_{31})$$</span>
                                <span>$$\\Delta_y = ${mjMatrixV(calc)} = ${calcDet(calc)}$$</span>
                            </div>`;
    }
    if(step === 'detz'){
        let formul = [['a_{11}', 'a_{12}', 'b_1'],
                      ['a_{21}', 'a_{22}', 'b_2'],
                      ['a_{31}', 'a_{32}', 'b_3']];
        let calc = [[a[0][0], a[0][1], a[0][3]],
                    [a[1][0], a[1][1], a[1][3]],
                    [a[2][0], a[2][1], a[2][3]]];
        steps += `<h3>Крок ${i}.</h3>
                            <p>Визначимо детермінант головної матриці з заміненим 3 стовбцем стовбцем вільних членів за формулою</p>
                            <div class="step">
                                <span>$$\\Delta_z = ${mjMatrixV(formul)} =$$</span> <span>$$=a_{11}(a_{22}b_3 - b_2a_{32}) - a_{12}(a_{21}a_{33} + a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})$$</span>
                                <span>$$\\Delta_z = ${mjMatrixV(calc)} = ${calcDet(calc)}$$</span>
                            </div>`;
    }
    if(step === 'slns'){
        steps += `<h3>Крок ${i}.</h3>
                            <p>Вирахуємо рішення системи за формулами</p>
                            <div class="step">
                                <span>$$x = \\dfrac{\\Delta_x}{\\Delta} = ${a[0]}$$</span>
                                <span>$$y = \\dfrac{\\Delta_y}{\\Delta} = ${a[1]}$$</span>
                                <span>$$z = \\dfrac{\\Delta_z}{\\Delta} = ${a[2]}$$</span>
                            </div>`;
    }
    sessionStorage.setItem('steps', steps);
}

function gaussianMethod(coefArray){
    let arrayClone = structuredClone(coefArray);
    let ratio = coefArray[1][0] / coefArray[0][0];
    for(let i = 0; i < 4; i++){
        coefArray[1][i] -= coefArray[0][i] * ratio;
    }
    logGaussianStep(1, `Віднімемо від другого рівняння системе перше, помножене на \\(\\dfrac{${+(arrayClone[1][0]).toFixed(3)}}{${+(arrayClone[0][0]).toFixed(2)}}\\), щоб занулити коефіцієнт \\(a_{21}\\)`, arrayClone, coefArray);
 
    arrayClone = structuredClone(coefArray);
    ratio = coefArray[2][0] / coefArray[0][0];
    for(let i = 0; i < 4; i++){
        coefArray[2][i] -= coefArray[0][i] * ratio;
    }
    logGaussianStep(2, `Віднімемо від третього рівняння системе перше, помножене на \\(\\dfrac{${+(arrayClone[2][0]).toFixed(3)}}{${+(arrayClone[0][0]).toFixed(3)}}\\), щоб занулити коефіцієнт \\(a_{31}\\)`, arrayClone, coefArray);

    arrayClone = structuredClone(coefArray);
    ratio = coefArray[2][1] / coefArray[1][1];
    for(let i = 0; i < 4; i++){
        coefArray[2][i] -= coefArray[1][i] * ratio;
    }
    logGaussianStep(3, `Віднімемо від третього рівняння системе друге, помножене на \\(\\dfrac{${+(arrayClone[2][1]).toFixed(3)}}{${+(arrayClone[1][1]).toFixed(3)}}\\), щоб занулити коефіцієнт \\(a_{32}\\)`, arrayClone, coefArray);
 
    arrayClone = structuredClone(coefArray);
    for(let i = 0; i < 3; i++){
        ratio = coefArray[i][i];
        for(let j = 0; j < 4; j++){
            coefArray[i][j] /= ratio;
        }
    }
    logGaussianStep(4, `Поділимо перше, друге та третє рівняння на \\(${+(arrayClone[0][0]).toFixed(3)}\\), \\(${+(arrayClone[1][1]).toFixed(3)}\\) та \\(${+(arrayClone[2][2]).toFixed(3)}\\) відповідно, щоб утворити одиниці по діагоналі`, arrayClone, coefArray);

    arrayClone = structuredClone(coefArray);
    ratio = coefArray[1][2];
    for(let i = 0; i < 4; i++){
        coefArray[1][i] -= coefArray[2][i] * ratio;
    }
    logGaussianStep(5, `Віднімемо від другого рівняння системе третє, помножене на \\(${+(arrayClone[1][2]).toFixed(3)}\\), щоб обнулити коефіцієнт \\(a_{21}\\)`, arrayClone, coefArray);

    arrayClone = structuredClone(coefArray);
    ratio = coefArray[0][2];
    for(let i = 0; i < 4; i++){
        coefArray[0][i] -= coefArray[2][i] * ratio;
    }
    logGaussianStep(6, `Віднімемо від першого рівняння системе третє, помножене на \\(${+(arrayClone[0][2]).toFixed(3)}\\)`, arrayClone, coefArray);

    arrayClone = structuredClone(coefArray);
    ratio = coefArray[0][1];
    for(let i = 0; i < 4; i++){
        coefArray[0][i] -= coefArray[1][i] * ratio;
    }
    logGaussianStep(7, `Віднімемо від першого рівняння системе друге, помножене на \\(${+(arrayClone[0][0]).toFixed(3)}\\)`, arrayClone, coefArray);

    let x = +coefArray[0][3].toFixed(3);
    let y = +coefArray[1][3].toFixed(3);
    let z = +coefArray[2][3].toFixed(3);
    
    return [x, y, z];
}

function calcDet(a){
    return a[0][0] * a[1][1] * a[2][2] + a[0][1] * a[1][2] * a[2][0] + a[0][2] * a[1][0] * a[2][1] - a[0][2] * a[1][1] * a[2][0] - a[0][0] * a[1][2] * a[2][1] - a[0][1] * a[1][0] * a[2][2];
}
function cramersMethod(coefArray){
    let det = [[coefArray[0][0], coefArray[0][1], coefArray[0][2]],
               [coefArray[1][0], coefArray[1][1], coefArray[1][2]],
               [coefArray[2][0], coefArray[2][1], coefArray[2][2]]];
    det = calcDet(det);

    let detx = [[coefArray[0][3], coefArray[0][1], coefArray[0][2]],
               [coefArray[1][3], coefArray[1][1], coefArray[1][2]],
               [coefArray[2][3], coefArray[2][1], coefArray[2][2]]];
    detx = calcDet(detx);

    let dety = [[coefArray[0][0], coefArray[0][3], coefArray[0][2]],
               [coefArray[1][0], coefArray[1][3], coefArray[1][2]],
               [coefArray[2][0], coefArray[2][3], coefArray[2][2]]];
    dety = calcDet(dety);

    let detz = [[coefArray[0][0], coefArray[0][1], coefArray[0][3]],
               [coefArray[1][0], coefArray[1][1], coefArray[1][3]],
               [coefArray[2][0], coefArray[2][1], coefArray[2][3]]];
    detz = calcDet(detz);

    let x = +(detx / det).toFixed(3);
    let y = +(dety / det).toFixed(3);
    let z = +(detz / det).toFixed(3);

    return [x, y, z];
}

function SolveSystem(){
    const { method } = useParams();
    const { coefInput, setCoefInput } = useCoefInput();
    sessionStorage.setItem('steps', '');

    let coefArray = [[], [], []];
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 4; j++){
            coefArray[i][j] = parseFloat(coefInput[i][j]);
        }
    }

    if(method === 'gaussian'){
        var slns = gaussianMethod(structuredClone(coefArray));
    }
    else if(method === 'cramers'){
        var slns = cramersMethod(structuredClone(coefArray));
    }

    if(slns === NaN){
        return (
            <p className='big'>Немає розв'язків</p>
        );
    }
    else{
        return (
            <div className='container'>
                <p className='big'>Розв'язки</p> <br/>
                <p> <MathJax> \( x = {slns[0]} \) </MathJax> </p>
                <p> <MathJax> \( y = {slns[1]} \) </MathJax> </p>
                <p> <MathJax> \( z = {slns[2]} \) </MathJax> </p>
            </div>
        );
    }
}

function Scene(){
    const { coefInput, setCoefInput } = useCoefInput();
    const planeRef1 = useRef();
    const planeRef2 = useRef();
    const planeRef3 = useRef();

    const coefArray = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            coefArray[i][j] = parseFloat(coefInput[i][j]);
            
        }
    }

    function onCanvasCreate() {
        planeRef1.current.lookAt(new THREE.Vector3(...coefArray[0]));
        planeRef2.current.lookAt(new THREE.Vector3(...coefArray[1]));
        planeRef3.current.lookAt(new THREE.Vector3(...coefArray[2]));
    }

    return (
        <Canvas onCreated={onCanvasCreate} className='three-canvas' style={{ width: '50vmin', height: '50vmin' }}>
            <OrbitControls enableDamping={true} dampingFactor={0.25} rotateSpeed={0.3}/>
            <color attach='background' args={['#0c3f45']} />
            <ambientLight intensity={1.5}/>

            <mesh ref={planeRef1}>
                <planeGeometry attach='geometry' args={[5, 5]} />
                <meshLambertMaterial attach='material' color='#49ad44' side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={planeRef2}>
                <planeGeometry attach='geometry' args={[5, 5]} />
                <meshLambertMaterial attach='material' color='#ad9e44' side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={planeRef3}>
                <planeGeometry attach='geometry' args={[5, 5]} />
                <meshLambertMaterial attach='material' color='#ad4f44' side={THREE.DoubleSide} />
            </mesh>
        </Canvas>
    );
}

const rowStyle = {
    justifyContent: 'space-around',
    width: '100dvw'
};

function Solve(){
    const navigate = useNavigate();

    return (
        <section className="Solve">
            <Header />
            <div className='container'>
                <div className='row' style={{ alignItems: 'center' }}>
                    <SolveSystem />
                    <Scene />
                </div>
                <div className='row' style={rowStyle}>
                    <button className="act-button" onClick={ () => navigate('/input') }> Нова СЛАР </button>
                    <button className="act-button" onClick={ () => navigate('steps') }> Пояснення </button>
                </div>
            </div>
        </section>
    );
}

export default Solve;