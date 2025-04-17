import React, { useState, useEffect, useRef, forwardRef } from 'react';
import './LoginForm.scss';

const LoginForm = forwardRef<HTMLDivElement>((props, ref) => {
    const [isActive, setIsActive] = useState(false);

    const setupDone = useRef(false);

    const addPasswordToggle = (passwordField: HTMLInputElement) => {
        const existingToggle = passwordField.parentNode?.querySelector('.bx-hide, .bx-show');
        if (existingToggle) return;

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

        passwordField.parentNode?.appendChild(eyeIcon);

        eyeIcon.addEventListener('click', () => {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.className = 'bx bx-show';
            } else {
                passwordField.type = 'password';
                eyeIcon.className = 'bx bx-hide';
            }
        });
    };

    useEffect(() => {
        if (setupDone.current) return;
        setupDone.current = true;

        const setupValidations = () => {
            const cpfInput = document.getElementById('reg-cpf') as HTMLInputElement;
            if (cpfInput) {
                cpfInput.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    let value = target.value.replace(/\D/g, '');
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
                    target.value = value;
                });
            }

            const passwordInput = document.getElementById('reg-pwd') as HTMLInputElement;
            if (passwordInput) {
                if (!passwordInput.parentNode?.querySelector('.strength-bar')) {
                    let strengthBar = document.createElement('div');
                    strengthBar.className = 'strength-bar';
                    strengthBar.innerHTML = `
            <div style="height:3px; background:#ddd; margin:5px 0">
              <div style="height:100%; width:0; background:#f00"></div>
            </div>
            <div style="font-size:11px; color:#888">Digite uma senha</div>
          `;
                    passwordInput.parentNode?.appendChild(strengthBar);

                    const evaluatePassword = () => {
                        const password = passwordInput.value;
                        const bar = strengthBar.querySelector('div > div') as HTMLDivElement;
                        const text = strengthBar.querySelector('div + div') as HTMLDivElement;

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
                    if (passwordInput.value) evaluatePassword();
                }

                addPasswordToggle(passwordInput);
            }

            const confirmPasswordInput = document.getElementById(
                'reg-pwd-confirm'
            ) as HTMLInputElement;
            if (confirmPasswordInput && passwordInput) {
                if (!confirmPasswordInput.parentNode?.querySelector('.confirm-msg')) {
                    const confirmMsg = document.createElement('div');
                    confirmMsg.className = 'confirm-msg';
                    confirmMsg.style.fontSize = '11px';
                    confirmMsg.style.marginTop = '4px';
                    confirmMsg.style.display = 'none';
                    confirmPasswordInput.parentNode?.appendChild(confirmMsg);

                    const checkPasswords = () => {
                        const original = passwordInput.value;
                        const confirm = confirmPasswordInput.value;
                        if (confirm === '') {
                            confirmMsg.style.display = 'none';
                            return;
                        }
                        confirmMsg.style.display = 'block';
                        confirmMsg.textContent =
                            original === confirm ? 'Senhas iguais' : 'Senhas diferentes';
                        confirmMsg.style.color = original === confirm ? '#5c3' : '#f55';
                    };

                    confirmPasswordInput.addEventListener('input', checkPasswords);
                    if (confirmPasswordInput.value) checkPasswords();
                }

                addPasswordToggle(confirmPasswordInput);
            }

            const emailInput = document.getElementById('reg-email') as HTMLInputElement;
            if (emailInput) {
                if (!emailInput.parentNode?.querySelector('.email-msg')) {
                    const emailMsg = document.createElement('div');
                    emailMsg.className = 'email-msg';
                    emailMsg.style.fontSize = '11px';
                    emailMsg.style.marginTop = '4px';
                    emailMsg.style.display = 'none';
                    emailInput.parentNode?.appendChild(emailMsg);

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
                    if (emailInput.value) validateEmail();
                }
            }

            const loginForm = document.getElementById('login-form') as HTMLFormElement;
            if (loginForm) {
                if (!loginForm.dataset.hasListener) {
                    loginForm.dataset.hasListener = 'true';
                    loginForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const user = (
                            loginForm.querySelector('.username-field') as HTMLInputElement
                        ).value;
                        const pwd = (loginForm.querySelector('.pwd-field') as HTMLInputElement)
                            .value;

                        if (user.length < 3) {
                            alert('Nome de usuário deve ter pelo menos 3 caracteres');
                            return;
                        }

                        if (!user || !pwd) {
                            alert('Preencha todos os campos!');
                            return;
                        }
                        alert('Login válido!');
                    });
                }

                const loginPwd = loginForm.querySelector('.pwd-field') as HTMLInputElement;
                if (loginPwd) addPasswordToggle(loginPwd);
            }

            const registerForm = document.getElementById('register-form') as HTMLFormElement;
            if (registerForm) {
                if (!registerForm.dataset.hasListener) {
                    registerForm.dataset.hasListener = 'true';
                    registerForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const user = (document.getElementById('reg-username') as HTMLInputElement)
                            .value;
                        const email = (document.getElementById('reg-email') as HTMLInputElement)
                            .value;
                        const cpf = (document.getElementById('reg-cpf') as HTMLInputElement).value;
                        const pwd = (document.getElementById('reg-pwd') as HTMLInputElement).value;
                        const confirmPwd = (
                            document.getElementById('reg-pwd-confirm') as HTMLInputElement
                        ).value;
                        const errors: string[] = [];

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
                        if (
                            !(
                                /[a-z]/.test(pwd) &&
                                /[A-Z]/.test(pwd) &&
                                /\d/.test(pwd) &&
                                /[^a-zA-Z0-9]/.test(pwd)
                            )
                        ) {
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
            }

            const userFields = document.querySelectorAll('.username-field');
            userFields.forEach((field) => {
                const inputField = field as HTMLInputElement;
                inputField.maxLength = 20;
                inputField.minLength = 3;

                if (!field.parentNode?.querySelector('.char-counter')) {
                    let statusContainer = document.createElement('div');
                    statusContainer.className = 'status-container';
                    statusContainer.style.display = 'flex';
                    statusContainer.style.justifyContent = 'space-between';
                    statusContainer.style.alignItems = 'center';

                    let counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.style.fontSize = '11px';
                    counter.style.textAlign = 'right';
                    counter.style.color = '#888';
                    statusContainer.appendChild(counter);

                    let lengthMsg = document.createElement('div');
                    lengthMsg.className = 'length-msg';
                    lengthMsg.style.fontSize = '11px';
                    lengthMsg.style.textAlign = 'left';
                    lengthMsg.style.display = 'none';
                    statusContainer.appendChild(lengthMsg);

                    field.parentNode?.appendChild(statusContainer);

                    const updateStatus = () => {
                        counter.textContent = inputField.value.length + '/20';
                        if (inputField.value.length > 0 && inputField.value.length < 3) {
                            lengthMsg.style.display = 'block';
                            lengthMsg.textContent = 'Mínimo de 3 caracteres';
                            lengthMsg.style.color = '#f55';
                            counter.style.color = '#f55';
                        } else if (inputField.value.length >= 3) {
                            lengthMsg.style.display = 'block';
                            lengthMsg.textContent = 'Tamanho válido';
                            lengthMsg.style.color = '#5c3';
                            counter.style.color = '#888';
                        } else {
                            lengthMsg.style.display = 'none';
                            counter.style.color = '#888';
                        }
                    };

                    inputField.addEventListener('input', updateStatus);
                    updateStatus();
                }
            });
        };

        setupValidations();
    }, []);

    return (
        <div className={`container-login ${isActive ? 'active' : ''}`} ref={ref}>
            <div className="form-box login">
                <form id="login-form">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            className="username-field"
                            placeholder="Nome de usuário"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                        <i className="bx bxs-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" className="pwd-field" placeholder="Senha" required />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" className="btn btn-submit">
                        Login
                    </button>
                </form>
            </div>
            <div className="form-box register">
                <form id="register-form">
                    <h1>Cadastro</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            className="username-field"
                            id="reg-username"
                            placeholder="Nome de usuário"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                        <i className="bx bxs-user"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            className="email-field"
                            id="reg-email"
                            placeholder="Email"
                            required
                        />
                        <i className="bx bxs-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="text"
                            className="cpf-field"
                            id="reg-cpf"
                            placeholder="CPF"
                            required
                            pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                            maxLength={14}
                            title="O CPF deve estar no formato XXX.XXX.XXX-XX, onde X é um número."
                        />
                        <i className="bx bx-body"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            className="pwd-field"
                            id="reg-pwd"
                            placeholder="Senha"
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                            title="A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            className="pwd-confirm"
                            id="reg-pwd-confirm"
                            placeholder="Confirme sua senha"
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" className="btn btn-submit">
                        Cadastrar
                    </button>
                </form>
            </div>
            <div className="toggle-box">
                <div className="toggle-painel toggle-left">
                    <h1>Olá, bem-vindo</h1>
                    <p>Não tem uma conta ainda?</p>
                    <button className="btn register-btn" onClick={() => setIsActive(true)}>
                        Cadastrar
                    </button>
                </div>
                <div className="toggle-painel toggle-right">
                    <h1>Bem-vindo de volta</h1>
                    <p>Já tem uma conta?</p>
                    <button className="btn login-btn" onClick={() => setIsActive(false)}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
});

export default LoginForm;
