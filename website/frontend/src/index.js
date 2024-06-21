import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';
import Analysis from './pages/Analysis';
import { Provider } from 'react-redux';
import store from './redux/store'
import AboutUs from './pages/AboutUs';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route path='/analysis' element={<Analysis/>}/>
          <Route path='/aboutus' element={<AboutUs/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
    // <>
    // <Analysis/>
    // </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
