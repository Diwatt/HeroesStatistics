import React from "react";

export default class ProgressBar extends React.Component {
    render() {
        let percentage = Math.min(this.props.percentage, 100);

        return (
            <div className="bar">
                <div className="bar-container" style={ { width: percentage + '%' } }>
                    { percentage }%
                </div>
            </div>
        );
    }
}
