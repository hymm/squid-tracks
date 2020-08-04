import React from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import flatten from 'flat';
import { parse as json2csv } from 'json2csv';
import { remote, ipcRenderer } from 'electron';
import { event } from '../analytics';
import { useSplatnet } from '../splatnet-provider';
const { dialog } = remote;

class ExportBattlesToCsvButton extends React.Component {
  convertBattlesToCsv(battles) {
    const battlesFlattened = battles.map((battle) => {
      return flatten(battle);
    });

    return json2csv(battlesFlattened);
  }

  exportBattlesToCsv = () => {
    event('export-data', '50-battles-csv');
    // loop through current and get battles
    const { splatnet } = this.props;
    const battles = splatnet.current.results.results.map((battle) => {
      return splatnet.comm.getBattle(battle.battle_number, 'sync');
    });

    const battlesCsv = this.convertBattlesToCsv(battles);
    dialog.showSaveDialog(
      {
        filters: [{ name: 'csv', extensions: ['csv'] }],
      },
      (file) => {
        ipcRenderer.send('saveBattlesToCsv', file, battlesCsv);
      }
    );
  };

  render() {
    return (
      <Button variant="outline-secondary" onClick={this.exportBattlesToCsv}>
        <FormattedMessage
          id="Results.exportBattlesToCsv"
          defaultMessage="Export to CSV"
        />
      </Button>
    );
  }
}

const ButtonInjected = () => {
  const splatnet = useSplatnet();

  return <ExportBattlesToCsvButton splatnet={splatnet} />;
};

export default ButtonInjected;
