import { useNavigate } from 'react-router-dom';

const IntroStyle = {
    alignItems: 'center',
};

function Intro() {
    const navigate = useNavigate();

    return (
        <section className="Intro" style={IntroStyle}>
            <h1 className="title big"> LinSysSolver </h1>
            <div className="desc-wrapper">
                <p>
                    Ласкаво просимо до LinSysSolver - вирішувача систем лінійних рівнянь. Якщо ти студент,
                    що хоче дізнатися більше про методи розв’язування СЛАР, тисни на кнопку внизу!
                </p>
            </div>
            <button className="act-button big" onClick={ () => navigate('/input') }> Розпочати! </button>
        </section>
    );
}

export default Intro;