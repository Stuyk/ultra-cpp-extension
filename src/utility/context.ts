import * as vscode from 'vscode';

let extContext: vscode.ExtensionContext;

export function init(context: vscode.ExtensionContext) {
    extContext = context;
}

export function get(): vscode.ExtensionContext {
    return extContext;
}
