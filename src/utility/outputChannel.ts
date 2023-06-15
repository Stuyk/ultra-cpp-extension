import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel;

export function get(): typeof outputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('ultra-cpp');
    }

    return outputChannel;
}
