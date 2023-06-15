import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.createWallet, async () => {
        if (Service.wallet.exists()) {
            vscode.window.showInformationMessage('Wallet already exists!');
            return;
        }

        const password = await Utility.quickInput.create({
            title: 'Enter Password',
            placeHolder: 'Remember what password you use!',
            value: '',
            password: true,
        });

        if (!password || password.length <= 6) {
            vscode.window.showErrorMessage('Password must be at least 6 characters.');
            return;
        }

        const didCreate = Service.wallet.create(password);
        if (!didCreate) {
            vscode.window.showErrorMessage('Failed to create wallet');
            return;
        }
    });

    Commands.shared.installed.createWallet = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
