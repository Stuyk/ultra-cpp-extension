import fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as Commands from './index';
import * as Utility from '../utility/index';
import { apiWorkflows, getWorkflow } from './apiFlows';

let disposable: vscode.Disposable;
let disposableStatusBar: vscode.StatusBarItem;

let firstRun = true;
let lastUsed = { label: 'Ultra Mainnet', description: 'https://api.mainnet.ultra.io' };

let defaultAPIs = [
    { label: 'Ultra Mainnet', description: 'https://api.mainnet.ultra.io' },
    { label: 'Ultra Testnet', description: 'https://api.testnet.ultra.io' },
    { label: 'Antelope Mainnet', description: 'https://eos.dfuse.eosnation.io' },
    { label: 'Jungle Testnet', description: 'https://jungle.eosusa.io' },
    { label: 'Custom', description: 'http://localhost:8888' },
];

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

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.api, async () => {
        let api = await Utility.quickPick.create({
            title: 'Select API',
            items: firstRun ? defaultAPIs : [lastUsed, ...defaultAPIs],
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

        firstRun = false;
        lastUsed = { label: 'Last Used', description: api };

        const availableQueries = Object.keys(apiWorkflows);
        const dynamicItems = availableQueries.map((queryName) => {
            return {
                label: queryName,
                description: queryName,
            };
        });

        const queryNameToRun = await Utility.quickPick.create({
            title: 'Select Query',
            items: dynamicItems,
            placeholder: 'Select query...',
        });

        if (!queryNameToRun) {
            vscode.window.setStatusBarMessage('Cancelled API Query...', 2500);
            return;
        }

        const workflow = getWorkflow(queryNameToRun as keyof typeof apiWorkflows);
        if (!workflow) {
            vscode.window.setStatusBarMessage('Invalid workflow for api request...', 2500);
            return;
        }

        workflow(api);
    });

    disposableStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    disposableStatusBar.text = 'ᕫ API Query';
    disposableStatusBar.command = Commands.shared.commandNames.api;
    disposableStatusBar.tooltip = 'Query Data from the Blockchain';
    disposableStatusBar.show();

    Commands.shared.installed.api = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (disposable) {
        disposable.dispose();
    }

    if (disposableStatusBar) {
        disposableStatusBar.dispose();
    }
}
