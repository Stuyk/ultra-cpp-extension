import * as vscode from 'vscode';
import * as Utility from '../utility';
import * as fs from 'fs';
import * as Service from '../service/index';

let disposable: vscode.Disposable;

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.scaffoldContract, async () => {
        const workspaceFolder = Utility.files.getWorkspaceFolder();
        if (!workspaceFolder) {
            vscode.window.showErrorMessage(`Could not determine workspace folder. Open a folder with VSCode. `);
            return;
        }

        const inputBox = vscode.window.createInputBox();
        inputBox.title = 'What folder in this workspace should we use?';
        inputBox.placeholder = 'src';
        inputBox.value = 'src';
        inputBox.show();

        await new Promise((resolve: Function) => {
            inputBox.onDidAccept((e) => {
                resolve();
            });
        });

        inputBox.hide();

        let folderPath = inputBox.value;
        if (!folderPath || folderPath === '') {
            vscode.window.showWarningMessage(`Could not determine folder path: ${folderPath}`);
            return;
        }

        if (folderPath.includes('/') || folderPath.includes('\\')) {
            vscode.window.showWarningMessage(`Folder path cannot contain '\\' or '/'`);
            return;
        }

        const filePath = `${workspaceFolder}/${folderPath}/hello.cpp`;
        fs.cpSync(`${Utility.files.getExtensionPath()}/files/hello.cpp`, filePath, {
            recursive: true,
            force: true,
        });

        vscode.window.showInformationMessage(`Created File: ${filePath}`);
        vscode.workspace.openTextDocument(filePath);
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

Service.command.register('scaffoldContract', register);
