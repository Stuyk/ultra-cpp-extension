// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { combine, getCppTemplate } from './cppTemplate';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const showInfo = vscode.commands.registerCommand('ultra.showInfoAsModal', async () => {
        await new Promise((resolve: Function) => {
            const interval = setInterval(() => {
                if (vscode.window.activeTextEditor) {
                    clearInterval(interval);
                    return resolve();
                }
            }, 1000);
        });

        if (!vscode.window.activeTextEditor) {
            return;
        }

        const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
        const folderPath = activeWorkspaceFolder?.uri.fsPath.replace(/\\/gm, '/');

        if (!fs.existsSync(folderPath + '/.vscode') || !fs.existsSync(folderPath + '/.vscode/c_cpp_properties.json')) {
            const selection = await vscode.window.showInformationMessage(
                'Add Header Files for Ultra.io Smart Contracts?',
                'Yes',
                'No'
            );

            if (!selection || selection === 'No') {
                return;
            }

            if (!fs.existsSync(folderPath + '/.vscode')) {
                fs.mkdirSync(folderPath + '/.vscode');
            }

            const newFile = getCppTemplate(context);
            fs.writeFileSync(folderPath + '/.vscode/c_cpp_properties.json', JSON.stringify(newFile, null, 4));
            vscode.commands.executeCommand('workbench.action.reloadWindow');
            return;
        } else {
            const oldFile = JSON.parse(
                fs.readFileSync(folderPath + '/.vscode/c_cpp_properties.json', { encoding: 'utf-8' })
            );
            const newFile = combine(context, oldFile);

            if (newFile.wasUpdated) {
                fs.writeFileSync(
                    folderPath + '/.vscode/c_cpp_properties.json',
                    JSON.stringify(newFile.content, null, 4)
                );

                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        }

        vscode.window.showInformationMessage('Smart Contract Header Files Loaded');
    });

    vscode.commands.executeCommand('ultra.showInfoAsModal');
    context.subscriptions.push(showInfo);
}

// This method is called when your extension is deactivated
export function deactivate() {}
