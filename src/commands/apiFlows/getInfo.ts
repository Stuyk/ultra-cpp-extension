import * as vscode from 'vscode';
import fetch from 'node-fetch';
import * as Utility from '../../utility/index';

const endpoint = '/v1/chain/get_info';

export async function start(api: string) {
    const outputChannel = Utility.outputChannel.get();
    outputChannel.show();
    outputChannel.appendLine(endpoint);

    const response = await fetch(api + endpoint).catch((err) => {
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
