import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.showWalletPublicKeys, async () => {
        if (!Service.wallet.exists()) {
            vscode.window.showInformationMessage('No wallet available.');
            return;
        }

        if (Service.wallet.isUnlocked()) {
            Service.wallet.listPublicKeys(undefined);
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

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    return () => {
        if (!disposable) {
            return;
        }

        disposable.dispose();
    };
}

Service.command.register('showWalletPublicKeys', register);
