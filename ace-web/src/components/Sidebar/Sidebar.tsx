import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Sidebar.scss';
import authApi from '../../utils/authApi';
import { IUser } from '../../models/User';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    onLogout: () => void;
}

enum NavigationButton {
    HOME = 0,
    AGENTS = 1,
    WEAPONS = 2,
    MAPS = 3,
    GUIDES = 4,
    ADMIN_PANEL = 5,
    PROFILE = 6,
    SETTINGS = 7,
    LOGOUT = 8,
}

const BUTTON_LABELS = {
    [NavigationButton.HOME]: 'Início',
    [NavigationButton.AGENTS]: 'Agentes',
    [NavigationButton.WEAPONS]: 'Armas',
    [NavigationButton.MAPS]: 'Mapas',
    [NavigationButton.GUIDES]: 'Guias',
    [NavigationButton.ADMIN_PANEL]: 'Painel Admin',
    [NavigationButton.PROFILE]: 'Perfil',
    [NavigationButton.SETTINGS]: 'Configurações',
    [NavigationButton.LOGOUT]: 'Sair',
};

const BUTTON_ICONS = {
    [NavigationButton.HOME]: 'home',
    [NavigationButton.AGENTS]: 'groups',
    [NavigationButton.WEAPONS]: 'local_fire_department',
    [NavigationButton.MAPS]: 'map',
    [NavigationButton.GUIDES]: 'book',
    [NavigationButton.ADMIN_PANEL]: 'admin_panel_settings',
    [NavigationButton.PROFILE]: '', // Profile uses pfp
    [NavigationButton.SETTINGS]: 'settings',
    [NavigationButton.LOGOUT]: 'logout',
};

