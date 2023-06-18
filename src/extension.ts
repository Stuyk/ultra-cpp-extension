// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as Utility from './utility/index';
import * as Service from './service';
import './commands/index';

export async function activate(context: vscode.ExtensionContext) {
    Utility.context.init(context);
}

export function deactivate() {
    Service.command.disposeAll();
}
