import React from "react";
import {Redirect} from "react-router-dom";
import db from './../Database';

export default class Reset extends React.Component {
    state = {
        willDelete: null
    };

    buildWillDeleteSetter(willDelete) {
        return () => {
            this.setState({
                willDelete: willDelete
            })
        }
    }

    askConfirm() {
        return (<div className="modal is-active">
            <div className="modal-background" />
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Reset Application</p>
                </header>
                <section className="modal-card-body">
                    It will delete the all database...
                    Are you sure ?
                </section>
                <footer className="modal-card-foot">
                    <button onClick={this.buildWillDeleteSetter(true).bind(this)} className="button is-success">Yes</button>
                    <button onClick={this.buildWillDeleteSetter(false).bind(this)} className="button">No</button>
                </footer>
            </div>
        </div>);
    }

    render() {
        if (null === this.state.willDelete) {
            return this.askConfirm();
        }
        if (this.state.willDelete) {
            db.delete().then(()=> db.open());
        }

        return (
            <Redirect to="/" />
        );
    }
}
