import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import HeroesSelection from "./components/HeroesSelection.jsx";
import Config from "./Config";

render((
    <Router>
        <div className="container">
            <aside className="menu">
                <p className="menu-label">
                <Link to={Config.baseUrl + "/"} className="pure-menu-heading">
                    Heroes Statistics
                </Link>
                </p>
                <ul className="menu-list">
                    <li className="pure-menu-item">
                        <Link to={Config.baseUrl + "/selection"} className="pure-menu-link">
                            HeroesSelection
                        </Link>
                    </li>
                </ul>
            </aside>

            <Route exact path={Config.baseUrl + "/"} component={ Home } />
            <Route exact path={Config.baseUrl + "/selection"} component={ HeroesSelection } />
        </div>
    </Router>
), document.getElementById('app'));
