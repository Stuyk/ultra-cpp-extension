import fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as Commands from './index';
import * as Utility from '../utility/index';
import * as Service from '../service/index';
import { apiWorkflows, getWorkflow } from './apiFlows';

let disposable: vscode.Disposable;
let disposableStatusBar: vscode.StatusBarItem;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.api, async () => {
        const endpoint = await Service.api.pick();
        if (!endpoint) {
            return;
        }

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

        workflow(endpoint);
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
