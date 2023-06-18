import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.lockWallet, async () => {
        Service.wallet.lock();
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

Service.command.register('lockWallet', register);
