import * as vscode from 'vscode';

export function create(options: { title: string; value: string; placeHolder?: string }): Promise<string | undefined> {
    const quickInput = vscode.window.showInputBox({
        title: options.title,
        value: options.value,
        placeHolder: options.placeHolder ? options.placeHolder : '',
    });

    return new Promise((resolve: (value: string | undefined) => void) => {
        quickInput.then((res) => {
            return resolve(res);
        });
    });
}
