import * as vscode from 'vscode';
import * as Utility from '../utility/index';
import * as ecc from 'eosjs-ecc';

const walletKeyName = 'wallet';

let unlockedWallet: Array<string> | undefined = undefined;
let timeoutInstance: NodeJS.Timeout | undefined;

export async function add(wif: string, password: string): Promise<boolean> {
    const data = await Utility.state.get<string>(walletKeyName);
    if (!data) {
        vscode.window.showWarningMessage(`Could not read wallet data.`);
        return false;
    }

    if (!ecc.isValidPrivate(wif)) {
        vscode.window.showWarningMessage(`Could not read wallet data.`);
        return false;
    }

    const privateKeys = Utility.crypto.decrypt<Array<string>>(data, password, true);
    if (!privateKeys || !Array.isArray(privateKeys)) {
        vscode.window.showWarningMessage(`Could not decrypt wallet data. Bad password?`);
        return false;
    }

    const publicKey = ecc.privateToPublic(wif);
    vscode.window.showInformationMessage(`Added Public Key: ${publicKey}`);

    if (privateKeys.includes(wif)) {
        vscode.window.showErrorMessage(`Key already exists.`);
        return false;
    }

    if (unlockedWallet) {
        unlockedWallet.push(wif);
    }

    privateKeys.push(wif);
    const encryptedData = Utility.crypto.encrypt(JSON.stringify(privateKeys), password);
    Utility.state.set(walletKeyName, encryptedData);

    return true;
}

export async function create(password: string): Promise<boolean> {
    vscode.window.showInformationMessage(`Creating Wallet`);
    const passwordAgain = await Utility.quickInput.create({
        title: 'Confirm Password',
        placeHolder: 'password again',
        value: '',
        password: true,
    });

    if (!passwordAgain) {
        vscode.window.showWarningMessage(`Wallet creation stopped`);
        return false;
    }

    if (password !== passwordAgain) {
        vscode.window.showWarningMessage(`Passwords did not match, try again.`);
        return false;
    }

    const wif = await Utility.quickInput.create({
        title: 'Add Private Key',
        placeHolder: 'Paste private key here...',
        value: '',
        password: true,
    });

    if (!wif) {
        vscode.window.showWarningMessage(`Private key was not provided. Aborted.`);
        return false;
    }

    if (!ecc.isValidPrivate(wif)) {
        vscode.window.showWarningMessage(`Invalid private key`);
        return false;
    }

    const encryptedData = Utility.crypto.encrypt(JSON.stringify([wif]), password);
    Utility.state.set(walletKeyName, encryptedData);

    const publicKey = ecc.privateToPublic(wif);
    vscode.window.showInformationMessage(`Added Public Key: ${publicKey}`);
    return true;
}

export async function get(password: string | undefined): Promise<Array<string> | undefined> {
    if (isUnlocked()) {
        return unlockedWallet;
    }

    if (!Utility.state.has(walletKeyName)) {
        const didCreate = await create(String(password));
        if (!didCreate) {
            return undefined;
        }
    }

    const data = await Utility.state.get<string>(walletKeyName);
    if (!data) {
        vscode.window.showWarningMessage(`Could not read wallet data.`);
        return undefined;
    }

    const newData = Utility.crypto.decrypt<Array<string>>(data, String(password), true);
    if (!newData || !Array.isArray(newData)) {
        vscode.window.showWarningMessage(`Could not decrypt wallet data`);
        return undefined;
    }

    return newData;
}

export async function listPublicKeys(password: string | undefined) {
    let privateKeys: Array<string> | undefined = undefined;
    if (!isUnlocked()) {
        const data = await Utility.state.get<string>(walletKeyName);
        if (!data) {
            vscode.window.showWarningMessage(`Could not read wallet data.`);
            return undefined;
        }

        privateKeys = Utility.crypto.decrypt<Array<string>>(data, String(password), true);
    } else {
        privateKeys = unlockedWallet;
    }

    if (!privateKeys || !Array.isArray(privateKeys)) {
        vscode.window.showWarningMessage(`Could not decrypt wallet data`);
        return undefined;
    }

    const outputChannel = Utility.outputChannel.get();
    outputChannel.show();

    outputChannel.appendLine('[');
    for (let wif of privateKeys) {
        const publicKey = ecc.privateToPublic(wif);
        outputChannel.appendLine(publicKey);
    }
    outputChannel.appendLine(']');
}

export function exists() {
    return typeof Utility.state.get<string>(walletKeyName) !== 'undefined';
}

export async function clear() {
    const response = await Utility.quickPick.create({
        title: 'Clear Wallet & Keys?',
        placeholder: 'Choose wisely',
        items: [
            { label: 'Yes', description: 'yes' },
            { label: 'No', description: 'no' },
        ],
    });

    if (!response || response === 'no') {
        return;
    }

    Utility.state.set(walletKeyName, undefined);
    vscode.window.showWarningMessage(`Wallet was deleted.`);
}

export async function unlock(password: string, msTimeout: number) {
    const data = await Utility.state.get<string>(walletKeyName);
    if (!data) {
        vscode.window.showWarningMessage(`Could not read wallet data.`);
        return undefined;
    }

    const privateKeys = Utility.crypto.decrypt<Array<string>>(data, password, true);
    if (!privateKeys || !Array.isArray(privateKeys)) {
        vscode.window.showWarningMessage(`Could not decrypt wallet data`);
        return undefined;
    }

    unlockedWallet = privateKeys;
    if (timeoutInstance) {
        clearTimeout(timeoutInstance);
        timeoutInstance = undefined;
    }

    timeoutInstance = setTimeout(lock, msTimeout);
    vscode.window.showInformationMessage(`Wallet is now unlocked, and keys are exposed for ${msTimeout / 60000}m`);
}

export async function lock() {
    timeoutInstance = undefined;
    unlockedWallet = undefined;
    vscode.window.showInformationMessage('Wallet is now locked.');
}

export function isUnlocked() {
    return typeof unlockedWallet === 'undefined' ? false : true;
}

export async function getPrivateKeys(): Promise<Array<string> | undefined> {
    let privateKeys: string[] | undefined;
    if (!isUnlocked()) {
        const password = await Utility.quickInput.create({
            title: 'Enter Password',
            placeHolder: 'Enter wallet password',
            value: '',
            password: true,
        });

        if (!password) {
            return undefined;
        }

        privateKeys = await get(password);
    } else {
        privateKeys = await get(undefined);
    }

    return privateKeys;
}
