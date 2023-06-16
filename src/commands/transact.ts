import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';
import * as Utility from '../utility/index';
import { GetAbiResult } from 'eosjs/dist/eosjs-rpc-interfaces';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.transact, async () => {
        if (!Service.wallet.exists()) {
            vscode.window.showErrorMessage('No wallet available.');
            return;
        }

        const api = await Service.api.getSignable();
        if (!api) {
            vscode.window.showErrorMessage('Could not create signable API. Wrong password? Bad endpoint?');
            return;
        }

        const contract = await Utility.quickInput.create({
            title: 'Contract Name',
            placeHolder: 'eosio.token',
            value: '',
        });

        if (!contract) {
            return;
        }

        const result: GetAbiResult = await api.rpc.get_abi(contract).catch((err) => {
            console.log(err);
            return undefined;
        });

        if (!result || !result.abi) {
            vscode.window.showErrorMessage(`Contract '${contract}' does not have a contract set`);
            return;
        }

        const actions: { [action: string]: string[] } = {};
        for (let abiStruct of result.abi.structs) {
            const isAction = result.abi.actions.find((x) => x.name === abiStruct.name);
            if (!isAction) {
                continue;
            }

            actions[abiStruct.name] = abiStruct.fields.map((x) => {
                return x.name;
            });
        }

        const items = Object.keys(actions).map((x) => {
            return { label: x, description: x };
        });

        const action = await Utility.quickPick.create({
            title: 'Select Action / Type',
            items,
            placeholder: 'Use arrow keys, or type',
        });

        if (!action) {
            vscode.window.showErrorMessage(`No action was selected.`);
            return;
        }

        // Ask for Signer
        const signer = await Utility.quickInput.create({
            title: 'Who is signing?',
            placeHolder: 'myacc@active',
            value: '',
        });

        if (!signer) {
            return;
        }

        let formData: any;
        if (actions[action].length >= 1) {
            formData = await Utility.form.create(action, actions[action]);
        } else {
            formData = {};
        }

        if (!formData) {
            vscode.window.showErrorMessage(`Form was not filled out. Canceled transaction.`);
            return;
        }

        let privateKeys: string[] | undefined;
        if (!Service.wallet.isUnlocked()) {
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

            privateKeys = await Service.wallet.get(password);
        } else {
            privateKeys = await Service.wallet.get(undefined);
        }

        if (!privateKeys) {
            vscode.window.showErrorMessage('Failed to obtain any keys from wallet');
            return;
        }

        if (privateKeys.length <= 0) {
            vscode.window.showErrorMessage('Add at least one private key to wallet');
            return;
        }

        let [actor, permission] = signer.split('@');
        if (!permission) {
            permission = 'active';
        }

        const outputChannel = Utility.outputChannel.get();
        const transactionResult = await api
            .transact(
                {
                    actions: [
                        {
                            account: contract,
                            name: action,
                            authorization: [{ actor, permission }],
                            data: formData,
                        },
                    ],
                },
                { blocksBehind: 3, expireSeconds: 30, broadcast: true }
            )
            .catch((err) => {
                console.error(err);
                return err;
            });

        if (typeof transactionResult === 'object') {
            outputChannel.appendLine(JSON.stringify(transactionResult, null, 2));
            outputChannel.show();
            return;
        }

        outputChannel.appendLine(transactionResult.toString());
        outputChannel.show();
    });

    Commands.shared.installed.transact = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
