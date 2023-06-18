import * as Utility from './index';

export async function create<T = any>(title: string, fields: Array<{ name: string; type: string }>) {
    const formView = await Utility.view.create(title, 'form.html');
    formView.post({ event: 'setform', data: fields });
    return new Promise((resolve: (result: T | undefined) => void) => {
        let disposed = false;

        formView.on('submit', (data) => {
            resolve(data);
            disposed = true;
            formView.panel.dispose();
        });

        formView.panel.onDidDispose(() => {
            if (disposed) {
                return;
            }

            resolve(undefined);
        });
    });
}
