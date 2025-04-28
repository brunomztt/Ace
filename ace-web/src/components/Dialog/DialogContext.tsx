import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Dialog, { DialogType } from './Dialog';
import { registerDialogFunctions } from './dialogService';

interface DialogState {
    isOpen: boolean;
    title?: string;
    message: string;
    type: DialogType;
    onConfirm?: () => void;
}

interface DialogContextType {
    showDialog: (message: string, type: DialogType, title?: string) => void;
    showConfirmDialog: (title: string, message: string, onConfirm: () => void) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = (): DialogContextType => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

interface DialogProviderProps {
    children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
    const [dialog, setDialog] = useState<DialogState>({
        isOpen: false,
        message: '',
        type: 'info',
    });

    const showDialog = (message: string, type: DialogType = 'info', title?: string) => {
        setDialog({
            isOpen: true,
            title,
            message,
            type,
        });
    };

    const showConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
        setDialog({
            isOpen: true,
            title,
            message,
            type: 'confirm',
            onConfirm,
        });
    };

    const closeDialog = () => {
        setDialog((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };

    useEffect(() => {
        registerDialogFunctions(showDialog, closeDialog, showConfirmDialog);
    }, []);

    return (
        <DialogContext.Provider value={{ showDialog, showConfirmDialog, closeDialog }}>
            {children}
            <Dialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                type={dialog.type}
                onClose={closeDialog}
                onConfirm={dialog.onConfirm}
            />
        </DialogContext.Provider>
    );
};

export const showSuccess = (message: string) => {
    const { showDialog } = useDialog();
    showDialog(message, 'success');
};

export const showError = (message: string) => {
    const { showDialog } = useDialog();
    showDialog(message, 'error');
};

export const showInfo = (message: string) => {
    const { showDialog } = useDialog();
    showDialog(message, 'info');
};

export const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    const { showConfirmDialog } = useDialog();
    showConfirmDialog(title, message, onConfirm);
};
