import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../utils/authApi';
import { dialogService } from '../components/Dialog/dialogService';
import SessionTimeoutModal from '../components/SessionTimeoutModal/SessionTimeoutModal';
import React from 'react';

const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const WARNING_DURATION = 30 * 1000; // 30 seconds

export const useSessionTimeout = (isLoggedIn: boolean) => {
    const navigate = useNavigate();
    const timeoutRef = useRef<number | null>(null);
    const warningRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(WARNING_DURATION / 1000);

    const logoutUser = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (warningRef.current) {
            window.clearTimeout(warningRef.current);
            warningRef.current = null;
        }
        if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
        }

        setShowWarning(false);
        authApi.logout();
        window.dispatchEvent(new Event('auth-change'));
        dialogService.info('Sua sessão expirou devido à inatividade. Por favor, faça login novamente.');
        navigate('/login');
    }, [navigate]);

    const startWarningCountdown = useCallback(() => {
        setTimeLeft(WARNING_DURATION / 1000);
        setShowWarning(true);

        countdownRef.current = window.setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (countdownRef.current) {
                        window.clearInterval(countdownRef.current);
                        countdownRef.current = null;
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        timeoutRef.current = window.setTimeout(logoutUser, WARNING_DURATION);
    }, [logoutUser]);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (warningRef.current) {
            window.clearTimeout(warningRef.current);
            warningRef.current = null;
        }
        if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
        }

        if (showWarning) {
            setShowWarning(false);
        }

        if (isLoggedIn) {
            warningRef.current = window.setTimeout(() => {
                startWarningCountdown();
            }, TIMEOUT_DURATION - WARNING_DURATION);
        }
    }, [isLoggedIn, showWarning, startWarningCountdown]);

    const handleStayLoggedIn = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    const handleLogout = useCallback(() => {
        logoutUser();
    }, [logoutUser]);

    const handleActivity = useCallback(() => {
        if (!showWarning) {
            resetTimer();
        }
    }, [showWarning, resetTimer]);

    useEffect(() => {
        if (isLoggedIn) {
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

            activityEvents.forEach((event) => {
                document.addEventListener(event, handleActivity, { passive: true });
            });

            resetTimer();

            return () => {
                activityEvents.forEach((event) => {
                    document.removeEventListener(event, handleActivity);
                });

                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                if (warningRef.current) {
                    window.clearTimeout(warningRef.current);
                    warningRef.current = null;
                }
                if (countdownRef.current) {
                    window.clearInterval(countdownRef.current);
                    countdownRef.current = null;
                }
            };
        } else {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (warningRef.current) {
                window.clearTimeout(warningRef.current);
                warningRef.current = null;
            }
            if (countdownRef.current) {
                window.clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            setShowWarning(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

            activityEvents.forEach((event) => {
                document.removeEventListener(event, handleActivity);
                document.addEventListener(event, handleActivity, { passive: true });
            });

            return () => {
                activityEvents.forEach((event) => {
                    document.removeEventListener(event, handleActivity);
                });
            };
        }
    }, [isLoggedIn, handleActivity]);

    return {
        resetTimer,
        timeoutModal: <SessionTimeoutModal isOpen={showWarning} timeLeft={timeLeft} onStayLoggedIn={handleStayLoggedIn} onLogout={handleLogout} />,
    };
};

export default useSessionTimeout;
