import React from "react";
import PropTypes from 'prop-types';

export default class CreateUser extends React.Component {
    static propTypes = {
        createUserCallback: PropTypes.func
    };

    state = {
        id: '',
    };

    handleId(event) {
        this.setState({
            id: parseInt(event.target.value)
        });
    }

    createUser(event) {
        this.props.createUserCallback(event, this.state.id);
    }

    render() {
        return (<div>
            <h1 className="title">Setup</h1>
            <div className="field is-horizontal">
            <div className="field-label is-normal">
                <label className="label">Specify your hotlogs id:</label>
            </div>
            <div className="field-body">
                <div className="field has-addons">
                    <div className="control">
                        <input className="input" type="number"
                               value={this.state.id}
                               onChange={this.handleId.bind(this)}
                               placeholder="1350838"
                        />
                    </div>
                    <div className="control">
                        <button onClick={this.createUser.bind(this)} className="button is-info">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>);
    }
}
