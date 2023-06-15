import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.showWalletPublicKeys, async () => {
        if (!Service.wallet.exists()) {
            vscode.window.showInformationMessage('No wallet available.');
            return;
        }

        const password = await Utility.quickInput.create({
            title: 'Enter Password',
            placeHolder: 'Enter wallet password',
            value: '',
            password: true,
        });

        if (!password) {
            vscode.window.showErrorMessage('Password must be at least 6 characters.');
            return;
        }

        Service.wallet.listPublicKeys(password);
    });

    Commands.shared.installed.showWalletPublicKeys = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
