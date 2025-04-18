import { DialogType } from './Dialog';

let showDialogFn: (message: string, type: DialogType) => void;
let closeDialogFn: () => void;

export const registerDialogFunctions = (show: (message: string, type: DialogType) => void, close: () => void) => {
    showDialogFn = show;
    closeDialogFn = close;
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
    close: () => {
        if (!closeDialogFn) {
            console.error('Dialog service not initialized');
            return;
        }
        closeDialogFn();
    },
};
