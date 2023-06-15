const PropertyTemplate = {
    configurations: [
        {
            includePath: [
                '${workspaceFolder}/**',
                '${workspaceFolder}/lib/**',
                '${workspaceFolder}/lib/eosiolib/contracts/**',
                '${workspaceFolder}/lib/eosiolib/core/**',
            ],
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
 * @return {typeof PropertyTemplate}
 */
export function get(): typeof PropertyTemplate {
    return JSON.parse(JSON.stringify(PropertyTemplate)) as typeof PropertyTemplate;
}
