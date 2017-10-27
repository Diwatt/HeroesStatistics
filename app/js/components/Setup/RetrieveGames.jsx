import React from "react";
import FontAwesome from 'react-fontawesome';
import User from './../../models/User';
import Hero from './../../models/Hero';
import Map from './../../models/Map';
import Game from './../../models/Game';
import Crawler from './../../utils/HotsLogCrawler';

export default class RetrieveGames extends React.Component {
    state = {
        games: [],
        textStatus: '',
        inProgress: false
    };

    retrieve(event) {
        this.setState({'inProgress': true});
        User.getActive().then(async (user) => {
            const crawler = new Crawler(user.hotslogsUserId);
            this.setState({textStatus: 'Retrieving heroes'});
            await Hero.importFromHotlogs(await crawler.getHeroes());
            this.setState({textStatus: 'Retrieving maps'});
            await Map.importFromHotlogs(await crawler.getMaps());
            this.setState({textStatus: 'Retrieving games'});
            await Game.importFromHotsLogs(await crawler.getGames(), (textStatus) => {
                this.setState({textStatus: 'Retrieving games '+textStatus});
            });
            this.setState({textStatus: 'Retrieving summaries'});
            await Game.importSummaryFromHotsLogs(async (id, waitUntil) => {
                return await crawler.getGameSummary(id, waitUntil);
            }, 1500);
        }).then(() => {
            this.setState({'inProgress': false});
        });
    }

    componentWillUnmount() {

    }

    render() {
        let spinner = '';
        if (true === this.state.inProgress) {
            spinner = (<FontAwesome className="rotating" name="spinner" />);
        }

        let status = '';
        if ('' !== this.state.textStatus) {
            status = (<h2 className="subtitle">{this.state.textStatus}</h2>);
        }

        return (<div>
            <h1 className="title">Setup</h1>
            {status}
            <button onClick={this.retrieve.bind(this)} className="button is-info">
                Retrieve Games&nbsp;{spinner}
            </button>
        </div>);
    }
}
