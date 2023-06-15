import * as vscode from 'vscode';

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
