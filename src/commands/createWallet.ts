import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.createWallet, async () => {
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

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    return () => {
        if (!disposable) {
            return;
        }

        disposable.dispose();
    };
}

Service.command.register('createWallet', register);
