import Actions from '../actions/Actions';
import alt from '../alt';

class SettingsStore {
    constructor() {
        this.bindListeners({
            clientIdDidChange: Actions.clientIdDidChange,
            tokenDidChange: Actions.tokenDidChange,
            settingsDidUpdate: Actions.settingsDidUpdate
        });

        this.clientId = null;
        this.token = null;
        this.tokenPersisted = false;
        this.clientIdPersisted = false;
        this.updateDelay = NaN;
    }

    clientIdDidChange(id) {
        this.clientId = id;
        this.clientIdPersisted = false;
    }

    tokenDidChange(token) {
        this.token = token;
        this.tokenPersisted = false;
    }

    settingsDidUpdate(settingsData) {
        this.clientId = settingsData.clientId;
        this.token = settingsData.token;
        this.updateDelay = settingsData.updateTime;
        //this.clientIdPersisted = true;
        //this.tokenPersisted = true;
    }
}

export default alt.createStore(SettingsStore, 'SettingsStore');
