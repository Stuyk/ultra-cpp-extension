import * as vscode from 'vscode';

export const commandNames = {
    installHeaders: 'ultra.installHeaders',
    buildContract: 'ultra.buildContract',
    scaffoldContract: 'ultra.scaffoldContract',
    api: 'ultra.api',
    destroyWallet: 'ultra.destroyWallet',
    createWallet: 'ultra.createWallet',
    showWalletPublicKeys: 'ultra.showWalletPublicKeys',
    addKeyToWallet: 'ultra.addKeyToWallet',
    unlockWallet: 'ultra.unlockWallet',
    lockWallet: 'ultra.lockWallet',
    transact: 'ultra.transact',
    deployContract: 'ultra.deployContract',
};

const commands: { [key: string]: Function } = {};

/**
 * Register a command, and the registered command must return a dispose function.
 *
 * @export
 * @param {keyof typeof commandNames} commandName
 * @param {() => () => void} initFunction
 * @return {*}
 */
export async function register(commandName: keyof typeof commandNames, initFunction: () => Promise<() => void>) {
    if (commands[commandName]) {
        console.log(`${commandName} was already registered.`);
        return;
    }

    const disposeFunction = await initFunction();
    commands[commandName] = disposeFunction;
    console.log(`Registered Command: ${commandName}`);
}

export function disposeAll() {
    const keys = Object.keys(commands);
    for (let key of keys) {
        commands[key]();
        delete commands[key];
    }
}
