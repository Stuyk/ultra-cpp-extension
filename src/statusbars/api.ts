import * as vscode from 'vscode';
import * as Service from '../service/index';

let disposableStatusBar: vscode.StatusBarItem;

function register() {
    disposableStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    disposableStatusBar.text = 'ᕫ API';
    disposableStatusBar.command = Service.command.commandNames.api;
    disposableStatusBar.tooltip = 'Query Data from the Blockchain';
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

export function dispose() {
    if (!disposableStatusBar) {
        return;
    }

    disposableStatusBar.dispose();
    disposableStatusBar = undefined;
}
