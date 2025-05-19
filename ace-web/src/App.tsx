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
import UserSettings from './components/UserSettings/UserSettings';
import UserProfile from './components/UserProfile/UserProfile';
import AdminPanel from './components/AdminPanel/AdminPanel';
import AgentForm from './components/AgentForm/AgentForm';
import WeaponForm from './components/WeaponForm/WeaponForm';
import MapForm from './components/MapForm/MapForm';
import GuideForm from './components/GuideForm/GuideForm';
import SkinForm from './components/SkinForm/SkinForm';
import AgentListing from './components/AgentListing/AgentListing';
import WeaponListing from './components/WeaponListing/WeaponListing';
import MapListing from './components/MapListing/MapListing';
import GuideListing from './components/GuideListing/GuideListing';
import AgentView from './components/AgentView/AgentView';
import WeaponView from './components/WeaponView/WeaponView';
import MapView from './components/MapView/MapView';
import GuideView from './components/GuideView/GuideView';

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
            if (location.pathname !== '/' || (animationsComplete && isLoggedIn)) {
                heroRef.current.style.display = 'none';
            } else {
                heroRef.current.style.display = 'block';
            }
        }
    }, [location.pathname, animationsComplete]);

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
            onComplete: () => {
                setAnimationsComplete(true);
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

    const AgentViewWrapper: React.FC = () => {
        const { agentId } = useParams<{ agentId: string }>();
        return <AgentView agentId={agentId!} />;
    };

    const AgentEditWrapper: React.FC = () => {
        const { agentId } = useParams<{ agentId: string }>();
        return <AgentForm agentId={agentId!} />;
    };

    const WeaponViewWrapper: React.FC = () => {
        const { weaponId } = useParams<{ weaponId: string }>();
        return <WeaponView weaponId={weaponId!} />;
    };

    const WeaponEditWrapper: React.FC = () => {
        const { weaponId } = useParams<{ weaponId: string }>();
        return <WeaponForm weaponId={weaponId!} />;
    };

    const MapViewWrapper: React.FC = () => {
        const { mapId } = useParams<{ mapId: string }>();
        return <MapView mapId={mapId!} />;
    };

    const MapEditWrapper: React.FC = () => {
        const { mapId } = useParams<{ mapId: string }>();
        return <MapForm mapId={mapId!} />;
    };

    const GuideViewWrapper: React.FC = () => {
        const { guideId } = useParams<{ guideId: string }>();
        return <GuideView guideId={guideId!} />;
    };

    const GuideEditWrapper: React.FC = () => {
        const { guideId } = useParams<{ guideId: string }>();
        return <GuideForm guideId={guideId!} />;
    };

    const SkinEditWrapper: React.FC = () => {
        const { skinId } = useParams<{ skinId: string }>();
        return <SkinForm skinId={skinId!} />;
    };

    return (
        <Router>
            <DialogProvider>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<GuideListing />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/user/edit/:userid" element={<UserSettingWrapper />} />
                        <Route path="/user/:userid" element={<UserProfileWrapper />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/agent" element={<AgentForm />} />
                        <Route path="/agent/list" element={<AgentListing />} />
                        <Route path="/agent/:agentId" element={<AgentViewWrapper />} />
                        <Route path="/agent/edit/:agentId" element={<AgentEditWrapper />} />
                        <Route path="/weapon" element={<WeaponForm />} />
                        <Route path="/weapon/list" element={<WeaponListing />} />
                        <Route path="/weapon/:weaponId" element={<WeaponViewWrapper />} />
                        <Route path="/weapon/edit/:weaponId" element={<WeaponEditWrapper />} />
                        <Route path="/map" element={<MapForm />} />
                        <Route path="/map/list" element={<MapListing />} />
                        <Route path="/map/:mapId" element={<MapViewWrapper />} />
                        <Route path="/map/edit/:mapId" element={<MapEditWrapper />} />
                        <Route path="/guide" element={<GuideForm />} />
                        <Route path="/guide/list" element={<GuideListing />} />
                        <Route path="/guide/:guideId" element={<GuideViewWrapper />} />
                        <Route path="/guide/edit/:guideId" element={<GuideEditWrapper />} />
                        <Route path="/skin" element={<SkinForm />} />
                        <Route path="/skin/edit/:skinId" element={<SkinEditWrapper />} />
                    </Route>
                </Routes>
            </DialogProvider>
        </Router>
    );
};

export default App;
