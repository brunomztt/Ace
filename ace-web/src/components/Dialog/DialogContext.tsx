import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Dialog, { DialogType } from './Dialog';
import { registerDialogFunctions } from './dialogService';

interface DialogState {
    isOpen: boolean;
    message: string;
    type: DialogType;
}

interface DialogContextType {
    showDialog: (message: string, type: DialogType) => void;
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

    const showDialog = (message: string, type: DialogType = 'info') => {
        setDialog({
            isOpen: true,
            message,
            type,
        });
    };

    const closeDialog = () => {
        setDialog((prev) => ({
            ...prev,
            isOpen: false,
        }));
    };

    useEffect(() => {
        registerDialogFunctions(showDialog, closeDialog);
    }, []);

    return (
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
            {children}
            <Dialog isOpen={dialog.isOpen} message={dialog.message} type={dialog.type} onClose={closeDialog} />
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
