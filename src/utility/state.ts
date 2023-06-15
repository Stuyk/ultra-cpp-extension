import { ExtensionContext } from 'vscode';

let extContext: ExtensionContext;

export function init(context: ExtensionContext) {
    extContext = context;
}

export function set(key: string, value: any) {
    const keyName = `ultra.${key}`;
    extContext.globalState.update(keyName, value);
}

export function get<T = unknown>(key: string): T | undefined {
    const keyName = `ultra.${key}`;
    return extContext.globalState.get(keyName);
}

export function has(key: string): boolean {
    const keyName = `ultra.${key}`;
    return typeof extContext.globalState.get(keyName) !== 'undefined';
}
