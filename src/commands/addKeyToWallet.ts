import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.addKeyToWallet, async () => {
        const walletExists = await Service.wallet.exists();
        if (!walletExists) {
            vscode.window.showErrorMessage('Wallet does not exist. Create a wallet first!');
            return;
        }

        const password = await Utility.quickInput.create({
            title: 'Enter Password',
            placeHolder: 'Your wallet password',
            value: '',
            password: true,
        });

        if (!password || password.length <= 6) {
            vscode.window.showErrorMessage('Password must be at least 6 characters.');
            return;
        }

        const wifKey = await Utility.quickInput.create({
            title: 'Enter Private Key',
            placeHolder: 'Enter WIF Private Key',
            value: '',
            password: true,
        });

        if (!wifKey) {
            vscode.window.showErrorMessage('WIF key was not provided');
            return;
        }

        await Service.wallet.add(wifKey, password);
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

Service.command.register('addKeyToWallet', register);
