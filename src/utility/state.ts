import * as Utility from './index';

export async function set(key: string, value: any) {
    const keyName = `ultra.${key}`;
    const context = await Utility.context.get();
    context.globalState.update(keyName, value);
}

export async function get<T = unknown>(key: string): Promise<T | undefined> {
    const keyName = `ultra.${key}`;
    const context = await Utility.context.get();
    return context.globalState.get(keyName);
}

export async function has(key: string): Promise<boolean> {
    const keyName = `ultra.${key}`;
    const context = await Utility.context.get();
    return typeof context.globalState.get(keyName) !== 'undefined';
}
