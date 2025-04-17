import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import VideoContainer from './components/VideoContainer/VideoContainer';
import LoginForm from './components/LoginForm/LoginForm';
import Logo from './components/Logo/Logo';
import './App.scss';

gsap.registerPlugin(CustomEase);

const App: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLElement>(null);
    const loginFormRef = useRef<HTMLDivElement>(null);

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

        gsap.to('footer p', {
            opacity: 1,
            y: '0%',
            duration: 1,
            ease: 'power3.out',
            delay: 5.75,
        });
    }, []);

    const handleStart = () => {
        if (!headerRef.current || !footerRef.current || !loginFormRef.current) return;

        gsap.to([headerRef.current, footerRef.current, '#start'], {
            duration: 1,
            opacity: 0,
            y: -50,
            ease: 'power2.out',
            onComplete: function () {
                if (headerRef.current) headerRef.current.style.display = 'none';
                if (footerRef.current) footerRef.current.style.display = 'none';
                const startButton = document.getElementById('start');
                if (startButton) startButton.style.display = 'none';
            },
        });

        loginFormRef.current.style.display = 'block';

        gsap.to(loginFormRef.current, {
            duration: 3,
            opacity: 1,
            visibility: 'visible',
            ease: 'power2.out',
        });

        if (window.innerWidth < 650) {
            const logoImage = document.querySelector('.logo-image');
            const logo = document.querySelector('.logo');
            if (logoImage) (logoImage as HTMLElement).style.display = 'none';
            if (logo) (logo as HTMLElement).style.display = 'none';
        }
    };

    return (
        <div className="home-container">
            <div id="unsupported-message">
                <p>Seu dispositivo não é suportado.</p>
            </div>

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

                <Footer ref={footerRef} />

                <Header ref={headerRef} onStart={handleStart} />
            </div>

            <Logo ref={logoRef} logoSrc="logo.png" />

            <LoginForm ref={loginFormRef} />
        </div>
    );
};

export default App;
