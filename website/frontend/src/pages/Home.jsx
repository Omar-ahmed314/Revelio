import { useState } from "react";
import {Link} from 'react-router-dom'
import '../styles/Home/Home.css'

const Home = () => {

    return (
        <>
        <div className="home_body">
            <section className="background">
                <canvas id="canvas1"></canvas>
            </section>
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
                    <a href="/">GET STARTED</a>
                </section>
            </section>
        </div>
        </>
    )
}

export default Home