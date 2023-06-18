import * as vscode from 'vscode';
import * as Utility from '../utility';
import * as fs from 'fs';
import * as Service from '../service';

let headersInstalled = false;
let propertyFileInstalled = false;

async function addHeaders() {
    if (headersInstalled) {
        return;
    }

    const workspaceFolder = Utility.files.getWorkspaceFolder();
    if (fs.existsSync(workspaceFolder + '/lib')) {
        headersInstalled = true;
        return;
    }

    const selection = await vscode.window.showInformationMessage(
        'Add Ultra.io Header Files to this Project?',
        'Yes',
        'No'
    );

    if (!selection || selection !== 'Yes') {
        return;
    }

    const isInstalling = vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, cancellable: false, title: 'Install Headers' },
        async (progress) => {
            progress.report({ message: 'Starting', increment: 10 });
            fs.cpSync(`${Utility.files.getExtensionPath()}/include`, `${workspaceFolder}/lib`, {
                recursive: true,
                force: true,
            });
            progress.report({ message: 'Headers Added', increment: 100 });
            headersInstalled = true;
        }
    );

    await new Promise((resolve: Function) => {
        return isInstalling.then(() => resolve());
    });
}

async function addPropertyFile() {
    if (propertyFileInstalled) {
        return;
    }

    const workspaceFolder = Utility.files.getWorkspaceFolder();

    if (fs.existsSync(workspaceFolder + '/.vscode/c_cpp_properties.json')) {
        propertyFileInstalled = true;
        return;
    }

    const selection = await vscode.window.showInformationMessage(
        'Add C++ Support for Ultra.io Contracts?',
        'Yes',
        'No'
    );

    if (!selection || selection === 'No') {
        return;
    }

    const isInstalling = vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification, cancellable: false, title: 'Install C++ Property File' },
        async (progress) => {
            progress.report({ message: 'Starting', increment: 10 });
            const newFile = Utility.propertyTemplate.get();

            progress.report({ message: 'Template Created', increment: 20 });
            if (!fs.existsSync(workspaceFolder + '/.vscode')) {
                fs.mkdirSync(workspaceFolder + '/.vscode');
            }

            fs.writeFileSync(workspaceFolder + '/.vscode/c_cpp_properties.json', JSON.stringify(newFile, null, 4));
            progress.report({ message: 'Template Written to File', increment: 50 });
            propertyFileInstalled = true;

            progress.report({ message: 'Restarting Window', increment: 100 });
            await new Promise((resolve: Function) => {
                setTimeout(() => resolve(), 1500);
            });

            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    );

    await new Promise((resolve: Function) => {
        return isInstalling.then(() => resolve());
    });
}

export async function listen() {
    const onChangeDisposable = vscode.window.onDidChangeActiveTextEditor(async (e: vscode.TextEditor | undefined) => {
        if (!e || !e.document) {
            return;
        }

        const filePath = e.document.uri.fsPath;
        if (!filePath.includes('.cpp') && !filePath.includes('.cc')) {
            return;
        }

        vscode.commands.executeCommand(Service.command.commandNames.installHeaders);
    });

    const disposable = vscode.commands.registerCommand(Service.command.commandNames.installHeaders, async () => {
        const workspaceFolder = Utility.files.getWorkspaceFolder();
        if (!workspaceFolder) {
            vscode.window.showErrorMessage(`Could not determine workspace folder. Open a folder with VSCode. `);
            return;
        }

        await addHeaders();
        await addPropertyFile();
    });

    const context = await Utility.context.get();
    context.subscriptions.push(disposable);

    return () => {
        if (onChangeDisposable) {
            onChangeDisposable.dispose();
        }

        if (disposable) {
            disposable.dispose();
        }

        propertyFileInstalled = false;
        headersInstalled = false;
    };
}

Service.command.register('installHeaders', listen);
