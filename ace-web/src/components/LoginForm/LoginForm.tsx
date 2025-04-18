import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { dialogService } from '../Dialog/dialogService';
import './LoginForm.scss';
import authApi, { UserLoginDto, UserRegistrationDto } from '../../utils/authApi';

const LoginForm = forwardRef<HTMLDivElement>((props, ref) => {
    const [isActive, setIsActive] = useState(false);
    const setupDone = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    const [passwordVisibility, setPasswordVisibility] = useState({
        login: false,
        register: false,
        confirm: false,
    });

    const resetFormValidations = () => {
        const lengthMsgs = document.querySelectorAll('.length-msg');
        lengthMsgs.forEach((msg) => {
            (msg as HTMLElement).style.visibility = 'hidden';
        });

        const charCounters = document.querySelectorAll('.char-counter');
        charCounters.forEach((counter) => {
            (counter as HTMLElement).style.color = '#888';
            counter.textContent = '0/20';
        });

        const validationMsgs = document.querySelectorAll('.email-msg, .confirm-msg');
        validationMsgs.forEach((msg) => {
            (msg as HTMLElement).style.display = 'none';
        });

        const strengthBars = document.querySelectorAll('.strength-bar div > div');
        strengthBars.forEach((bar) => {
            (bar as HTMLElement).style.width = '0';
            (bar as HTMLElement).style.background = '#ddd';
        });

        const strengthTexts = document.querySelectorAll('.strength-bar div + div');
        strengthTexts.forEach((text) => {
            (text as HTMLElement).textContent = 'Digite uma senha';
            (text as HTMLElement).style.color = '#888';
        });

        const ruleStatuses = document.querySelectorAll('.rule-status');
        ruleStatuses.forEach((status) => {
            status.textContent = '✕';
            (status as HTMLElement).style.color = '#f55';
        });
    };

    const togglePasswordVisibility = (field: string) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
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
                if (!passwordInput.parentNode?.querySelector('.password-feedback')) {
                    const inputBox = passwordInput.closest('.input-box');

                    let passwordFeedback = document.createElement('div');
                    passwordFeedback.className = 'password-feedback';
                    passwordFeedback.style.position = 'relative';
                    passwordFeedback.style.zIndex = '10';
                    passwordFeedback.style.clear = 'both';

                    let strengthBar = document.createElement('div');
                    strengthBar.className = 'strength-bar';
                    strengthBar.innerHTML = `
                        <div style="height:3px; background:#ddd; margin:5px 0">
                        <div style="height:100%; width:0; background:#f00"></div>
                        </div>
                        <div style="font-size:11px; color:#888; margin-bottom:5px">Digite uma senha</div>
                    `;
                    passwordFeedback.appendChild(strengthBar);

                    let rulesList = document.createElement('div');
                    rulesList.className = 'rules-list';
                    rulesList.style.fontSize = '11px';
                    rulesList.style.marginTop = '5px';
                    rulesList.style.display = 'flex';
                    rulesList.style.flexWrap = 'wrap';
                    rulesList.style.gap = '5px';

                    const rules = [
                        { id: 'length', text: 'Mínimo de 8 caracteres' },
                        { id: 'lowercase', text: 'Pelo menos 1 letra minúscula' },
                        { id: 'uppercase', text: 'Pelo menos 1 letra maiúscula' },
                        { id: 'number', text: 'Pelo menos 1 número' },
                        { id: 'special', text: 'Pelo menos 1 caractere especial' },
                    ];

                    const leftColumn = document.createElement('div');
                    leftColumn.style.flex = '1';
                    leftColumn.style.minWidth = '45%';

                    const rightColumn = document.createElement('div');
                    rightColumn.style.flex = '1';
                    rightColumn.style.minWidth = '45%';

                    rules.forEach((rule, index) => {
                        const ruleElement = document.createElement('div');
                        ruleElement.className = `rule ${rule.id}`;
                        ruleElement.style.display = 'flex';
                        ruleElement.style.alignItems = 'center';
                        ruleElement.style.marginBottom = '3px';
                        ruleElement.innerHTML = `
                            <span class="rule-status" style="font-weight:bold; margin-right:5px; color:#f55;">✕</span>
                            <span class="rule-text">${rule.text}</span>
                        `;

                        if (index < 3) {
                            leftColumn.appendChild(ruleElement);
                        } else {
                            rightColumn.appendChild(ruleElement);
                        }
                    });

                    rulesList.appendChild(leftColumn);
                    rulesList.appendChild(rightColumn);
                    passwordFeedback.appendChild(rulesList);

                    if (inputBox && inputBox.nextSibling) {
                        inputBox.parentNode?.insertBefore(passwordFeedback, inputBox.nextSibling);
                    } else {
                        passwordInput.parentNode?.parentNode?.appendChild(passwordFeedback);
                    }

                    const evaluatePassword = () => {
                        const password = passwordInput.value;
                        const bar = strengthBar.querySelector('div > div') as HTMLDivElement;
                        const text = strengthBar.querySelector('div + div') as HTMLDivElement;

                        const hasLength = password.length >= 8;
                        const hasLowercase = /[a-z]/.test(password);
                        const hasUppercase = /[A-Z]/.test(password);
                        const hasNumber = /\d/.test(password);
                        const hasSpecial = /[^a-zA-Z0-9]/.test(password);

                        const updateRule = (ruleId: string, passed: boolean) => {
                            const ruleElement = rulesList.querySelector(`.rule.${ruleId} .rule-status`);
                            if (ruleElement) {
                                ruleElement.textContent = passed ? '✓' : '✕';
                                (ruleElement as HTMLElement).style.color = passed ? '#5c3' : '#f55';
                            }
                        };

                        updateRule('length', hasLength);
                        updateRule('lowercase', hasLowercase);
                        updateRule('uppercase', hasUppercase);
                        updateRule('number', hasNumber);
                        updateRule('special', hasSpecial);

                        rulesList.style.display = 'flex';

                        let points = 0;
                        if (hasLength) points++;
                        if (hasLowercase) points++;
                        if (hasUppercase) points++;
                        if (hasNumber) points++;
                        if (hasSpecial) points++;

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
            }

            const confirmPasswordInput = document.getElementById('reg-pwd-confirm') as HTMLInputElement;
            if (confirmPasswordInput && passwordInput) {
                if (!confirmPasswordInput.parentNode?.querySelector('.confirm-msg')) {
                    const confirmMsg = document.createElement('div');
                    confirmMsg.className = 'confirm-msg';
                    confirmMsg.style.fontSize = '11px';
                    confirmMsg.style.marginTop = '4px';
                    confirmMsg.style.display = 'none';

                    const inputBox = confirmPasswordInput.closest('.input-box');
                    if (inputBox && inputBox.nextSibling) {
                        inputBox.parentNode?.insertBefore(confirmMsg, inputBox.nextSibling);
                    } else {
                        confirmPasswordInput.parentNode?.appendChild(confirmMsg);
                    }

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
                    if (confirmPasswordInput.value) checkPasswords();
                }
            }

            const emailInput = document.getElementById('reg-email') as HTMLInputElement;
            if (emailInput) {
                if (!emailInput.parentNode?.querySelector('.email-msg')) {
                    const emailMsg = document.createElement('div');
                    emailMsg.className = 'email-msg';
                    emailMsg.style.fontSize = '11px';
                    emailMsg.style.marginTop = '4px';
                    emailMsg.style.display = 'none';

                    const inputBox = emailInput.closest('.input-box');
                    if (inputBox && inputBox.nextSibling) {
                        inputBox.parentNode?.insertBefore(emailMsg, inputBox.nextSibling);
                    } else {
                        emailInput.parentNode?.appendChild(emailMsg);
                    }

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
                    loginForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const userField = loginForm.querySelector('.username-field') as HTMLInputElement;
                        const pwdField = loginForm.querySelector('.pwd-field') as HTMLInputElement;
                        const user = userField.value;
                        const pwd = pwdField.value;

                        if (user.length < 3) {
                            dialogService.error('Nome de usuário deve ter pelo menos 3 caracteres');
                            return;
                        }

                        if (!user || !pwd) {
                            dialogService.error('Preencha todos os campos!');
                            return;
                        }

                        setIsLoading(true);
                        try {
                            const loginData: UserLoginDto = {
                                nickname: user,
                                password: pwd,
                            };

                            const response = await authApi.login(loginData);

                            if (response.success) {
                                dialogService.success('Login realizado com sucesso!');
                            } else {
                                dialogService.error(response.message);
                            }
                        } catch (error: any) {
                            dialogService.error(error.message || 'Erro ao realizar login');
                        } finally {
                            setIsLoading(false);
                        }
                    });
                }
            }

            const registerForm = document.getElementById('register-form') as HTMLFormElement;
            if (registerForm) {
                if (!registerForm.dataset.hasListener) {
                    registerForm.dataset.hasListener = 'true';
                    registerForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const user = (document.getElementById('reg-username') as HTMLInputElement).value;
                        const email = (document.getElementById('reg-email') as HTMLInputElement).value;
                        const cpf = (document.getElementById('reg-cpf') as HTMLInputElement).value;
                        const pwd = (document.getElementById('reg-pwd') as HTMLInputElement).value;
                        const confirmPwd = (document.getElementById('reg-pwd-confirm') as HTMLInputElement).value;
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
                        if (!(/[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd))) {
                            errors.push('Senha deve ser forte');
                        }
                        if (pwd !== confirmPwd) {
                            errors.push('As senhas não coincidem');
                        }
                        if (errors.length > 0) {
                            dialogService.error(errors.join('\n'));
                            return;
                        }

                        setIsLoading(true);
                        try {
                            const registrationData: UserRegistrationDto = {
                                fullName: user,
                                nickname: user,
                                cpf: cpf.replace(/\D/g, ''),
                                email: email,
                                password: pwd,
                            };

                            const response = await authApi.register(registrationData);

                            if (response.success) {
                                dialogService.success('Cadastro realizado com sucesso! Você já pode fazer login.');
                                registerForm.reset();
                                setIsActive(false);
                            } else {
                                dialogService.error(response.message);
                            }
                        } catch (error: any) {
                            const errorMessage = error.message || 'Erro ao realizar cadastro';
                            dialogService.error(errorMessage);
                        } finally {
                            setIsLoading(false);
                        }
                    });
                }
            }

            const userFields = document.querySelectorAll('.username-field');
            userFields.forEach((field) => {
                const inputField = field as HTMLInputElement;
                inputField.maxLength = 20;
                inputField.minLength = 3;

                if (!field.parentNode?.querySelector('.status-container')) {
                    let statusContainer = document.createElement('div');
                    statusContainer.className = 'status-container';
                    statusContainer.style.display = 'flex';
                    statusContainer.style.justifyContent = 'space-between';
                    statusContainer.style.alignItems = 'center';
                    statusContainer.style.padding = '0 10px';
                    statusContainer.style.width = '100%';

                    let counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.style.fontSize = '11px';
                    counter.style.textAlign = 'right';
                    counter.style.color = '#888';
                    counter.style.position = 'relative';
                    statusContainer.appendChild(counter);

                    let lengthMsg = document.createElement('div');
                    lengthMsg.className = 'length-msg';
                    lengthMsg.style.fontSize = '11px';
                    lengthMsg.style.textAlign = 'left';
                    lengthMsg.style.visibility = 'hidden';
                    lengthMsg.style.flexGrow = '1';
                    lengthMsg.style.paddingLeft = '10px';
                    statusContainer.style.position = 'relative';
                    statusContainer.appendChild(lengthMsg);

                    const inputBox = field.closest('.input-box');
                    if (inputBox && inputBox.nextSibling) {
                        inputBox.parentNode?.insertBefore(statusContainer, inputBox.nextSibling);
                    } else {
                        field.parentNode?.appendChild(statusContainer);
                    }

                    const updateStatus = () => {
                        counter.textContent = inputField.value.length + '/20';
                        if (inputField.value.length > 0 && inputField.value.length < 3) {
                            lengthMsg.style.visibility = 'visible';
                            lengthMsg.textContent = 'Mínimo de 3 caracteres';
                            lengthMsg.style.color = '#f55';
                            counter.style.color = '#f55';
                        } else if (inputField.value.length >= 3) {
                            lengthMsg.style.visibility = 'visible';
                            lengthMsg.textContent = 'Tamanho válido';
                            lengthMsg.style.color = '#5c3';
                            counter.style.color = '#888';
                        } else {
                            lengthMsg.style.visibility = 'hidden';
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

    const handleToggle = (active: boolean) => {
        resetFormValidations();

        const allInputs = document.querySelectorAll('input');
        allInputs.forEach((input) => {
            input.value = '';
        });

        setPasswordVisibility({
            login: false,
            register: false,
            confirm: false,
        });

        setIsActive(active);
    };

    return (
        <div className={`container-login ${isActive ? 'active' : ''}`} ref={ref}>
            <div className="form-box login">
                <form id="login-form">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" className="username-field" placeholder="Nome de usuário" required minLength={3} maxLength={20} />
                        <i className="bx bxs-user"></i>
                    </div>
                    <div className="input-box">
                        <input type={passwordVisibility.login ? 'text' : 'password'} className="pwd-field" placeholder="Senha" required />
                        <i className="bx bxs-lock-alt"></i>
                        <i
                            className={`bx ${passwordVisibility.login ? 'bx-show' : 'bx-hide'}`}
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#888',
                                fontSize: '20px',
                                zIndex: '20',
                            }}
                            onClick={() => togglePasswordVisibility('login')}
                        ></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" className="btn btn-submit" disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Login'}
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
                        <input type="email" className="email-field" id="reg-email" placeholder="Email" required />
                        <i className="bx bxs-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input type="text" className="cpf-field" id="reg-cpf" placeholder="CPF" required maxLength={14} />
                        <i className="bx bx-body"></i>
                    </div>
                    <div className="input-box">
                        <input
                            type={passwordVisibility.register ? 'text' : 'password'}
                            className="pwd-field"
                            id="reg-pwd"
                            placeholder="Senha"
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                        <i
                            className={`bx ${passwordVisibility.register ? 'bx-show' : 'bx-hide'}`}
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#888',
                                fontSize: '20px',
                                zIndex: '20',
                            }}
                            onClick={() => togglePasswordVisibility('register')}
                        ></i>
                    </div>
                    <div className="input-box">
                        <input
                            type={passwordVisibility.confirm ? 'text' : 'password'}
                            className="pwd-confirm"
                            id="reg-pwd-confirm"
                            placeholder="Confirme sua senha"
                            required
                        />
                        <i className="bx bxs-lock-alt"></i>
                        <i
                            className={`bx ${passwordVisibility.confirm ? 'bx-show' : 'bx-hide'}`}
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#888',
                                fontSize: '20px',
                                zIndex: '20',
                            }}
                            onClick={() => togglePasswordVisibility('confirm')}
                        ></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" className="btn btn-submit" disabled={isLoading}>
                        {isLoading ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
            <div className="toggle-box">
                <div className="toggle-painel toggle-left">
                    <h1>Olá, bem-vindo</h1>
                    <p>Não tem uma conta ainda?</p>
                    <button className="btn register-btn" onClick={() => handleToggle(true)}>
                        Cadastrar
                    </button>
                </div>
                <div className="toggle-painel toggle-right">
                    <h1>Bem-vindo de volta</h1>
                    <p>Já tem uma conta?</p>
                    <button className="btn login-btn" onClick={() => handleToggle(false)}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
});

export default LoginForm;
