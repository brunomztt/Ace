import { DialogType } from './Dialog';

let showDialogFn: (message: string, type: DialogType, title?: string) => void;
let closeDialogFn: () => void;
let showConfirmDialogFn: (title: string, message: string, onConfirm: () => void) => void;

export const registerDialogFunctions = (
    show: (message: string, type: DialogType, title?: string) => void,
    close: () => void,
    showConfirm: (title: string, message: string, onConfirm: () => void) => void
) => {
    showDialogFn = show;
    closeDialogFn = close;
    showConfirmDialogFn = showConfirm;
};

export const dialogService = {
    success: (message: string) => {
        if (!showDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        showDialogFn(message, 'success');
    },
    error: (message: string) => {
        if (!showDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        showDialogFn(message, 'error');
    },
    info: (message: string) => {
        if (!showDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        showDialogFn(message, 'info');
    },
    confirm: (title: string, message: string, onConfirm: () => void) => {
        if (!showConfirmDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        showConfirmDialogFn(title, message, onConfirm);
    },
    close: () => {
        if (!closeDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        closeDialogFn();
    },
};
