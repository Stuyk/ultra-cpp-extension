import * as vscode from 'vscode';
import * as Utility from '../utility';
import * as Commands from './index';
import { build } from '@ultraos/contract-builder';

let disposable: vscode.Disposable;
let disposableStatusBar: vscode.StatusBarItem;

export function register(context: vscode.ExtensionContext) {
    disposable = vscode.commands.registerCommand(Commands.shared.commandNames.buildContract, async () => {
        Utility.outputChannel
            .get()
            .appendLine(
                `Starting contract build, if this is your first time running this. It may take a moment to get the docker image, and start.`
            );

        Utility.outputChannel.get().show(true);

        const startTime = Date.now();
        const activeFileFolder = Utility.files.getActiveFileFolder();

        if (!activeFileFolder) {
            vscode.window.showErrorMessage(`Open the root .cpp file of the smart contract you want to compile.`);
            return;
        }

        vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, cancellable: false, title: 'Contract Build' },
            async (progress) => {
                progress.report({ message: 'Starting', increment: 0 });
                progress.report({ message: `File Path ${activeFileFolder}`, increment: 10 });

                disposableStatusBar.text = 'ᕫ Compiling';
                disposableStatusBar.command = undefined;
                disposableStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');

                Utility.outputChannel.get().clear();
                Utility.outputChannel.get().appendLine(`Using File Path: ${activeFileFolder}`);

                await build(String(activeFileFolder), {
                    buildOpts: '',
                    appendLine: Utility.outputChannel.get().appendLine,
                });

                progress.report({ message: 'Finished Build', increment: 100 });
                Utility.outputChannel.get().appendLine(`Done | ${Date.now() - startTime}ms`);

                disposableStatusBar.text = 'ᕫ Compile';
                disposableStatusBar.command = Commands.shared.commandNames.buildContract;
                disposableStatusBar.backgroundColor = undefined;
            }
        );
    });

    disposableStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    disposableStatusBar.text = 'ᕫ Compile';
    disposableStatusBar.command = Commands.shared.commandNames.buildContract;
    disposableStatusBar.tooltip = 'Compile the smart contract in the active text editor.';
    disposableStatusBar.show();

    vscode.window.onDidChangeActiveTextEditor((e) => {
        if (!e || !e.document) {
            return;
        }

        const fileExtensions = ['.cpp', '.hpp', '.cc'];
        let isCpp = false;
        for (let ext of fileExtensions) {
            if (!e.document.fileName.includes(ext)) {
                continue;
            }

            isCpp = true;
            break;
        }

        if (isCpp) {
            disposableStatusBar.show();
        } else {
            disposableStatusBar.hide();
        }
    });

    context.subscriptions.push(disposable);
    Commands.shared.installed.buildContract = true;
}

export function showStatusBar() {
    if (!disposableStatusBar) {
        return;
    }

    disposableStatusBar.show();
}

export function hideStatusBar() {
    if (!disposableStatusBar) {
        return;
    }

    disposableStatusBar.hide();
}

export function dispose() {
    if (disposable) {
        disposable.dispose();
    }

    if (disposableStatusBar) {
        disposableStatusBar.dispose();
    }
}
