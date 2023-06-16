// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Commands from './commands';
import * as Utility from './utility/index';

export async function activate(context: vscode.ExtensionContext) {
    Utility.context.init(context);

    // !TODO - Refactor command registration, there's a common thread here.
    // I really need to refactor this, this is cursed.
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

    if (!Commands.shared.installed.lockWallet) {
        Commands.lockWallet.register(context);
    }

    if (!Commands.shared.installed.unlockWallet) {
        Commands.unlockWallet.register(context);
    }

    if (!Commands.shared.installed.transact) {
        Commands.transact.register(context);
    }

    if (!Commands.shared.installed.deployContract) {
        Commands.deployContract.register(context);
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
    Commands.lockWallet.dispose();
    Commands.unlockWallet.dispose();
    Commands.deployContract.dispose();
}
