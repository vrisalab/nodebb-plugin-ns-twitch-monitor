import classNames from 'classnames';
import React from 'react';
import Validation from '../models/Validation';

export default class ClientIdForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const groupClassClientId = classNames({
            'form-group'           : true,
            'client-id-form__input': true,
            'has-success'          : this.props.valid === Validation.SUCCESS,
            'has-error': this.props.valid === Validation.FAILURE
        });
        const groupClassToken = classNames({
            'form-group': true,
            'token-form__input': true,
        });

        const validationIconClass = classNames({
            'fa'        : true,
            'fa-refresh': true,
            'fa-spin'   : this.props.validating
        });

        let validationLabel = null;
        if (this.props.valid === Validation.SUCCESS) {
            validationLabel = '(OK)';
        } else if (this.props.valid === Validation.FAILURE) {
            validationLabel = '(Invalid)';
        }

        return (
            <div>
            <div className="client-id-form">
                <div className={groupClassClientId}>
                    <label className="control-label" htmlFor="clientId">Client ID {validationLabel}</label>
                    <input
                        type="text"
                        className="form-control"
                        id="clientId"
                        defaultValue={this.props.valueClientId}
                        onChange={e => this.props.valueClientIdDidChange(e.target.value)}
                        placeholder="Twitch Client ID"/>
                    <small>
                        Hint: you should <a href="http://www.twitch.tv/kraken/oauth2/clients/new" target="_blank">register
                        Twitch Application</a> to get client id.
                        Please review
                        <a href="http://www.twitch.tv/user/legal?page=api_terms_of_service" target="_blank">Terms
                            of Service</a> for the Twitch API.
                    </small>
                </div>
                <div className="client-id-form__controls">
                    <button
                        className="btn btn-success"
                        type="button"
                        onClick={this.props.validateValue}><i className={validationIconClass}></i> Validate
                    </button>
                    <button
                        className="btn btn-primary"
                        type="button"
                        disabled={(!this.props.valueClientId || this.props.persistedClientId) ? 'disabled' : ''}
                        onClick={this.props.persistValueClientId}><i className="fa fa-floppy-o"></i> Save
                    </button>
                </div>
            </div>
            <div className="token-form">
                <div className={groupClassToken}>
                    <label className="control-label" htmlFor="Token">Token</label>
                    <input
                        type="text"
                        className="form-control"
                            id="token"
                            defaultValue={this.props.valueToken}
                        onChange={e => this.props.valueTokenDidChange(e.target.value)}
                        placeholder="Bearer xxxx" />
                </div>
                <div className="token-form__controls">
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={this.props.persistValueToken}><i className="fa fa-floppy-o"></i> Save
                    </button>
                </div>
            </div>
            </div>
        );
    }
}
