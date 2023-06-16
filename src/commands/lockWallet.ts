import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.lockWallet, async () => {
        Service.wallet.lock();
    });

    Commands.shared.installed.lockWallet = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
