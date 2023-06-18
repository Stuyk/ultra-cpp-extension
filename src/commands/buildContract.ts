import * as vscode from 'vscode';
import * as Utility from '../utility';
import * as Service from '../service';
import * as StatusBars from '../statusbars';
import { build } from '@ultraos/contract-builder';

let disposable: vscode.Disposable;
const fileExtensions = ['.cpp', '.hpp', '.cc'];

function isCpp(fileName: string) {
    for (let ext of fileExtensions) {
        if (!fileName.includes(ext)) {
            continue;
        }

        return true;
    }

    return false;
}

async function register() {
    disposable = vscode.commands.registerCommand(Service.command.commandNames.buildContract, async () => {
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

                StatusBars.buildContract.disable();

                Utility.outputChannel.get().clear();
                Utility.outputChannel.get().appendLine(`Using File Path: ${activeFileFolder}`);

                await build(String(activeFileFolder), {
                    buildOpts: '',
                    appendLine: Utility.outputChannel.get().appendLine,
                });

                StatusBars.buildContract.enable();

                progress.report({ message: 'Finished Build', increment: 100 });
                Utility.outputChannel.get().appendLine(`Done | ${Date.now() - startTime}ms`);
            }
        );
    });

    const onChangeDisposable = vscode.window.onDidChangeActiveTextEditor((e) => {
        if (!e || !e.document) {
            return;
        }

        if (isCpp(e.document.fileName)) {
            StatusBars.buildContract.showStatusBar();
        } else {
            StatusBars.buildContract.hideStatusBar();
        }
    });

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    const activeFile = Utility.files.getActiveFile();
    if (isCpp(activeFile)) {
        StatusBars.buildContract.showStatusBar();
    }

    return () => {
        if (onChangeDisposable) {
            onChangeDisposable.dispose();
        }

        if (disposable) {
            disposable.dispose();
        }

        StatusBars.buildContract.dispose();
    };
}

Service.command.register('buildContract', register);
