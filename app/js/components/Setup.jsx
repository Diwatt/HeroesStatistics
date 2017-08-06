import React from "react";
import {Link} from "react-router-dom";
import idb from './../Database';
import Crawler from './../utils/HotsLogCrawler';

export default class Setup extends React.Component {
    componentDidMount() {
        this.getPlayerData();
    }

    getPlayerData () {
        (new Crawler(1350838)).getGames((games) => {
           console.log(games.length);
       });
    }

    render() {
        return (
            <div>
                Setup
            </div>
        );
    }
}
