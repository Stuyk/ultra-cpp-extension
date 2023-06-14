// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { getTemplate } from './cppTemplate';

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

        // Copy Library Files
        if (!fs.existsSync(folderPath + '/lib')) {
            const selection = await vscode.window.showInformationMessage(
                'Add Ultra.io Header Files to this Project?',
                'Yes',
                'No'
            );

            if (selection && selection === 'Yes') {
                fs.cpSync(`${context.extensionPath}/include`, `${folderPath}/lib`, {
                    recursive: true,
                    force: true,
                });
            }
        }

        if (!fs.existsSync(folderPath + '/.vscode/c_cpp_properties.json')) {
            const selection = await vscode.window.showInformationMessage(
                'Add C++ Support for Ultra.io Contracts?',
                'Yes',
                'No'
            );

            if (!selection || selection === 'No') {
                return;
            }

            const newFile = getTemplate();
            if (!fs.existsSync(folderPath + '/.vscode')) {
                fs.mkdirSync(folderPath + '/.vscode');
            }

            fs.writeFileSync(folderPath + '/.vscode/c_cpp_properties.json', JSON.stringify(newFile, null, 4));
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });

    vscode.commands.executeCommand('ultra.showInfoAsModal');
    context.subscriptions.push(showInfo);
}

// This method is called when your extension is deactivated
export function deactivate() {}
