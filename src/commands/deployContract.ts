import * as vscode from 'vscode';
import * as Service from '../service/index';
import * as Commands from './index';
import * as Utility from '../utility/index';
import * as glob from 'glob';
import * as fs from 'fs';
import { Serialize } from 'eosjs';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.deployContract, async () => {
        if (!Service.wallet.exists()) {
            vscode.window.showInformationMessage('No wallet available.');
            return;
        }

        const wasmFiles = glob.sync(Utility.files.getWorkspaceFolder() + '/**/*.wasm');
        if (wasmFiles.length <= 0) {
            vscode.window.showInformationMessage('No compiled contracts available.');
            return;
        }

        const items = wasmFiles.map((x) => {
            x = x.replace(/\\/gm, '/');
            const splitFilePath = x.split('/');
            const fileName = splitFilePath[splitFilePath.length - 1];
            return { label: fileName, description: x };
        });

        const filePath = await Utility.quickPick.create({
            title: 'Select Contract',
            items,
            placeholder: 'Type / Use Arrow Keys',
        });

        if (!filePath) {
            vscode.window.showErrorMessage('No contract was selected.');
            return;
        }

        const api = await Service.api.getSignable();
        if (!api) {
            vscode.window.showErrorMessage('Could not create signable API. Wrong password? Bad endpoint?');
            return;
        }

        const signer = await Utility.quickInput.create({
            title: 'What account are we deploying to?',
            placeHolder: 'myacc@active',
            value: '',
        });

        if (!signer) {
            vscode.window.showErrorMessage('Account to deploy to was not provided.');
            return;
        }

        let [actor, permission] = signer.split('@');
        if (!permission) {
            permission = 'active';
        }

        const wasm = fs.readFileSync(filePath).toString('hex');
        const abiPath = filePath.replace('.wasm', '.abi');
        if (!fs.existsSync(abiPath)) {
            vscode.window.showErrorMessage('ABI file does not exist for provided contract.');
            return;
        }

        const buffer = new Serialize.SerialBuffer({
            textEncoder: api.textEncoder,
            textDecoder: api.textDecoder,
        });

        const abiDefinition = api.abiTypes.get(`abi_def`);
        let abi = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
        abi = abiDefinition.fields.reduce(
            (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
            abi
        );
        abiDefinition.serialize(buffer, abi);

        const authorization = [{ actor, permission }];
        const outputChannel = Utility.outputChannel.get();
        const transactionResult = await api
            .transact(
                {
                    actions: [
                        {
                            authorization,
                            account: 'eosio',
                            name: 'setcode',
                            data: {
                                account: actor,
                                vmtype: 0,
                                vmversion: 0,
                                code: wasm,
                            },
                        },
                        {
                            authorization,
                            account: 'eosio',
                            name: 'setabi',
                            data: {
                                account: actor,
                                abi: Buffer.from(buffer.asUint8Array()).toString(`hex`),
                            },
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
