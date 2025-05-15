import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../utils/authApi';
import { dialogService } from '../components/Dialog/dialogService';
import SessionTimeoutModal from '../components/SessionTimeoutModal/SessionTimeoutModal';
import React from 'react';

const TIMEOUT_DURATION = 5 * 60 * 1000;
const WARNING_DURATION = 60 * 1000;

export const useSessionTimeout = (isLoggedIn: boolean) => {
    const navigate = useNavigate();
    const timeoutRef = useRef<number | null>(null);
    const warningRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);

    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WARNING_DURATION / 1000);

    const logoutUser = () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (warningRef.current) window.clearTimeout(warningRef.current);
        if (countdownRef.current) window.clearInterval(countdownRef.current);

        setShowWarning(false);
        authApi.logout();
        window.dispatchEvent(new Event('auth-change'));
        dialogService.info('Sua sessão expirou devido à inatividade. Por favor, faça login novamente.');
        navigate('/login');
    };

    const startWarningCountdown = () => {
        setTimeLeft(WARNING_DURATION / 1000);
        setShowWarning(true);

        countdownRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (countdownRef.current) window.clearInterval(countdownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        timeoutRef.current = window.setTimeout(logoutUser, WARNING_DURATION);
    };

    const resetTimer = () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (warningRef.current) window.clearTimeout(warningRef.current);
        if (countdownRef.current) window.clearInterval(countdownRef.current);

        if (showWarning) {
            setShowWarning(false);
        }

        if (isLoggedIn) {
            warningRef.current = window.setTimeout(() => {
                startWarningCountdown();
            }, TIMEOUT_DURATION - WARNING_DURATION);
        }
    };

    const handleStayLoggedIn = () => {
        resetTimer();
    };

    const handleLogout = () => {
        logoutUser();
    };

    useEffect(() => {
        if (isLoggedIn) {
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

            const handleActivity = () => {
                if (!showWarning) {
                    resetTimer();
                }
            };

            activityEvents.forEach((event) => {
                document.addEventListener(event, handleActivity);
            });

            resetTimer();

            return () => {
                if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
                if (warningRef.current) window.clearTimeout(warningRef.current);
                if (countdownRef.current) window.clearInterval(countdownRef.current);

                activityEvents.forEach((event) => {
                    document.removeEventListener(event, handleActivity);
                });
            };
        } else {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
            if (warningRef.current) window.clearTimeout(warningRef.current);
            if (countdownRef.current) window.clearInterval(countdownRef.current);
            setShowWarning(false);
        }
    }, [isLoggedIn, navigate, showWarning]);

    return {
        resetTimer,
        timeoutModal: <SessionTimeoutModal isOpen={showWarning} timeLeft={timeLeft} onStayLoggedIn={handleStayLoggedIn} onLogout={handleLogout} />,
    };
};

export default useSessionTimeout;
