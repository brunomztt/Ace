import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Sidebar.scss';
import authApi from '../../utils/authApi';
import { IUser } from '../../models/User';

interface SidebarProps {
    onLogout: () => void;
}

enum NavigationButton {
    HOME = 0,
    AGENTS = 1,
    WEAPONS = 2,
    MAPS = 3,
    PROFILE = 4,
    SETTINGS = 5,
    LOGOUT = 6,
}

const BUTTON_LABELS = {
    [NavigationButton.HOME]: 'Início',
    [NavigationButton.AGENTS]: 'Agentes',
    [NavigationButton.WEAPONS]: 'Armas',
    [NavigationButton.MAPS]: 'Mapas',
    [NavigationButton.PROFILE]: 'Perfil',
    [NavigationButton.SETTINGS]: 'Configurações',
    [NavigationButton.LOGOUT]: 'Sair',
};

const BUTTON_ICONS = {
    [NavigationButton.HOME]: 'home',
    [NavigationButton.AGENTS]: 'groups',
    [NavigationButton.WEAPONS]: 'local_fire_department',
    [NavigationButton.MAPS]: 'map',
    [NavigationButton.PROFILE]: '', // Profile uses pfp
    [NavigationButton.SETTINGS]: 'settings',
    [NavigationButton.LOGOUT]: 'logout',
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<NavigationButton>(NavigationButton.HOME);
    const [userData, setUserData] = useState<IUser | null>(null);

    const menuRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLElement>(null);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

    const toggleSidebar = (): void => {
        setIsOpen((prev) => !prev);
    };

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
        if (user) {
            setUserData(user);
        }
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

        switch (button) {
            case NavigationButton.HOME:
                // TODO: Navigate to Home/Dashboard
                console.log('Home button clicked');
                break;
            case NavigationButton.AGENTS:
                // TODO: Navigate to Agents page
                console.log('Agents button clicked');
                break;
            case NavigationButton.WEAPONS:
                // TODO: Navigate to Weapons page
                console.log('Weapons button clicked');
                break;
            case NavigationButton.MAPS:
                // TODO: Navigate to Maps page
                console.log('Maps button clicked');
                break;
            case NavigationButton.PROFILE:
                // TODO: Navigate to Profile page
                console.log('Profile button clicked');
                break;
            case NavigationButton.SETTINGS:
                // TODO: Navigate to Settings page
                console.log('Settings button clicked');
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
        <aside className="sidebar" ref={sidebarRef}>
            <button className="toggle" type="button" onClick={() => setIsOpen((prev) => !prev)}>
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className="inner">
                <nav className="menu" ref={menuRef}>
                    <div className="menu-buttons">
                        {renderNavigationButton(NavigationButton.HOME, BUTTON_ICONS[NavigationButton.HOME], BUTTON_LABELS[NavigationButton.HOME])}
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
                        {renderNavigationButton(NavigationButton.MAPS, BUTTON_ICONS[NavigationButton.MAPS], BUTTON_LABELS[NavigationButton.MAPS])}
                    </div>
                    <div className="configandexit">
                        <div className="profile">
                            <button
                                type="button"
                                ref={(el) => addButtonRef(el, NavigationButton.PROFILE)}
                                className={activeButton === NavigationButton.PROFILE ? 'active' : ''}
                                onClick={() => handleButtonClick(NavigationButton.PROFILE)}
                            >
                                <img src="logo.png" alt="Profile" />
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
        </aside>
    );
};

export default Sidebar;
