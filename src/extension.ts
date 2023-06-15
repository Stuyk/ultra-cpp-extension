// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Commands from './commands';

export async function activate(context: vscode.ExtensionContext) {
    if (!Commands.shared.installed.installHeaders) {
        Commands.installHeaders.listen(context);
    }

    if (!Commands.shared.installed.buildContract) {
        Commands.buildContract.register(context);
    }

    if (!Commands.shared.installed.scaffoldContract) {
        Commands.scaffoldContract.register(context);
    }

    if (!Commands.shared.installed.api) {
        Commands.api.register(context);
    }
}

export function deactivate() {
    Commands.api.dispose();
    Commands.installHeaders.dispose();
    Commands.buildContract.dispose();
    Commands.scaffoldContract.dispose();
}
