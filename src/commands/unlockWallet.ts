import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.unlockWallet, async () => {
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
            vscode.window.showErrorMessage('Password was not defined.');
            return;
        }

        const timeoutInMinutes = await Utility.quickInput.create({
            title: 'Minutes before Auto-Lock',
            placeHolder: 'How many minutes before locking the wallet?',
            value: '',
            password: false,
        });

        if (!timeoutInMinutes) {
            vscode.window.showErrorMessage('Numerical value provided is not a valid timeout.');
            return;
        }

        const minutesAsNumber = parseInt(timeoutInMinutes);
        if (isNaN(minutesAsNumber)) {
            vscode.window.showErrorMessage('Numerical value provided is not a valid timeout.');
            return;
        }

        let ms = minutesAsNumber * 60 * 1000;
        Service.wallet.unlock(password, ms);
    });

    Commands.shared.installed.unlockWallet = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
