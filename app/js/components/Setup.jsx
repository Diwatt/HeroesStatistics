import React from "react";
import Dexie from 'dexie';
import db from './../Database';
import Crawler from './../utils/HotsLogCrawler';
import CreateUser from "./Setup/CreateUser";
import RetrieveGames from "./Setup/RetrieveGames";
import User from './../models/User';

export default class Setup extends React.Component {
    state = {
        user: null,
        nbGames: 0
    };

    componentDidMount() {
        User.getActive().then((user) => {
            this.setState({user: user});
        })
    }

    /**
     * Called by <CreateUser>
     *
     * @param event
     * @param id
     */
    createUser(event, id) {
        User.create(id).then((user) => {
            this.setState({user: user});
        });
    }

    render() {
        if (null === this.state.user) {
            return <CreateUser createUserCallback={this.createUser.bind(this)}/>;
        }

        if (0 === this.state.nbGames) {
            return <RetrieveGames />;
        }

        return (
            <div>
                <h1 className="title">Setup</h1>

                Setup
            </div>
        );
    }
}
