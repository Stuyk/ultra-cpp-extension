import * as vscode from 'vscode';
import * as Utility from '../utility/index';
import * as Service from '../service/index';
import * as StatusBars from '../statusbars/index';
import { apiWorkflows, getWorkflow } from './apiFlows';

let disposable: vscode.Disposable;
let disposableStatusBar: vscode.StatusBarItem;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.api, async () => {
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

    StatusBars.api.showStatusBar();

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);
    return () => {
        if (disposable) {
            disposable.dispose();
        }

        if (disposableStatusBar) {
            disposableStatusBar.dispose();
        }

        StatusBars.api.dispose();
    };
}

Service.command.register('api', register);
