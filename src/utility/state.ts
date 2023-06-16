import * as Utility from './index';

export function set(key: string, value: any) {
    const keyName = `ultra.${key}`;
    Utility.context.get().globalState.update(keyName, value);
}

export function get<T = unknown>(key: string): T | undefined {
    const keyName = `ultra.${key}`;
    return Utility.context.get().globalState.get(keyName);
}

export function has(key: string): boolean {
    const keyName = `ultra.${key}`;
    return typeof Utility.context.get().globalState.get(keyName) !== 'undefined';
}
