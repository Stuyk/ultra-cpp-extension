import * as vscode from 'vscode';
import * as Utility from '../utility/index';
import * as Service from '../service/index';
import * as wharfkit from '@wharfkit/antelope';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.createKey, async () => {
        const keyType = await Utility.quickPick.create({
            title: 'Choose Key Version',
            items: [
                { label: 'K1', description: 'K1' },
                { label: 'R1', description: 'R1' },
                { label: 'WA', description: 'WA' },
            ],
            placeholder: 'Choose a key version. K1 is considered default.',
        });

        if (!keyType) {
            return;
        }

        const privateKey = wharfkit.PrivateKey.generate(keyType);
        const publicKeyType = await Utility.quickPick.create({
            title: 'Choose Public Key Type',
            items: [
                { label: 'Standard', description: 'standard' },
                { label: 'Legacy', description: 'legacy' },
            ],
            placeholder: 'Choose a public key version. Legacy starts with "EOS"',
        });

        const ready = await Utility.quickPick.create({
            title: 'Keys will be printed to console, are you ready to view them?',
            items: [
                { label: 'Yes', description: 'yes' },
                { label: 'No', description: 'no' },
            ],
            placeholder: 'Read above carefully before selecting an answer.',
        });

        if (ready === 'no') {
            vscode.window.showWarningMessage('Declined showing keys after generation.');
            return;
        }

        const output = Utility.outputChannel.get();

        if (keyType === 'K1') {
            output.appendLine(`Private: ${privateKey.toWif()}`);
        } else {
            output.appendLine(`Private: ${privateKey.toString()}`);
        }

        if (publicKeyType === 'standard') {
            output.appendLine(`Public: ${privateKey.toPublic().toString()}`);
        } else {
            output.appendLine(`Public: ${privateKey.toPublic().toLegacyString()}`);
        }

        output.show();
    });

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);
    return () => {
        if (disposable) {
            disposable.dispose();
        }
    };
}

Service.command.register('createKey', register);
