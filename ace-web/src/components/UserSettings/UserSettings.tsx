import React, { useState, useEffect, useCallback, useRef } from 'react';
import { dialogService } from '../Dialog/dialogService';
import { userApi } from '../../utils/userApi';
import { IUser, UserDto } from '../../models/User';
import { IAddress, AddressDto } from '../../models/Address';
import './UserSettings.scss';

interface UserSettingsProps {
    userId: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState<string>('account-general');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setupDone = useRef(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        birthDate: '',
        profilePic: null as File | null,
        bannerImg: null as File | null,
        street: '',
        district: '',
        zipCode: '',
        houseNumber: '',
        complement: '',
    });

    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field: string) => {
        setPasswordVisibility((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

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

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await userApi.getUserById(userId);
                if (response.success && response.data) {
                    const user: UserDto = response.data;
                    setFormData((prev) => ({
                        ...prev,
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        nickname: user.nickname || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        birthDate: user.birthDate || '',
                        street: user.address?.street || '',
                        district: user.address?.district || '',
                        zipCode: user.address?.zipCode || '',
                        houseNumber: user.address?.houseNumber || '',
                        complement: user.address?.complement || '',
                    }));
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar informações do usuário');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (setupDone.current) return;
        setupDone.current = true;

        const setupValidations = () => {
            const zipCodeInput = document.getElementById('zipCode') as HTMLInputElement;
            if (zipCodeInput) {
                zipCodeInput.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    let value = target.value.replace(/\D/g, '');
                    if (value.length > 8) {
                        value = value.substring(0, 8);
                    }
                    if (value.length > 5) {
                        value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
                    }
                    target.value = value;
                });
            }

            const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement;
            if (phoneInput) {
                phoneInput.addEventListener('input', (e) => {
                    const target = e.target as HTMLInputElement;
                    let value = target.value.replace(/\D/g, '');
                    if (value.length > 11) {
                        value = value.substring(0, 11);
                    }
                    if (value.length > 7) {
                        value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3');
                    } else if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
                    }
                    target.value = value;
                });
            }

            const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
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
                        passwordInput.parentNode?.appendChild(passwordFeedback);
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

            const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;
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

            const emailInput = document.getElementById('email') as HTMLInputElement;
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

            const textFields = document.querySelectorAll('.text-field');
            textFields.forEach((field) => {
                const inputField = field as HTMLInputElement;
                if (!inputField.maxLength) {
                    inputField.maxLength = 50;
                }

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
                        const maxLength = inputField.maxLength;
                        counter.textContent = inputField.value.length + '/' + maxLength;

                        if (inputField.minLength && inputField.value.length > 0 && inputField.value.length < inputField.minLength) {
                            lengthMsg.style.visibility = 'visible';
                            lengthMsg.textContent = `Mínimo de ${inputField.minLength} caracteres`;
                            lengthMsg.style.color = '#f55';
                            counter.style.color = '#f55';
                        } else if (inputField.value.length > 0) {
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

    const handleTabChange = useCallback((tabId: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        resetFormValidations();
        setActiveTab(tabId);
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePic' | 'bannerImg') => {
        if (event.target.files && event.target.files[0]) {
            setFormData({
                ...formData,
                [fileType]: event.target.files[0],
            });
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleReset = (fileType: 'profilePic' | 'bannerImg') => {
        setFormData({
            ...formData,
            [fileType]: null,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updateData: Partial<IUser> = {};

            if (activeTab === 'account-general') {
                updateData.firstName = formData.firstName;
                updateData.lastName = formData.lastName;
                updateData.phoneNumber = formData.phoneNumber;

                if (formData.street || formData.district || formData.zipCode || formData.houseNumber) {
                    updateData.address = {
                        addressId: null,
                        street: formData.street,
                        district: formData.district,
                        zipCode: formData.zipCode,
                        houseNumber: formData.houseNumber,
                        complement: formData.complement,
                    };
                }

                if (formData.profilePic || formData.bannerImg) {
                    const formDataFiles = new FormData();
                    if (formData.profilePic) {
                        formDataFiles.append('profilePic', formData.profilePic);
                    }
                    if (formData.bannerImg) {
                        formDataFiles.append('bannerImg', formData.bannerImg);
                    }
                }
            } else if (activeTab === 'account-change-password') {
                if (formData.newPassword !== formData.confirmPassword) {
                    dialogService.error('As senhas não coincidem');
                    setIsLoading(false);
                    return;
                }

                if (!formData.password) {
                    dialogService.error('A senha atual é obrigatória');
                    setIsLoading(false);
                    return;
                }

                const password = formData.newPassword;
                const hasLength = password.length >= 8;
                const hasLowercase = /[a-z]/.test(password);
                const hasUppercase = /[A-Z]/.test(password);
                const hasNumber = /\d/.test(password);
                const hasSpecial = /[^a-zA-Z0-9]/.test(password);

                if (!(hasLength && hasLowercase && hasUppercase && hasNumber && hasSpecial)) {
                    dialogService.error('A senha não atende aos critérios de segurança');
                    setIsLoading(false);
                    return;
                }

                updateData.password = formData.newPassword;
            }

            const response = await userApi.updateUser(userId, updateData);

            if (response.success) {
                dialogService.success('Informações atualizadas com sucesso!');
            } else {
                throw new Error(response.message || 'Erro ao atualizar');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao atualizar informações');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        const deleteConfirmation = document.getElementById('delete-confirmation') as HTMLInputElement;

        if (!deleteConfirmation || !deleteConfirmation.checked) {
            dialogService.error('Por favor, confirme que entende as consequências de excluir sua conta');
            return;
        }

        dialogService.confirm('Excluir conta', 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.', async () => {
            setIsLoading(true);
            try {
                const response = await userApi.deleteUser(userId);
                if (response.success) {
                    dialogService.success('Conta excluída com sucesso');
                    window.location.href = '/login';
                } else {
                    throw new Error(response.message || 'Erro ao excluir conta');
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao excluir conta');
            } finally {
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="user-settings-container">
            <h4 className="settings-title">Configurações da conta</h4>
            <div className="card overflow-hidden">
                <div className="row no-gutters row-bordered row-border-light">
                    <div className="col-md-3 pt-0">
                        <div className="list-group list-group-flush account-settings-links">
                            <button
                                type="button"
                                className={`list-group-item list-group-item-action ${activeTab === 'account-general' ? 'active' : ''}`}
                                onClick={(e) => handleTabChange('account-general', e)}
                            >
                                <i className="fas fa-user-circle mr-2"></i> Geral
                            </button>
                            <button
                                type="button"
                                className={`list-group-item list-group-item-action ${activeTab === 'account-change-password' ? 'active' : ''}`}
                                onClick={(e) => handleTabChange('account-change-password', e)}
                            >
                                <i className="fas fa-lock mr-2"></i> Senha
                            </button>
                            <button
                                type="button"
                                className={`list-group-item list-group-item-action ${activeTab === 'account-delete' ? 'active' : ''}`}
                                onClick={(e) => handleTabChange('account-delete', e)}
                            >
                                <i className="fas fa-trash-alt mr-2"></i> Excluir Conta
                            </button>
                        </div>
                    </div>
                    <div className="col-md-9 scrollable-content">
                        <div className="tab-content">
                            <div className={`tab-pane fade ${activeTab === 'account-general' ? 'active show' : ''}`}>
                                <div className="card-body media align-items-center">
                                    <img
                                        src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : 'https://placehold.co/150x150'}
                                        alt="Profile"
                                        className="d-block ui-w-80"
                                    />
                                    <div className="media-body ml-4">
                                        <label className="btn btn-outline-primary">
                                            <i className="fas fa-camera mr-2"></i> Foto de perfil
                                            <input
                                                type="file"
                                                className="account-settings-fileinput"
                                                onChange={(e) => handleFileChange(e, 'profilePic')}
                                                accept="image/*"
                                            />
                                        </label>{' '}
                                        &nbsp;
                                        <button type="button" className="btn btn-default md-btn-flat" onClick={() => handleReset('profilePic')}>
                                            <i className="fas fa-undo mr-2"></i> Resetar
                                        </button>
                                        <div className="text-light small mt-1">Formatos permitidos: JPG, GIF ou PNG. Máximo 800K</div>
                                    </div>
                                </div>

                                <hr className="border-light m-0" />
                                <div className="card-body media align-items-center">
                                    <img
                                        src={formData.bannerImg ? URL.createObjectURL(formData.bannerImg) : 'https://placehold.co/300x200'}
                                        alt="Banner"
                                        className="d-block w-100 ui-banner-preview"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="media-body ml-4 mt-3">
                                        <label className="btn btn-outline-primary">
                                            <i className="fas fa-image mr-2"></i> Foto de banner
                                            <input
                                                type="file"
                                                className="account-settings-fileinput"
                                                onChange={(e) => handleFileChange(e, 'bannerImg')}
                                                accept="image/*"
                                            />
                                        </label>{' '}
                                        &nbsp;
                                        <button type="button" className="btn btn-default md-btn-flat" onClick={() => handleReset('bannerImg')}>
                                            <i className="fas fa-undo mr-2"></i> Resetar
                                        </button>
                                        <div className="text-light small mt-1">
                                            Recomendado: 1200x300px. Formatos permitidos: JPG, GIF ou PNG. Máximo 2MB
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-light m-0" />

                                <div className="card-body">
                                    <div className="form-group">
                                        <label className="form-label">Nome de usuário</label>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                className="form-control text-field"
                                                name="nickname"
                                                id="nickname"
                                                value={formData.nickname}
                                                onChange={handleInputChange}
                                                disabled
                                                maxLength={20}
                                            />
                                            <i className="bx bxs-user"></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nome</label>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                className="form-control text-field"
                                                name="firstName"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                minLength={3}
                                                maxLength={50}
                                            />
                                            <i className="bx bxs-user"></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Sobrenome</label>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                className="form-control text-field"
                                                name="lastName"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                maxLength={50}
                                            />
                                            <i className="bx bxs-user"></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <div className="input-box">
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            <i className="bx bxs-envelope"></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Telefone</label>
                                        <div className="input-box">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                            <i className="bx bx-phone"></i>
                                        </div>
                                    </div>

                                    <h5 className="mt-4 mb-3">Endereço</h5>
                                    <div className="form-group">
                                        <label className="form-label">Rua/Avenida</label>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                className="form-control text-field"
                                                name="street"
                                                id="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                maxLength={100}
                                            />
                                            <i className="bx bx-map"></i>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Bairro</label>
                                                <div className="input-box">
                                                    <input
                                                        type="text"
                                                        className="form-control text-field"
                                                        name="district"
                                                        id="district"
                                                        value={formData.district}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                    <i className="bx bx-building-house"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">CEP</label>
                                                <div className="input-box">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="zipCode"
                                                        id="zipCode"
                                                        value={formData.zipCode}
                                                        onChange={handleInputChange}
                                                        maxLength={9}
                                                    />
                                                    <i className="bx bx-mailbox"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Número</label>
                                                <div className="input-box">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="houseNumber"
                                                        id="houseNumber"
                                                        value={formData.houseNumber}
                                                        onChange={handleInputChange}
                                                        maxLength={10}
                                                    />
                                                    <i className="bx bx-hash"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label">Complemento</label>
                                                <div className="input-box">
                                                    <input
                                                        type="text"
                                                        className="form-control text-field"
                                                        name="complement"
                                                        id="complement"
                                                        value={formData.complement}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                    <i className="bx bx-info-circle"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`tab-pane fade ${activeTab === 'account-change-password' ? 'active show' : ''}`}>
                                <div className="card-body pb-2">
                                    <div className="form-group">
                                        <label className="form-label">Senha atual</label>
                                        <div className="input-box">
                                            <input
                                                type={passwordVisibility.current ? 'text' : 'password'}
                                                className="form-control"
                                                name="password"
                                                id="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <i className="bx bxs-lock-alt"></i>
                                            <i
                                                className={`bx ${passwordVisibility.current ? 'bx-show' : 'bx-hide'} password-toggle`}
                                                onClick={() => togglePasswordVisibility('current')}
                                            ></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Nova senha</label>
                                        <div className="input-box">
                                            <input
                                                type={passwordVisibility.new ? 'text' : 'password'}
                                                className="form-control"
                                                name="newPassword"
                                                id="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                            />
                                            <i className="bx bxs-lock-alt"></i>
                                            <i
                                                className={`bx ${passwordVisibility.new ? 'bx-show' : 'bx-hide'} password-toggle`}
                                                onClick={() => togglePasswordVisibility('new')}
                                            ></i>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirme a nova senha</label>
                                        <div className="input-box">
                                            <input
                                                type={passwordVisibility.confirm ? 'text' : 'password'}
                                                className="form-control"
                                                name="confirmPassword"
                                                id="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                            />
                                            <i className="bx bxs-lock-alt"></i>
                                            <i
                                                className={`bx ${passwordVisibility.confirm ? 'bx-show' : 'bx-hide'} password-toggle`}
                                                onClick={() => togglePasswordVisibility('confirm')}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`tab-pane fade ${activeTab === 'account-delete' ? 'active show' : ''}`}>
                                <div className="card-body pb-2">
                                    <div className="delete-account-warning">
                                        <div className="warning-icon">
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <h6>Atenção: Esta ação é irreversível</h6>
                                        <p>
                                            Ao excluir sua conta, todos os seus dados serão permanentemente removidos do sistema. Esta ação não pode
                                            ser desfeita.
                                        </p>
                                        <div className="confirmation-checkbox">
                                            <input type="checkbox" id="delete-confirmation" />
                                            <label htmlFor="delete-confirmation">
                                                Eu entendo que esta ação excluirá permanentemente minha conta e todos os dados associados
                                            </label>
                                        </div>
                                        <button type="button" className="btn btn-danger" id="excluir-conta" onClick={handleDeleteAccount}>
                                            <i className="fas fa-trash-alt mr-2"></i> Excluir minha conta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-3 mr-3 mb-3">
                    {activeTab !== 'account-delete' && (
                        <>
                            <button type="button" className="btn btn-primary" id="salvar" onClick={handleSave} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i> Salvar
                                    </>
                                )}
                            </button>
                            <button type="button" className="btn btn-default ml-2">
                                <i className="fas fa-times mr-2"></i> Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