const DEFAULT_PROFILE_IMAGE = '/logo.png';
const DESKTOP_WIDTH = 1024;

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<NavigationButton>(NavigationButton.GUIDES);
    const [userData, setUserData] = useState<IUser | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_IMAGE);
    const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth >= DESKTOP_WIDTH);

    const menuRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const handleResize = () => {
            const desktop = window.innerWidth >= DESKTOP_WIDTH;
            setIsDesktop(desktop);
            if (desktop && !isOpen) {
                setIsOpen(true);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    useEffect(() => {
        if (sidebarRef.current) {
            gsap.set(sidebarRef.current, {
                x: -100,
                opacity: 0,
            });

            gsap.to(sidebarRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2,
            });
        }
    }, []);

    useEffect(() => {
        if (buttonRefs.current.length > 0) {
            const firstButton = buttonRefs.current[0];
            if (menuRef.current && firstButton) {
                menuRef.current.style.setProperty('--top', `${firstButton.offsetTop}px`);
            }
        }
    }, []);

        useEffect(() => {
        const user = authApi.getCurrentUser();
        console.log('Dados do usuário atual:', user); // <<< VERIFIQUE AQUI
        if (user) {
            setUserData(user);
            setIsAdmin(user.roleName === 'Admin');
            setProfileImage(user.profilePic || DEFAULT_PROFILE_IMAGE);
        }
        }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const user = authApi.getCurrentUser();
            if (user) {
                setProfileImage(user.profilePic || DEFAULT_PROFILE_IMAGE);
                setUserData(user);
                setIsAdmin(user.roleName === 'Admin');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('userDataUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userDataUpdated', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (sidebarRef.current) {
            if (isOpen) {
                sidebarRef.current.classList.add('open');
                if (logoRef.current) {
                    gsap.to(logoRef.current, { x: 50, duration: 0.3, ease: 'power2.out' });
                }
            } else {
                sidebarRef.current.classList.remove('open');
                if (logoRef.current) {
                    gsap.to(logoRef.current, { x: 0, duration: 0.3, ease: 'power2.inOut' });
                }
            }
        }

        if (menuRef.current && buttonRefs.current[activeButton]) {
            const activeButtonEl = buttonRefs.current[activeButton];
            if (activeButtonEl) {
                menuRef.current.style.setProperty('--top', `${activeButtonEl.offsetTop}px`);
            }
        }
    }, [isOpen, activeButton]);

    const handleButtonClick = (button: NavigationButton): void => {
        setActiveButton(button);

        if (!userData) {
            return;
        }

        switch (button) {
            case NavigationButton.HOME:
                navigate(`/`);
                break;
            case NavigationButton.AGENTS:
                navigate(`/agent/list`);
                break;
            case NavigationButton.WEAPONS:
                navigate(`/weapon/list`);
                break;
            case NavigationButton.MAPS:
                navigate('/map/list');
                break;
            case NavigationButton.ADMIN_PANEL:
                navigate(`/admin`);
                break;
            case NavigationButton.PROFILE:
                navigate(`/user/${userData.userId}`);
                break;
            case NavigationButton.SETTINGS:
                navigate(`/user/edit/${userData.userId}`);
                break;
            case NavigationButton.GUIDES:
                navigate('/guide/list');
                break;
            case NavigationButton.LOGOUT:
                if (onLogout && typeof onLogout === 'function') {
                    onLogout();
                }
                break;
            default:
                console.warn(`Unhandled button type: ${button}`);
        }
    };

    const addButtonRef = (el: HTMLButtonElement | null, index: number): void => {
        buttonRefs.current[index] = el;
    };

    const renderNavigationButton = (button: NavigationButton, icon: string, label: string) => (
        <button
            type="button"
            ref={(el) => addButtonRef(el, button)}
            className={activeButton === button ? 'active' : ''}
            onClick={() => handleButtonClick(button)}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <p>{label}</p>
        </button>
    );

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} ref={sidebarRef}>
            {!isOpen ? (
                <button className="hamburger" type="button" onClick={() => setIsOpen(true)}>
                    <span className="material-symbols-outlined">menu</span>
                </button>
            ) : (
                <>
                    {!isDesktop && (
                        <button className="toggle" type="button" onClick={() => setIsOpen(false)}>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                    )}
                    <div className="inner">
                        <nav className="menu" ref={menuRef}>
                            <div className="menu-buttons">
                                {renderNavigationButton(
                                    NavigationButton.GUIDES,
                                    BUTTON_ICONS[NavigationButton.GUIDES],
                                    BUTTON_LABELS[NavigationButton.GUIDES]
                                )}
                                {renderNavigationButton(
                                    NavigationButton.AGENTS,
                                    BUTTON_ICONS[NavigationButton.AGENTS],
                                    BUTTON_LABELS[NavigationButton.AGENTS]
                                )}
                                {renderNavigationButton(
                                    NavigationButton.WEAPONS,
                                    BUTTON_ICONS[NavigationButton.WEAPONS],
                                    BUTTON_LABELS[NavigationButton.WEAPONS]
                                )}
                                {renderNavigationButton(
                                    NavigationButton.MAPS,
                                    BUTTON_ICONS[NavigationButton.MAPS],
                                    BUTTON_LABELS[NavigationButton.MAPS]
                                )}
                                {isAdmin &&
                                    renderNavigationButton(
                                        NavigationButton.ADMIN_PANEL,
                                        BUTTON_ICONS[NavigationButton.ADMIN_PANEL],
                                        BUTTON_LABELS[NavigationButton.ADMIN_PANEL]
                                    )}
                            </div>
                            <div className="configandexit">
                                <div className="profile">
                                    <button
                                        type="button"
                                        ref={(el) => addButtonRef(el, NavigationButton.PROFILE)}
                                        className={activeButton === NavigationButton.PROFILE ? 'active' : ''}
                                        onClick={() => handleButtonClick(NavigationButton.PROFILE)}
                                    >
                                        <img
                                            src={profileImage || DEFAULT_PROFILE_IMAGE}
                                            alt="Profile"
                                            onError={() => setProfileImage(DEFAULT_PROFILE_IMAGE)}
                                        />
                                        <p>{userData?.nickname}</p>
                                    </button>
                                </div>
                                <div className="settings">
                                    {renderNavigationButton(
                                        NavigationButton.SETTINGS,
                                        BUTTON_ICONS[NavigationButton.SETTINGS],
                                        BUTTON_LABELS[NavigationButton.SETTINGS]
                                    )}
                                </div>
                                {renderNavigationButton(
                                    NavigationButton.LOGOUT,
                                    BUTTON_ICONS[NavigationButton.LOGOUT],
                                    BUTTON_LABELS[NavigationButton.LOGOUT]
                                )}
                            </div>
                        </nav>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
