import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.destroyWallet, async () => {
        const walletExists = await Service.wallet.exists();
        if (!walletExists) {
            vscode.window.showInformationMessage('No wallet available.');
            return;
        }

        Service.wallet.clear();
    });

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    return () => {
        if (!disposable) {
            return;
        }

        disposable.dispose();
    };
}

Service.command.register('destroyWallet', register);
