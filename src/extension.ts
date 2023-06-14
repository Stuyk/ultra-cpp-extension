// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { getTemplate } from './cppTemplate';
import { build } from '@ultraos/contract-builder';

const CommandNames = {
    installHeaders: 'ultra.installHeaders',
    buildContract: 'ultra.buildContract',
};

function getWorkspaceFolder(): string | undefined {
    if (!vscode.workspace.workspaceFolders) {
        return undefined;
    }

    const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.workspace.workspaceFolders[0].uri);
    return activeWorkspaceFolder?.uri.fsPath.replace(/\\/gm, '/');
}

function cmdBuildContract(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
    const buildContract = vscode.commands.registerCommand(CommandNames.buildContract, async () => {
        outputChannel.appendLine(
            `Starting contract build, if this is your first time running this. It may take a moment to get the docker image, and start.`
        );
        outputChannel.show(true);
        const startTime = Date.now();

        const workspaceFolder = getWorkspaceFolder();
        if (!workspaceFolder) {
            outputChannel.appendLine(`Could not determine workspace folder.`);
            outputChannel.appendLine(`Try opening VSCode directly on the folder containing the smart contract.`);
            return;
        }

        await build(String(workspaceFolder), { buildOpts: '', appendLine: outputChannel.appendLine });
        outputChannel.appendLine(`Done | ${Date.now() - startTime}ms`);
    });

    context.subscriptions.push(buildContract);
}

function cmdInstallHeaders(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel) {
    const installHeaders = vscode.commands.registerCommand(CommandNames.installHeaders, async () => {
        const workspaceFolder = getWorkspaceFolder();
        if (!workspaceFolder) {
            outputChannel.appendLine(`Could not determine workspace folder.`);
            outputChannel.appendLine(`Try opening VSCode directly on the folder containing the smart contract.`);
            return;
        }

        // Copy Library Files
        if (!fs.existsSync(workspaceFolder + '/lib')) {
            const selection = await vscode.window.showInformationMessage(
                'Add Ultra.io Header Files to this Project?',
                'Yes',
                'No'
            );

            if (selection && selection === 'Yes') {
                fs.cpSync(`${context.extensionPath}/include`, `${workspaceFolder}/lib`, {
                    recursive: true,
                    force: true,
                });

                outputChannel.appendLine(`Copied Header Files to: ${context.extensionPath}/include}`);
            }
        }

        if (!fs.existsSync(workspaceFolder + '/.vscode/c_cpp_properties.json')) {
            const selection = await vscode.window.showInformationMessage(
                'Add C++ Support for Ultra.io Contracts?',
                'Yes',
                'No'
            );

            if (!selection || selection === 'No') {
                return;
            }

            const newFile = getTemplate();
            if (!fs.existsSync(workspaceFolder + '/.vscode')) {
                fs.mkdirSync(workspaceFolder + '/.vscode');
            }

            fs.writeFileSync(workspaceFolder + '/.vscode/c_cpp_properties.json', JSON.stringify(newFile, null, 4));
            outputChannel.appendLine(`Copied C++ Properties to .vscode folder`);
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    });

    context.subscriptions.push(installHeaders);
}

export async function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('ultra-cpp');
    cmdBuildContract(context, outputChannel);
    cmdInstallHeaders(context, outputChannel);
    vscode.commands.executeCommand(CommandNames.installHeaders);
}

export function deactivate() {}
