import React, { useEffect, useRef } from 'react';
import './Dialog.scss';

export type DialogType = 'success' | 'error' | 'info';

interface DialogProps {
    isOpen: boolean;
    message: string;
    type: DialogType;
    onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, message, type, onClose }) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onClose();
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
    }, [isOpen, onClose]);

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

    return (
        <div className="dialog-overlay">
            <div className={`dialog-container ${type}`} ref={dialogRef}>
                <div className="dialog-header">
                    <span className="dialog-title">{type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Informação'}</span>
                    <button className="dialog-close" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="dialog-content">
                    <div className="dialog-icon">
                        {type === 'success' && <i className="bx bx-check-circle"></i>}
                        {type === 'error' && <i className="bx bx-error-circle"></i>}
                        {type === 'info' && <i className="bx bx-info-circle"></i>}
                    </div>
                    <div className="dialog-message">
                        {message.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </div>
                <div className="dialog-footer">
                    <button className="dialog-button" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dialog;
