gsap.registerPlugin(CustomEase);
const customEase = CustomEase.create("custom", ".87,0,.13,1");
const counter = document.getElementById("counter");

gsap.set(".video-container", {
    scale: 0,
    rotation: -20,
});

gsap.to(".hero", {
    clipPath: "polygon(0% 45%, 25% 45%, 25% 55%, 0% 55%)",
    duration: 1.5,
    ease: customEase,
    delay: 1,
});

gsap.to(".hero", {
    clipPath: "polygon(0% 45%, 100% 45%, 100% 55%, 0% 55%)",
    duration: 2,
    ease: customEase,
    delay: 3,

    onStart: () => {
        gsap.to(".progress-bar", {
            width: "100vw",
            duration: 2,     
            ease: customEase
        });
        gsap.to(counter, {
            innerHTML: 100,
            duration: 2,
            ease: customEase,
            snap: { innerHTML: 1},
        
        }); 
    },
});

gsap.to(".hero", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    duration: 1,
    ease: customEase,
    delay: 5,
    onStart: () => {
        gsap.to(".video-container", {
            scale: 1,
            rotation: 0,
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.25,
            ease: customEase, 
            
        });

        gsap.to(".progress-bar", {
            opacity: 0,
            duration: 0.3,
        });

        gsap.to(".logo", {
            top: "0%", 
            left: "50%", 
            transform: "translate(-50%, 0%)", 
            opacity: 1, 
            scale: 1, 
            duration: 1.25,
            ease: customEase,

            onStart: () => {
                gsap.to(".char.anim-out h1", {
                    y: "100%",
                    duration: 1,
                    stagger: -0.075,
                    ease: customEase,
                });
            },
        });
    },
});

gsap.to(".header span:not(#start)", {
    y: "0%",
    duration: 1,
    stagger: 0.070,
    ease: "power3.out",
    delay: 5.75,
});

gsap.to("button", {
    opacity: 1,
    duration: 2,
    ease: "power3.out",
    delay: 6.20, 
});

document.getElementById("start").addEventListener("click", function() {
    gsap.to([".header", "footer", "#start"], { 
        duration: 1,
        opacity: 0,
        y: -50, 
        ease: "power2.out",
        onComplete: function() {
            document.querySelector(".header").style.visibility = "hidden";
            document.querySelector("footer").style.visibility = "hidden"; 
            document.querySelector("#start").style.visibility = "hidden";
        }
    });
});

gsap.to("footer p", {
    opacity: 1,
    y: "0%",
    duration: 1,
    ease: "power3.out",
    delay: 5.75,
});
document.querySelectorAll("footer p").forEach(p => {
    p.addEventListener("mouseenter", () => {
        gsap.to(p, {
            scale: 1.1,
            color: "#df4c4c",
            duration: 0.1,
        });
    });

    p.addEventListener("mouseleave", () => {
        gsap.to(p, {
            scale: 1,
            color: "#fff",
            duration: 0.3,
        });
    });
});