import React from "react";
import Dexie from 'dexie';
import db from './../Database';
import User from './../models/User';
import Crawler from './../utils/HotsLogCrawler';

export default class Home extends React.Component {
    getHeroes() {
        let heroes = db.heroes.toArray().then(heroes => {
            console.info('heroes:', heroes);
        });
    }

    render() {
        this.getHeroes();
        User.getActive().then(async (user) => {
            if (null !== user) {
                const crawler = new Crawler(user.hotslogsUserId);
                crawler.getGameSummary(119328995);
            }
        });

        return (
            <div>
                <h1 className="title">Home</h1>
            </div>
        );
    }
}
