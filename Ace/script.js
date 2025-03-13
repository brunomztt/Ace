
// Registrando o plugin CustomEase
gsap.registerPlugin(CustomEase);

// Criando o 'CustomEase'
const customEase = CustomEase.create("custom", ".87,0,.13,1");

// Contador
const counter = document.getElementById("counter");

// Animando o vídeo
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
        // Animação da barra de progresso
        gsap.to(".progress-bar", {
            width: "100vw",  // Isso faz a largura da barra de progresso aumentar para 100% da largura da tela
            duration: 2,     // A animação dura 2 segundos
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
            top: "0%", // Mover a logo até o topo da página
            left: "50%", // Manter a centralização horizontal
            transform: "translate(-50%, 0%)", // Certifique-se de centralizar verticalmente
            opacity: 1, // Tornar a logo visível
            scale: 1, // Garantir que o tamanho não mude
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

gsap.to("#start", {
    y: "0%",
    duration: 1,
    ease: "power3.out",
    delay: 7.75,

});