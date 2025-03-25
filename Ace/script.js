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
            document.querySelector(".header").style.display = "none";
            document.querySelector("footer").style.display = "none"; 
            document.querySelector("#start").style.display = "none";
        }
    });

document.querySelector(".container-login").style.display = "block";

gsap.to(".container-login", { 
    duration: 3,
    opacity: 1, 
    visibility: "visible",
    ease: "power2.out",
});

if (window.innerWidth < 650) {
    document.querySelector(".logo-image").style.display = "none";
    document.querySelector(".logo").style.display = "none";

}

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

const container = document.querySelector('.container-login');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active'); 
});

window.onload = () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const cpfInput = document.getElementById('reg-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            if (value.length > 9) {
                value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
            }
            e.target.value = value;
        });
    }

    const passwordInput = document.getElementById('reg-pwd');
    const confirmPasswordInput = document.getElementById('reg-pwd-confirm');
    
    if (passwordInput) {
        let strengthBar = document.createElement('div');
        strengthBar.innerHTML = `
            <div style="height:3px; background:#ddd; margin:5px 0">
                <div style="height:100%; width:0; background:#f00"></div>
            </div>
            <div style="font-size:11px; color:#888">Digite uma senha</div>
        `;
        passwordInput.parentNode.appendChild(strengthBar);
        
        const evaluatePassword = () => {
            const password = passwordInput.value;
            const bar = strengthBar.querySelector('div > div');
            const text = strengthBar.querySelector('div + div');
            
            let points = 0;
            if (password.length >= 8) points++;
            if (/[a-z]/.test(password)) points++;
            if (/[A-Z]/.test(password)) points++;
            if (/\d/.test(password)) points++;
            if (/[^a-zA-Z0-9]/.test(password)) points++;
            
            let percentage = points * 20;
            let color, message;
            
            if (password === '') {
                color = '#ddd';
                message = 'Digite uma senha';
                percentage = 0;
            } else if (points <= 2) {
                color = '#f55';
                message = 'Senha fraca';
            } else if (points <= 4) {
                color = '#fa3';
                message = 'Senha média';
            } else {
                color = '#5c3';
                message = 'Senha forte';
            }
            
            bar.style.width = percentage + '%';
            bar.style.background = color;
            text.textContent = message;
            text.style.color = color;
        };
        
        passwordInput.addEventListener('input', evaluatePassword);
        
        if (passwordInput.value) {
            evaluatePassword();
        }
        
        addPasswordToggle(passwordInput);
    }
    
    if (confirmPasswordInput && passwordInput) {
        const confirmMsg = document.createElement('div');
        confirmMsg.style.fontSize = '11px';
        confirmMsg.style.marginTop = '4px';
        confirmMsg.style.display = 'none';
        confirmPasswordInput.parentNode.appendChild(confirmMsg);

        const checkPasswords = () => {
            const original = passwordInput.value;
            const confirm = confirmPasswordInput.value;
            if (confirm === '') {
                confirmMsg.style.display = 'none';
                return;
            }
            confirmMsg.style.display = 'block';
            confirmMsg.textContent = original === confirm ? 'Senhas iguais' : 'Senhas diferentes';
            confirmMsg.style.color = original === confirm ? '#5c3' : '#f55';
        };

        confirmPasswordInput.addEventListener('input', checkPasswords);
        
        if (confirmPasswordInput.value) {
            checkPasswords();
        }
        
        addPasswordToggle(confirmPasswordInput);
    }
    
    const emailInput = document.getElementById('reg-email');
    if (emailInput) {
        const emailMsg = document.createElement('div');
        emailMsg.style.fontSize = '11px';
        emailMsg.style.marginTop = '4px';
        emailMsg.style.display = 'none';
        emailInput.parentNode.appendChild(emailMsg);

        const validateEmail = () => {
            const email = emailInput.value;
            if (email === '') {
                emailMsg.style.display = 'none';
                return;
            }
            emailMsg.style.display = 'block';
            if (email.indexOf('@') > 0 && email.indexOf('.', email.indexOf('@')) > 0) {
                emailMsg.textContent = 'Email válido';
                emailMsg.style.color = '#5c3';
                return;
            }
            emailMsg.textContent = 'Email inválido';
            emailMsg.style.color = '#f55';
        };

        emailInput.addEventListener('input', validateEmail);
        
        if (emailInput.value) {
            validateEmail();
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = loginForm.querySelector('.username-field').value;
            const pwd = loginForm.querySelector('.pwd-field').value;
            if (!user || !pwd) {
                alert('Preencha todos os campos!');
                return;
            }
            alert('Login válido!');
        });
        
        const loginPwd = loginForm.querySelector('.pwd-field');
        if (loginPwd) {
            addPasswordToggle(loginPwd);
        }
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const cpf = document.getElementById('reg-cpf').value;
            const pwd = document.getElementById('reg-pwd').value;
            const confirmPwd = document.getElementById('reg-pwd-confirm').value;
            const errors = [];

            if (user.length < 3) {
                errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
            }
            if (email.indexOf('@') < 0 || email.indexOf('.', email.indexOf('@')) < 0) {
                errors.push('Email inválido');
            }
            if (cpf.replace(/\D/g, '').length !== 11) {
                errors.push('CPF incompleto');
            }
            if (pwd.length < 8) {
                errors.push('Senha deve ter pelo menos 8 caracteres');
            }
            if (!(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd))) {
                errors.push('Senha deve ser forte');
            }
            if (pwd !== confirmPwd) {
                errors.push('As senhas não coincidem');
            }
            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }
            alert('Cadastro realizado com sucesso!');
        });
    }
    
    const userFields = document.querySelectorAll('.username-field');
    userFields.forEach((field) => {
        field.maxLength = 20;
        
        let counter = document.createElement('div');
        counter.style.fontSize = '11px';
        counter.style.textAlign = 'right';
        counter.style.color = '#888';
        field.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            counter.textContent = field.value.length + '/20';
        };
        
        field.addEventListener('input', updateCounter);
        
        updateCounter();
    });
    
    function addPasswordToggle(passwordField) {
        const eyeIcon = document.createElement('i');
        eyeIcon.className = 'bx bx-hide';
        eyeIcon.style.position = 'absolute';
        eyeIcon.style.right = '50px';
        eyeIcon.style.top = '50%';
        eyeIcon.style.transform = 'translateY(-50%)';
        eyeIcon.style.cursor = 'pointer';
        eyeIcon.style.color = '#888';
        eyeIcon.style.fontSize = '20px';
        eyeIcon.style.zIndex = '10';
        
        passwordField.parentNode.appendChild(eyeIcon);
        
        eyeIcon.addEventListener('click', () => {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.className = 'bx bx-show';
                return;
            }
            passwordField.type = 'password';
            eyeIcon.className = 'bx bx-hide';
        });
    }
};