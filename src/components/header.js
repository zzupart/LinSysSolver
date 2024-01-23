const HeaderStyle = {
    alignItems: 'center',
    justifyContent: 'center'
}
function Header() {
    function onAboutClick() {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'block';
    }
    function onOverlayClick() {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
    }

    return (
        <header style={HeaderStyle}>
            <h1 className="title"> LinSysSolver </h1>
            <div className="about" onClick={ onAboutClick }></div>
            <div className="overlay" id="overlay" onClick={ onOverlayClick }>
                <div className="container" style={{ height: '100vh' }}>
                    <div className="about-text" id="about-text" style={{ textAlign: 'center' }}>
                        <p className="big">Про Проєкт</p>
                        <p>
                            Цей навчальний веб застосунок створений в рамках науково-дослідницької роботи,
                            що має за мету створення вирішувача СЛАР для полегшення вивчення цієї теми студентами.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;