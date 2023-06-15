export const commandNames = {
    installHeaders: 'ultra.installHeaders',
    buildContract: 'ultra.buildContract',
    scaffoldContract: 'ultra.scaffoldContract',
    api: 'ultra.api',
};

export const installed: { [K in keyof typeof commandNames]: boolean } = {
    buildContract: false,
    installHeaders: false,
    scaffoldContract: false,
    api: false,
};
