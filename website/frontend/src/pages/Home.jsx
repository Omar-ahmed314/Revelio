import { useState } from 'react'
import '../styles/Home/Home.css'
import DragAndDrop from '../components/drag_drop'

const Home = () => {
    const [isPopupActive, setPopupActive] = useState(false)
    return (
        <>
        <div className="home_body">
            <section className="background"></section>
            {isPopupActive ? <DragAndDrop activateWindow={{isPopupActive, setPopupActive}}/> : undefined}
            <section className="page_content">
                <section className="page_header">
                    <ul>
                        <li><a href="/">ABOUT US</a></li>
                        <li><a href="/">DOCS</a></li>
                        <li><a href="/">GITHUB</a></li>
                    </ul>
                </section>
                <section className="intro_words">
                    <div id="revelio_word">
                        <h1>REVELIO.</h1>
                    </div>
                </section>
                <section className="intro_btns">
                    <a onClick={() => setPopupActive(true)}>GET STARTED</a>
                </section>
            </section>
        </div>
        </>
    )
}

export default Home