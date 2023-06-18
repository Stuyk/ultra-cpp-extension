import * as vscode from 'vscode';
import * as Utility from './index';
import * as fs from 'fs';

export async function create(
    title: string,
    htmlFileName: string
): Promise<{
    panel: vscode.WebviewPanel;
    post: (data: { event: string; data: any }) => void;
    on: (event: string, cb: (data: any) => void) => void;
}> {
    const context = await Utility.context.get();
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
    const panel = vscode.window.createWebviewPanel('ultra.view', title, column || vscode.ViewColumn.One, {
        enableForms: true,
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'html')],
    });

    const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'html', htmlFileName);
    panel.webview.html = fs.readFileSync(htmlPath.fsPath.replace(/\\/gm, '/'), 'utf-8');

    const callbacks: { [eventName: string]: Function } = {};
    const post = (data: { event: string; data: any }) => {
        panel.webview.postMessage(data);
    };

    const on = (event: string, cb: (data: any) => void) => {
        callbacks[event] = cb;
    };

    panel.webview.onDidReceiveMessage((msg: { event: string; data: any }) => {
        if (!callbacks[msg.event]) {
            return;
        }

        callbacks[msg.event](msg.data);
    });

    return { panel, post, on };
}
