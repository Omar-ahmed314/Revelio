import { useState } from 'react'
import '../styles/Home/Home.css'
import DragAndDrop from '../components/drag_drop'
import config from '../config'

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
                        <li><a href="/aboutus">ABOUT US</a></li>
                        <li><a href="/">DOCS</a></li>
                        <li><a href={config.github} target='_blank'>GITHUB</a></li>
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