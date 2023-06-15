export const commandNames = {
    installHeaders: 'ultra.installHeaders',
    buildContract: 'ultra.buildContract',
    scaffoldContract: 'ultra.scaffoldContract',
    api: 'ultra.api',
    destroyWallet: 'ultra.destroyWallet',
    createWallet: 'ultra.createWallet',
    showWalletPublicKeys: 'ultra.showWalletPublicKeys',
    addKeyToWallet: 'ultra.addKeyToWallet',
};

export const installed: { [K in keyof typeof commandNames]: boolean } = {
    buildContract: false,
    installHeaders: false,
    scaffoldContract: false,
    api: false,
    destroyWallet: false,
    createWallet: false,
    showWalletPublicKeys: false,
    addKeyToWallet: false,
};
