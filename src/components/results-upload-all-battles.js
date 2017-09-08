import React from 'react';
import { Button } from 'react-bootstrap';
import { Subscriber } from 'react-broadcast';
import { ipcRenderer } from 'electron';

class UploadAllBattlesButton extends React.Component {
    componentDidMount() {
        ipcRenderer.on('wroteBattleAll', this.handleWroteBattleManual);
        ipcRenderer.on('writeBattleAllError', this.handleError);
    }

    componentWillUnmount() {
      ipcRenderer.removeListener('wroteBattleAll', this.handleWroteBattleAuto);
      ipcRenderer.removeListener('writeBattleAllError', this.handleError);
    }

    uploadAllBattles() {
        const { splatnet, statInk } = this.props;

        for (const battle of splatnet.current.results.results) {
            const uploaded = statInk ? statInk[battle.battle_number] != null : false;
            if (!uploaded) {
              const battleDetails = splatnet.comm.getBattle(battle.battle_number);
              ipcRenderer.send('writeToStatInk', battleDetails, 'all');
            }
        }
    }

    handleWroteBattle = () => {
        
    }

    render() {
        return (
            <Button onClick={this.uploadAllBattles}>Upload All Battles to stat.ink</Button>
        );
    }
}

const UploadAllBattlesButtonInjected = () => {
    return (
        <Subscriber channel="splatnet">
            {splatnet => <UploadAllBattlesButton splatnet={splatnet} />}
        </Subscriber>
    )
};

export default UploadAllBattlesButtonInjected;
