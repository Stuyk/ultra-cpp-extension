import * as vscode from 'vscode';
import * as Service from '../service/index';

let disposableStatusBar: vscode.StatusBarItem;

function register() {
    disposableStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    setAsLocked();
    disposableStatusBar.show();
}

export function showStatusBar() {
    if (!disposableStatusBar) {
        register();
    }

    disposableStatusBar.show();
}

export function hideStatusBar() {
    if (!disposableStatusBar) {
        register();
    }

    disposableStatusBar.hide();
}

export function setAsLocked() {
    disposableStatusBar.text = '$(lock) Wallet';
    disposableStatusBar.command = Service.command.commandNames.unlockWallet;
    disposableStatusBar.tooltip = 'Unlock Wallet';
    disposableStatusBar.backgroundColor = undefined;
}

export function setAsUnlocked() {
    disposableStatusBar.text = '$(unlock) Wallet';
    disposableStatusBar.command = Service.command.commandNames.lockWallet;
    disposableStatusBar.tooltip = 'Lock Wallet';
    disposableStatusBar.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
}

export function dispose() {
    if (!disposableStatusBar) {
        return;
    }

    disposableStatusBar.dispose();
    disposableStatusBar = undefined;
}
