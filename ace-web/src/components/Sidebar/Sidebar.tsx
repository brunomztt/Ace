import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Sidebar.scss';
import authApi from '../../utils/authApi';
import { IUser } from '../../models/User';

interface SidebarProps {
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeButton, setActiveButton] = useState<number>(0);
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

    const handleButtonClick = (index: number): void => {
        setActiveButton(index);

        switch (index) {
            case 0:
                // TODO: Navigate to Home/Dashboard
                console.log('Home button clicked');
                break;
            case 1:
                // TODO: Navigate to Agents page
                console.log('Agents button clicked');
                break;
            case 2:
                // TODO: Navigate to Weapons page
                console.log('Weapons button clicked');
                break;
            case 3:
                // TODO: Navigate to Maps page
                console.log('Maps button clicked');
                break;
            case 4:
                // TODO: Navigate to Profile page
                console.log('Profile button clicked');
                break;
            case 5:
                // TODO: Navigate to Settings page
                console.log('Settings button clicked');
                break;
            case 6:
                if (onLogout && typeof onLogout === 'function') {
                    onLogout();
                }
                break;
            default:
                console.warn(`Unhandled button index: ${index}`);
        }
    };

    const addButtonRef = (el: HTMLButtonElement | null, index: number): void => {
        buttonRefs.current[index] = el;
    };

    return (
        <aside className="sidebar" ref={sidebarRef}>
            <button className="toggle" type="button" onClick={toggleSidebar}>
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className="inner">
                <nav className="menu" ref={menuRef}>
                    <div className="menu-buttons">
                        <button
                            type="button"
                            ref={(el) => addButtonRef(el, 0)}
                            className={activeButton === 0 ? 'active' : ''}
                            onClick={() => handleButtonClick(0)}
                        >
                            <span className="material-symbols-outlined">home</span>
                            <p>Início</p>
                        </button>
                        <button
                            type="button"
                            ref={(el) => addButtonRef(el, 1)}
                            className={activeButton === 1 ? 'active' : ''}
                            onClick={() => handleButtonClick(1)}
                        >
                            <span className="material-symbols-outlined">groups</span>
                            <p>Agentes</p>
                        </button>
                        <button
                            type="button"
                            ref={(el) => addButtonRef(el, 2)}
                            className={activeButton === 2 ? 'active' : ''}
                            onClick={() => handleButtonClick(2)}
                        >
                            <span className="material-symbols-outlined">local_fire_department</span>
                            <p>Armas</p>
                        </button>
                        <button
                            type="button"
                            ref={(el) => addButtonRef(el, 3)}
                            className={activeButton === 3 ? 'active' : ''}
                            onClick={() => handleButtonClick(3)}
                        >
                            <span className="material-symbols-outlined">map</span>
                            <p>Mapas</p>
                        </button>
                    </div>
                    <div className="configandexit">
                        <div className="profile">
                            <button
                                type="button"
                                ref={(el) => addButtonRef(el, 4)}
                                className={activeButton === 4 ? 'active' : ''}
                                onClick={() => handleButtonClick(4)}
                            >
                                <img src="logo.png" alt="Profile" />
                                <p>{userData?.nickname}</p>
                            </button>
                        </div>
                        <div className="settings">
                            <button
                                type="button"
                                ref={(el) => addButtonRef(el, 5)}
                                className={activeButton === 5 ? 'active' : ''}
                                onClick={() => handleButtonClick(5)}
                            >
                                <span className="nav-icon material-symbols-outlined">settings</span>
                                <p>Configurações</p>
                            </button>
                        </div>
                        <button
                            type="button"
                            ref={(el) => addButtonRef(el, 6)}
                            className={activeButton === 6 ? 'active' : ''}
                            onClick={() => handleButtonClick(6)}
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <p>Sair</p>
                        </button>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
