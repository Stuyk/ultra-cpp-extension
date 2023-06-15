import * as vscode from 'vscode';
import * as Utility from './index';

type ProgressReport = {
    message?: string | undefined;
    increment?: number | undefined;
};

type ProgressCallback = (data: ProgressReport) => void;

export async function create(title: string, message: string, increment = 0): Promise<ProgressCallback> {
    return new Promise((resolve: (cb: ProgressCallback) => void) => {
        vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, cancellable: false, title },
            async (progress) => {
                let currentIncrement = increment;

                progress.report({ message, increment });

                const handleProgressChange = (data: ProgressReport) => {
                    currentIncrement = data.increment as number;
                    progress.report(data);
                };

                resolve(handleProgressChange);

                await new Promise((resolve: Function) => {
                    const interval = setInterval(() => {
                        if (currentIncrement <= 99) {
                            return;
                        }

                        clearInterval(interval);
                        resolve();
                    });
                });

                await Utility.sleep(250);
            }
        );
    });
}
