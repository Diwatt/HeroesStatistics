import React from "react";
import {Link} from "react-router-dom";
import db from './../Database';
import Crawler from './../utils/HotsLogCrawler';

export default class Setup extends React.Component {
    state = {
        userId: null,
        hotslogsId: undefined,
    };

    componentDidMount() {
        db.users.where('isActive').equals(1).count().then((count) => {
            if (0 === count) {
                this.setState({
                    userId: null
                })
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    handleHotslogId(event) {
        this.setState({hotslogsId: event.target.value});
    }

    createUser(event) {
        console.log('paf')
    }

    getForm() {
        return (<div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">Specify your hotlogs id:</label>
            </div>
            <div className="field-body">
                <div className="field has-addons">
                    <div className="control">
                        <input className="input" type="number"
                               value={this.state.hotslogsId}
                               onChange={(e) => this.handleHotslogId(e)}
                        />
                    </div>
                    <div className="control">
                        <button onClick={(e) => this.createUser(e)} className="button is-info">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>);
    }

    render() {
        if (null === this.state.userId) {
            return this.getForm();
        }


        return (
            <div>
                Setup
            </div>
        );
    }
}
