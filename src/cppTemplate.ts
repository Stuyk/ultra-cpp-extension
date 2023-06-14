import * as vscode from 'vscode';

export const cppTemplate = {
    configurations: [
        {
            includePath: ['${workspaceFolder}/**'],
            defines: ['_DEBUG', 'UNICODE', '_UNICODE', 'int128_t=__int128_t', 'uint128_t=__uint128_t'],
            cStandard: 'c17',
            cppStandard: 'c++20',
        },
    ],
    version: 4,
};

/**
 * Get the cpp template file as an object.
 *
 * @export
 * @param {vscode.ExtensionContext} context
 * @return {typeof cppTemplate}
 */
export function getCppTemplate(context: vscode.ExtensionContext): typeof cppTemplate {
    const templateCopy = JSON.parse(JSON.stringify(cppTemplate)) as typeof cppTemplate;
    const extensionPath = context.extension.extensionPath.replace(/\\/gm, '/');
    templateCopy.configurations[0].includePath.push(`${extensionPath}/include/**`);
    templateCopy.configurations[0].includePath.push(`${extensionPath}/include/eosiolib/contracts/**`);
    templateCopy.configurations[0].includePath.push(`${extensionPath}/include/eosiolib/core/**`);
    return templateCopy;
}

export function combine(
    context: vscode.ExtensionContext,
    template: typeof cppTemplate
): { wasUpdated: boolean; content: typeof cppTemplate } {
    if (!template.configurations) {
        template.configurations = [JSON.parse(JSON.stringify(cppTemplate.configurations[0]))];
    }

    const extensionPath = context.extension.extensionPath.replace(/\\/gm, '/');
    let wasUpdated = false;

    for (let config of template.configurations) {
        let hasFullInclude = false;
        let hasContracts = false;
        let hasCore = false;

        for (let includePath of config.includePath) {
            if (includePath.includes('include/**')) {
                hasFullInclude = true;
            }

            if (includePath.includes('eosiolib/contracts')) {
                hasContracts = true;
            }

            if (includePath.includes('eosiolib/core')) {
                hasCore = true;
            }
        }

        if (!hasFullInclude) {
            config.includePath.push(`${extensionPath}/include/**`);
            wasUpdated = true;
        }

        if (!hasContracts) {
            config.includePath.push(`${extensionPath}/include/eosiolib/contracts/**`);
            wasUpdated = true;
        }

        if (!hasCore) {
            config.includePath.push(`${extensionPath}/include/eosiolib/core/**`);
            wasUpdated = true;
        }
    }

    return { wasUpdated, content: template };
}
