import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as Utility from '../../utility/index';

const endpoint = '/v1/chain/get_account';

export async function start(api: string) {
    const accountName = await Utility.quickInput.create({ title: 'Account Name', value: 'ultra' });

    if (!accountName) {
        vscode.window.showWarningMessage(`Account name was not provided. Query cancelled.`);
        return;
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"account_name":"${accountName}","json":true}`,
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
