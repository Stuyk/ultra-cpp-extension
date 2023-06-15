import * as vscode from 'vscode';
import * as Utility from '../utility';
import * as Commands from './index';
import * as fs from 'fs';

let disposable: vscode.Disposable;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.scaffoldContract, async () => {
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
        fs.cpSync(`${context.extensionPath}/files/hello.cpp`, filePath, {
            recursive: true,
            force: true,
        });

        vscode.window.showInformationMessage(`Created File: ${filePath}`);
        vscode.workspace.openTextDocument(filePath);
    });

    Commands.shared.installed.scaffoldContract = true;
    context.subscriptions.push(disposable);
}

export function dispose() {
    if (!disposable) {
        return;
    }

    disposable.dispose();
}
