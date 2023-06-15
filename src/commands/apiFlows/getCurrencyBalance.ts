import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as Utility from '../../utility/index';

const endpoint = '/v1/chain/get_currency_balance';

const multiQuery = [
    {
        property: 'account',
        inputOptions: {
            title: 'Account Name',
            value: '',
            placeHolder: 'account name',
        },
    },
    {
        property: 'code',
        inputOptions: {
            title: 'Contract Name',
            value: 'eosio.token',
            placeHolder: 'Name of the contract',
        },
    },
    {
        property: 'symbol',
        inputOptions: {
            title: 'Symbol Name',
            value: 'UOS',
            placeHolder: 'UOS, EOS, TELOS, etc.',
        },
    },
];

export async function start(api: string) {
    const body: { [key: string]: any } = { json: true };
    for (let query of multiQuery) {
        const inputResponse = await Utility.quickInput.create(query.inputOptions);
        if (!inputResponse) {
            continue;
        }

        if (!inputResponse) {
            vscode.window.showWarningMessage(`${query.inputOptions.title} was not provided. Cancelled query.`);
            return;
        }

        body[query.property] = inputResponse;
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    };

    const outputChannel = Utility.outputChannel.get();
    outputChannel.show();
    outputChannel.appendLine(endpoint);

    const response = await fetch(api + endpoint, options).catch((err) => {
        outputChannel.appendLine(err);
        return undefined;
    });

    if (!response || !response.ok) {
        vscode.window.showWarningMessage(`Failed to fetch data`);
        return;
    }

    const data = await response.json();
    outputChannel.appendLine(JSON.stringify(data, null, 2));
}
