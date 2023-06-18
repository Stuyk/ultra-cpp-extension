import * as vscode from 'vscode';
import * as Utility from '../utility/index';

let extContext: vscode.ExtensionContext;

export function init(context: vscode.ExtensionContext) {
    extContext = context;
}

/**
 * Returns the extension context after it is assigned
 *
 * @export
 * @return {Promise<vscode.ExtensionContext>}
 */
export async function get(): Promise<vscode.ExtensionContext> {
    if (typeof extContext === 'undefined') {
        await Utility.sleep(500);
        return get();
    }

    return extContext;
}
