import React, { forwardRef, useEffect } from 'react';
import './Footer.scss';
import { gsap } from 'gsap';

const Footer = forwardRef<HTMLElement>((props, ref) => {
    useEffect(() => {
        const footerItems = document.querySelectorAll('footer p');

        footerItems.forEach((item) => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.1,
                    color: '#df4c4c',
                    duration: 0.1,
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    color: '#fff',
                    duration: 0.3,
                });
            });
        });

        return () => {
            footerItems.forEach((item) => {
                item.removeEventListener('mouseenter', () => {});
                item.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    return (
        <footer ref={ref}>
            <p>Profile</p>
            <p>Agents</p>
            <p>weapons</p>
            <p>ranking</p>
            <p>news</p>
        </footer>
    );
});

export default Footer;
