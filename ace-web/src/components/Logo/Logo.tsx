import React, { forwardRef } from 'react';
import './Logo.scss';

interface LogoProps {
    logoSrc: string;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(({ logoSrc }, ref) => {
    return (
        <div className="logo" ref={ref}>
            <div className="char">
                <img src={logoSrc} alt="Logo" className="logo-image" />
            </div>
            <div className="char-container">
                <div className="char anim-out">
                    <h1>A</h1>
                </div>
                <div className="char anim-out">
                    <h1>c</h1>
                </div>
                <div className="char anim-out">
                    <h1>e</h1>
                </div>
            </div>
        </div>
    );
});

export default Logo;
