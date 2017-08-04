import React from 'react';
import PropTypes from 'proptypes';

class ResultsContainer extends React.Component {
    render() {
        return (
            <div />
        );
    }
}

const ResultsViewer = ({ records }) => (
    <div>
        <PlayerCard player={records.records.player} />
    </div>
);

ResultsViewer.propTypes = {
    results: PropTypes.object.isRequired,
};

const PlayerCard = ({ player }) => (
    <div>
        <div>{`nickname: ${player.nickname}`}</div>
    </div>

);

export default ResultsViewer;
