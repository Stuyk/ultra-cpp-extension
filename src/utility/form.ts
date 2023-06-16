import * as Utility from './index';

export function create<T = any>(title: string, fields: Array<string>) {
    const formView = Utility.view.create(title, 'form.html');
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
