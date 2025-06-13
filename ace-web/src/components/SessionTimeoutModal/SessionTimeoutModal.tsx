import React, { useState, useEffect } from 'react';
import './SessionTimeoutModal.scss';

interface SessionTimeoutModalProps {
    isOpen: boolean;
    timeLeft: number;
    onStayLoggedIn: () => void;
    onLogout: () => void;
}

const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({ isOpen, timeLeft, onStayLoggedIn, onLogout }) => {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            setFormattedTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
    }, [timeLeft]);

    if (!isOpen) return null;

    return (
        <div className="timeout-modal-overlay">
            <div className="timeout-modal">
                <div className="timeout-modal-header">
                    <h2>Sessão prestes a expirar</h2>
                </div>
                <div className="timeout-modal-body">
                    <p>Sua sessão irá expirar em {formattedTime} devido à inatividade.</p>
                    <p>Deseja continuar conectado?</p>
                </div>
                <div className="timeout-modal-footer">
                    <button className="btn-stay" onClick={onStayLoggedIn}>
                        Continuar conectado
                    </button>
                    <button className="btn-logout" onClick={onLogout}>
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutModal;
