import * as vscode from 'vscode';
import * as Utility from '../utility/index';

export async function getExtensionPath(): Promise<string> {
    const context = await Utility.context.get();
    return context.extensionPath.replace(/\\/gm, '/');
}

export function getWorkspaceFolder(): string | undefined {
    if (!vscode.workspace.workspaceFolders) {
        return undefined;
    }

    const activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.workspace.workspaceFolders[0].uri);
    return activeWorkspaceFolder?.uri.fsPath.replace(/\\/gm, '/');
}

export function getActiveFileFolder(): string | undefined {
    if (!vscode.window.activeTextEditor) {
        return undefined;
    }

    const filePath = vscode.window.activeTextEditor.document.uri.fsPath.replace(/\\/gm, '/');
    const paths = filePath.split('/');
    paths.pop();
    return paths.join('/');
}

export function getActiveFile(): string | undefined {
    if (!vscode.window.activeTextEditor) {
        return undefined;
    }

    return vscode.window.activeTextEditor.document.uri.fsPath.replace(/\\/gm, '/');
}
