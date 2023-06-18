import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.unlockWallet, async () => {
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

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    return () => {
        if (!disposable) {
            return;
        }

        disposable.dispose();
    };
}

Service.command.register('unlockWallet', register);
