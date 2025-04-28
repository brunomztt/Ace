import React, { useEffect, useRef } from 'react';
import './Dialog.scss';

export type DialogType = 'success' | 'error' | 'info' | 'confirm';

interface DialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    type: DialogType;
    onClose: () => void;
    onConfirm?: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, title, message, type, onClose, onConfirm }) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                if (type !== 'confirm') {
                    onClose();
                }
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen, onClose, type]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getDefaultTitle = () => {
        switch (type) {
            case 'success':
                return 'Sucesso';
            case 'error':
                return 'Erro';
            case 'confirm':
                return 'Confirmar';
            default:
                return 'Informação';
        }
    };

    return (
        <div className="dialog-overlay">
            <div className={`dialog-container ${type}`} ref={dialogRef}>
                <div className="dialog-header">
                    <span className="dialog-title">{title || getDefaultTitle()}</span>
                    {type !== 'confirm' && (
                        <button className="dialog-close" onClick={onClose}>
                            ×
                        </button>
                    )}
                </div>
                <div className="dialog-content">
                    <div className="dialog-icon">
                        {type === 'success' && <i className="bx bx-check-circle"></i>}
                        {type === 'error' && <i className="bx bx-error-circle"></i>}
                        {type === 'info' && <i className="bx bx-info-circle"></i>}
                        {type === 'confirm' && <i className="bx bx-help-circle"></i>}
                    </div>
                    <div className="dialog-message">
                        {message.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </div>
                <div className="dialog-footer">
                    {type === 'confirm' ? (
                        <>
                            <button className="dialog-button cancel-button" onClick={onClose}>
                                Cancelar
                            </button>
                            <button className="dialog-button confirm-button" onClick={onConfirm}>
                                Confirmar
                            </button>
                        </>
                    ) : (
                        <button className="dialog-button" onClick={onClose}>
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dialog;
