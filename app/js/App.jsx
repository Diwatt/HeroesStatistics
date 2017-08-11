import "babel-polyfill";
import React from "react";
import { render } from "react-dom";
import { HashRouter, NavLink, Route } from "react-router-dom";
import Config from "./Config";
import idb from './Database';
import css from '../css/app.css';
import Home from "./components/Home.jsx";
import HeroesSelection from "./components/HeroesSelection.jsx";
import Setup from "./components/Setup.jsx";

render((
    <HashRouter basename="/">
        <div className="container">
            <nav className="navbar">
                <div className="navbar-brand">
                    <NavLink to="/" className="navbar-item">Heroes Statistics</NavLink>
                    <NavLink to="/selection" className="navbar-item is-hidden-desktop" activeClassName="is-active">Selection</NavLink>
                    <NavLink to="/setup" className="navbar-item is-hidden-desktop" activeClassName="is-active">Setup</NavLink>
                </div>
            </nav>

            <Route exact strict path="/" component={ Home } />
            <Route exact strict path="/selection" component={ HeroesSelection } />
            <Route exact strict path="/setup" component={ Setup } />
        </div>
    </HashRouter>
), document.getElementById('app'));
