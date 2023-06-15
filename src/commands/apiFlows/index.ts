import * as getAccount from './getAccount';
import * as getTable from './getTable';
import * as getBlock from './getBlock';
import * as getCurrencyBalance from './getCurrencyBalance';
import * as getInfo from './getInfo';

export const apiWorkflows = {
    getAccount: getAccount.start,
    getInfo: getInfo.start,
    getTable: getTable.start,
    getBlock: getBlock.start,
    getCurrencyBalance: getCurrencyBalance.start,
};

export function getWorkflow(name: keyof typeof apiWorkflows): (api: string) => Promise<void> | undefined {
    return apiWorkflows[name];
}
