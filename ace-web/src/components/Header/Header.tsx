import React, { forwardRef } from 'react';
import './Header.scss';

interface HeaderProps {
    onStart: () => void;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ onStart }, ref) => {
    return (
        <div className="header" ref={ref}>
            <h1>
                <span>Combat enemies</span>
            </h1>
            <h1>
                <span>in</span>
            </h1>
            <h1>
                <span id="valorant">valorant</span>
            </h1>
            <button id="start" onClick={onStart}>
                <span>PLAY</span>
                <div className="icon">
                    <svg height="10" width="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path>
                    </svg>
                </div>
            </button>
        </div>
    );
});

export default Header;
