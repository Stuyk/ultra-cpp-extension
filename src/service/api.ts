import * as Utility from '../utility/index';
import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
import * as Service from '../service/index';

let defaultAPIs = [
    { label: 'Ultra Mainnet', description: 'https://api.mainnet.ultra.io' },
    { label: 'Ultra Testnet', description: 'https://api.testnet.ultra.io' },
    { label: 'Antelope Mainnet', description: 'https://eos.dfuse.eosnation.io' },
    { label: 'Jungle Testnet', description: 'https://jungle.eosusa.io' },
    { label: 'Custom', description: 'http://localhost:8888' },
];

async function getLastAPI(): Promise<{ label: string; description: string } | undefined> {
    const exists = await Utility.state.has('api');
    if (!exists) {
        return undefined;
    }

    return await Utility.state.get<{ label: string; description: string }>('api');
}

async function checkEndpoint(endpoint: string): Promise<boolean> {
    const updateProgressBar = await Utility.progress.create('API', 'Checking connection...', 10);
    const startTime = Date.now();
    const response = await fetch(endpoint + '/v1/chain/get_info').catch((err) => {
        return undefined;
    });

    if (!response || !response.ok) {
        updateProgressBar({ message: 'Failed to query!', increment: 100 });
        vscode.window.showWarningMessage(`Could not reach endpoint: ${endpoint}`);
        return false;
    }

    updateProgressBar({ message: `Got response in ${Date.now() - startTime}ms`, increment: 100 });
    return true;
}

export async function pick(): Promise<string | undefined> {
    const lastApi = await getLastAPI();

    let api = await Utility.quickPick.create({
        title: 'Select API',
        items: lastApi ? [lastApi, ...defaultAPIs] : defaultAPIs,
        placeholder: 'Select endpoint...',
    });

    if (api === 'http://localhost:8888') {
        api = await Utility.quickInput.create({
            title: 'Enter Custom API',
            value: 'http://localhost:8888',
        });
    }

    if (!api) {
        vscode.window.setStatusBarMessage('Cancelled API Query...', 2500);
        return;
    }

    const isResponsive = await checkEndpoint(api);
    if (!isResponsive) {
        vscode.window.setStatusBarMessage('API was unresponsive', 2500);
        return;
    }

    await Utility.state.set('api', { label: 'Last Used', description: api });
    return api;
}

export async function getSignable(): Promise<Api | undefined> {
    const endpoint = await pick();
    if (!endpoint) {
        return undefined;
    }

    const privateKeys = await Service.wallet.getPrivateKeys();
    if (!privateKeys) {
        return undefined;
    }

    if (privateKeys.length <= 0) {
        return undefined;
    }

    const rpc = new JsonRpc(endpoint, { fetch });
    const signatureProvider = new JsSignatureProvider(privateKeys);
    return new Api({ rpc, signatureProvider });
}
