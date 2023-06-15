export async function sleep(msTimeout: number) {
    return new Promise((resolve: Function) => {
        setTimeout(() => resolve(), msTimeout);
    });
}
