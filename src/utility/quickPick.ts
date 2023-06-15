import * as vscode from 'vscode';

export function create<T = string>(options: {
    title: string;
    placeholder: string;
    items: { label: string; description: string }[];
}): Promise<T | string | undefined> {
    const quickPick = vscode.window.createQuickPick();

    quickPick.onDidHide(() => {
        quickPick.dispose();
    });

    quickPick.title = options.title;
    quickPick.items = options.items;
    quickPick.placeholder = options.placeholder;
    quickPick.show();

    return new Promise((resolve: (value: string | undefined) => void) => {
        quickPick.onDidChangeSelection((selection) => {
            if (!selection || selection.length <= 0) {
                return;
            }

            resolve(selection[0].description);
            quickPick.dispose();
        });

        quickPick.onDidHide(() => {
            resolve(undefined);
            quickPick.dispose();
        });
    });
}
