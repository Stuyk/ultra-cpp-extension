import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as Utility from '../../utility/index';

const endpoint = '/v1/chain/get_table_rows';

const multiQuery = [
    {
        property: 'code',
        inputOptions: {
            title: 'Contract Name',
            value: '',
            placeHolder: 'Name of the contract the table belongs to',
        },
    },
    {
        property: 'scope',
        inputOptions: {
            title: 'Scope Name',
            value: '',
            placeHolder: 'Name of the table scope',
        },
    },
    {
        property: 'table',
        inputOptions: {
            title: 'Table Name',
            value: '',
            placeHolder: 'Name of the table',
        },
    },

    {
        property: 'lower_bound',
        inputOptions: {
            title: 'Lower Bound (Keep Empty to Ignore)',
            value: '',
            placeHolder: 'The lowest matching start point in the table rows.',
        },
        isOptional: true,
    },
];

export async function start(api: string) {
    const body: { [key: string]: any } = { json: true };
    for (let query of multiQuery) {
        const inputResponse = await Utility.quickInput.create(query.inputOptions);
        if (query.isOptional && !inputResponse) {
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
