import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { DialogProvider } from './components/Dialog/DialogContext';
import Header from './components/Header/Header';
import VideoContainer from './components/VideoContainer/VideoContainer';
import LoginForm from './components/LoginForm/LoginForm';
import Logo from './components/Logo/Logo';
import Sidebar from './components/Sidebar/Sidebar';
import authApi from './utils/authApi';
import useSessionTimeout from './hooks/useSessionTimeout';
import './App.scss';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import UserSettings from './components/UserSettings/UserSettings';
import UserProfile from './components/UserProfile/UserProfile';

gsap.registerPlugin(CustomEase);

const AppLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [animationsComplete, setAnimationsComplete] = useState<boolean>(false);

    const { timeoutModal } = useSessionTimeout(isLoggedIn);

    const heroRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (heroRef.current) {
            if (location.pathname !== '/' && location.pathname !== '/home') {
                heroRef.current.style.display = 'none';
            } else {
                heroRef.current.style.display = 'block';
            }
        }
    }, [location.pathname]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const isAuthenticated = authApi.isAuthenticated();
            setIsLoggedIn(isAuthenticated);
        };

        checkLoginStatus();

        const handleStorageChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('auth-change', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const customEase = CustomEase.create('custom', '.87,0,.13,1');

        gsap.set(videoContainerRef.current, {
            scale: 0,
            rotation: -20,
        });

        gsap.to(heroRef.current, {
            clipPath: 'polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)',
            duration: 1.5,
            ease: customEase,
            delay: 1,
        });

        gsap.to(heroRef.current, {
            clipPath: 'polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)',
            duration: 2,
            ease: customEase,
            delay: 3,
            onStart: () => {
                gsap.to(progressBarRef.current, {
                    width: '100vw',
                    duration: 2,
                    ease: customEase,
                });
                gsap.to(counterRef.current, {
                    innerHTML: 100,
                    duration: 2,
                    ease: customEase,
                    snap: { innerHTML: 1 },
                });
            },
        });

        gsap.to(heroRef.current, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1,
            ease: customEase,
            delay: 5,
            onStart: () => {
                gsap.to(videoContainerRef.current, {
                    scale: 1,
                    rotation: 0,
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    duration: 1.25,
                    ease: customEase,
                });

                gsap.to(progressBarRef.current, {
                    opacity: 0,
                    duration: 0.3,
                });

                gsap.to(logoRef.current, {
                    top: '0%',
                    left: '50%',
                    transform: 'translate(-50%, 0%)',
                    opacity: 1,
                    scale: 1,
                    duration: 1.25,
                    ease: customEase,
                    onStart: () => {
                        gsap.to('.char.anim-out h1', {
                            y: '100%',
                            duration: 1,
                            stagger: -0.075,
                            ease: customEase,
                        });
                    },
                    onComplete: () => {
                        setAnimationsComplete(true);
                    },
                });
            },
        });

        gsap.to('.header span:not(#start)', {
            y: '0%',
            duration: 1,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 5.75,
        });

        gsap.to('button', {
            opacity: 1,
            duration: 2,
            ease: 'power3.out',
            delay: 6.2,
        });
    }, []);

    const handleLogout = () => {
        authApi.logout();
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="home-container">
            <div id="unsupported-message">
                <p>Seu dispositivo não é suportado.</p>
            </div>

            {isLoggedIn && (animationsComplete || location.pathname !== '/') && <Sidebar onLogout={handleLogout} />}

            <div className="hero" ref={heroRef}>
                <div className="progress-bar" ref={progressBarRef}>
                    <p>loading</p>
                    <p>
                        /
                        <span id="counter" ref={counterRef}>
                            0
                        </span>
                    </p>
                </div>

                <VideoContainer ref={videoContainerRef} videoSrc="/video.mp4" />

                <nav>
                    <p>&#9679;</p>
                    <p>&#9679;</p>
                </nav>

                <Header onStart={() => navigate(isLoggedIn ? '/' : '/login')} />

                <Logo ref={logoRef} logoSrc="logo.png" />
            </div>

            {timeoutModal}

            <Outlet />
        </div>
    );
};

const App: React.FC = () => {
    const UserSettingWrapper: React.FC = () => {
        const { userid } = useParams<{ userid: string }>();
        return <UserSettings userId={userid!} />;
    };

    const UserProfileWrapper: React.FC = () => {
        const { userid } = useParams<{ userid: string }>();
        return <UserProfile userId={userid!} />;
    };

    return (
        <Router>
            <DialogProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/usersettings/:userid" element={<UserSettingWrapper />} />
                        <Route path="/user/:userid" element={<UserProfileWrapper />} />
                    </Route>
                </Routes>
            </DialogProvider>
        </Router>
    );
};

export default App;
