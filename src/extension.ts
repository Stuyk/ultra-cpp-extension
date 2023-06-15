// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Commands from './commands';
import * as Utility from './utility/index';

export async function activate(context: vscode.ExtensionContext) {
    Utility.state.init(context);

    // !TODO - Refactor command registration, there's a common thread here.
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

    if (!Commands.shared.installed.createWallet) {
        Commands.createWallet.register(context);
    }

    if (!Commands.shared.installed.showWalletPublicKeys) {
        Commands.showWalletPublicKeys.register(context);
    }

    if (!Commands.shared.installed.destroyWallet) {
        Commands.destroyWallet.register(context);
    }

    if (!Commands.shared.installed.addKeyToWallet) {
        Commands.addKeyToWallet.register(context);
    }
}

export function deactivate() {
    Commands.api.dispose();
    Commands.installHeaders.dispose();
    Commands.buildContract.dispose();
    Commands.scaffoldContract.dispose();
    Commands.createWallet.dispose();
    Commands.showWalletPublicKeys.dispose();
    Commands.destroyWallet.dispose();
    Commands.addKeyToWallet.dispose();
}
