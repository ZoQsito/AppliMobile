import React from 'react';
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AccueilPage from './pages/AcueilPage';
import RoulettePage from './pages/RoulettePage';
import { HashRouter, Switch, Route } from "react-router-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../styles/app.css';

// start the Stimulus application
import '../bootstrap';



const App = () => {
    return (
    <HashRouter>

    <main className="container pt-5">
        <Switch>
        <Route path="/" component={RoulettePage} />  
        </Switch>
    </main>
    </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);