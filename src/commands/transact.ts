import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Utility from '../utility/index';
import { GetAbiResult } from 'eosjs/dist/eosjs-rpc-interfaces';

async function register() {
    const disposable = vscode.commands.registerCommand(Service.command.commandNames.transact, async () => {
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

        const actions: { [action: string]: Array<{ name: string; type: string }> } = {};
        for (let abiStruct of result.abi.structs) {
            const isAction = result.abi.actions.find((x) => x.name === abiStruct.name);
            if (!isAction) {
                continue;
            }

            if (!actions[abiStruct.name]) {
                actions[abiStruct.name] = [];
            }

            for (let field of abiStruct.fields) {
                actions[abiStruct.name].push({ name: field.name, type: field.type });
            }
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
                outputChannel.appendLine(err);
                outputChannel.show();
                return undefined;
            });

        if (!transactionResult) {
            outputChannel.appendLine('Failed to transact.');
            return;
        }

        if (typeof transactionResult === 'object') {
            outputChannel.appendLine(JSON.stringify(transactionResult, null, 2));
            outputChannel.show();
            return;
        }

        outputChannel.appendLine(transactionResult.toString());
        outputChannel.show();
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

Service.command.register('transact', register);
