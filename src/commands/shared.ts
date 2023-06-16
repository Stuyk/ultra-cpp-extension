export const commandNames = {
    installHeaders: 'ultra.installHeaders',
    buildContract: 'ultra.buildContract',
    scaffoldContract: 'ultra.scaffoldContract',
    api: 'ultra.api',
    destroyWallet: 'ultra.destroyWallet',
    createWallet: 'ultra.createWallet',
    showWalletPublicKeys: 'ultra.showWalletPublicKeys',
    addKeyToWallet: 'ultra.addKeyToWallet',
    unlockWallet: 'ultra.unlockWallet',
    lockWallet: 'ultra.lockWallet',
    transact: 'ultra.transact',
    deployContract: 'ultra.deployContract',
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
    unlockWallet: false,
    lockWallet: false,
    transact: false,
    deployContract: false,
};
