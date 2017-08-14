import React from "react";
import {Redirect} from "react-router-dom";
import db from './../Database';

export default class Reset extends React.Component {
    componentDidMount() {
        if (confirm('Are you sure you want to delete the database ?')) {
            db.delete();
        }

    }

    render() {
        return (
            <Redirect to="/" />
        );
    }
}
