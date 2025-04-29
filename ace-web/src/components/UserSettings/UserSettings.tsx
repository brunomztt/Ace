import React, { useState, useEffect, useCallback, useRef } from 'react';
import { dialogService } from '../Dialog/dialogService';
import { userApi } from '../../utils/userApi';
import { IUser, UserDto, UserUpdateDto } from '../../models/User';
import './UserSettings.scss';
import authApi from '../../utils/authApi';
import { validateCPF, formatCPF } from '../../utils/cpfUtils';

interface UserSettingsProps {
    userId: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ userId }) => {
    const [activeTab, setActiveTab] = useState<string>('account-general');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        cpf: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        birthDate: '',
        profilePic: null as File | null,
        profilePicBase64: null as string | null,
        bannerImg: null as File | null,
        bannerImgBase64: null as string | null,
        street: '',
        district: '',
        zipCode: '',
        houseNumber: '',
        complement: '',
        addressId: null as number | null,
    });

    const [validationState, setValidationState] = useState({
        isEmailValid: true,
        isPasswordMatch: true,
        isCpfValid: false,
        passwordStrength: {
            hasLength: false,
            hasLowercase: false,
            hasUppercase: false,
            hasNumber: false,
            hasSpecial: false,
            score: 0,
            message: 'Digite uma senha',
        },
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

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert file to base64'));
                }
            };
            reader.onerror = (error) => reject(error);
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
                        cpf: formatCPF(user.cpf || ''),
                        birthDate: user.birthDate || '',
                        street: user.address?.street || '',
                        district: user.address?.district || '',
                        zipCode: user.address?.zipCode || '',
                        houseNumber: user.address?.houseNumber || '',
                        complement: user.address?.complement || '',
                        addressId: user.address?.addressId || null,
                        profilePicBase64: user.profilePic || null,
                        bannerImgBase64: user.bannerImg || null,
                    }));

                    if (user.cpf) {
                        setValidationState((prev) => ({
                            ...prev,
                            isCpfValid: validateCPF(user.cpf),
                        }));
                    }
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
        if (formData.email) {
            const isValid = formData.email.indexOf('@') > 0 && formData.email.indexOf('.', formData.email.indexOf('@')) > 0;
            setValidationState((prev) => ({ ...prev, isEmailValid: isValid }));
        }
    }, [formData.email]);

    useEffect(() => {
        if (formData.cpf) {
            const cpfValue = formData.cpf.replace(/\D/g, '');
            const isValid = cpfValue.length === 11 && validateCPF(cpfValue);
            setValidationState((prev) => ({ ...prev, isCpfValid: isValid }));
        } else {
            setValidationState((prev) => ({ ...prev, isCpfValid: false }));
        }
    }, [formData.cpf]);

    useEffect(() => {
        if (formData.confirmPassword) {
            setValidationState((prev) => ({
                ...prev,
                isPasswordMatch: formData.newPassword === formData.confirmPassword,
            }));
        }
    }, [formData.newPassword, formData.confirmPassword]);

    useEffect(() => {
        if (formData.newPassword) {
            const hasLength = formData.newPassword.length >= 8;
            const hasLowercase = /[a-z]/.test(formData.newPassword);
            const hasUppercase = /[A-Z]/.test(formData.newPassword);
            const hasNumber = /\d/.test(formData.newPassword);
            const hasSpecial = /[^a-zA-Z0-9]/.test(formData.newPassword);

            let points = 0;
            if (hasLength) points++;
            if (hasLowercase) points++;
            if (hasUppercase) points++;
            if (hasNumber) points++;
            if (hasSpecial) points++;

            let message;
            if (formData.newPassword === '') {
                message = 'Digite uma senha';
            } else if (points <= 2) {
                message = 'Senha fraca';
            } else if (points <= 4) {
                message = 'Senha média';
            } else {
                message = 'Senha forte';
            }

            setValidationState((prev) => ({
                ...prev,
                passwordStrength: {
                    hasLength,
                    hasLowercase,
                    hasUppercase,
                    hasNumber,
                    hasSpecial,
                    score: points,
                    message,
                },
            }));
        }
    }, [formData.newPassword]);

    const handleTabChange = useCallback((tabId: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setActiveTab(tabId);
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePic' | 'bannerImg') => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            try {
                const dataUrl = await fileToBase64(file);
                setFormData({
                    ...formData,
                    [fileType]: file,
                    [`${fileType}Base64`]: dataUrl,
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
                dialogService.error('Erro ao processar a imagem');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCpfChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        const formattedCpf = formatCPF(value);
        setFormData({
            ...formData,
            cpf: formattedCpf,
        });
    };

    const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 8) {
            value = value.substring(0, 8);
        }
        if (value.length > 5) {
            value = value.replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
        }
        setFormData({
            ...formData,
            zipCode: value,
        });
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        if (value.length > 7) {
            value = value.replace(/^(\d{2})(\d{5})(\d{1,4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{1,5})$/, '($1) $2');
        }
        setFormData({
            ...formData,
            phoneNumber: value,
        });
    };

    const handleReset = (fileType: 'profilePic' | 'bannerImg') => {
        setFormData({
            ...formData,
            [fileType]: null,
            [`${fileType}Base64`]: null,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updateData: Partial<UserUpdateDto> = {};

            if (activeTab === 'account-general') {
                updateData.firstName = formData.firstName;
                updateData.lastName = formData.lastName;
                updateData.phoneNumber = formData.phoneNumber;

                const cpfValue = formData.cpf.replace(/\D/g, '');
                if (cpfValue.length === 11) {
                    if (!validateCPF(cpfValue)) {
                        dialogService.error('CPF inválido');
                        setIsLoading(false);
                        return;
                    }
                    updateData.cpf = cpfValue;
                }

                if (formData.street || formData.district || formData.zipCode || formData.houseNumber || formData.complement) {
                    updateData.address = {
                        addressId: formData.addressId,
                        street: formData.street,
                        district: formData.district,
                        zipCode: formData.zipCode,
                        houseNumber: formData.houseNumber,
                        complement: formData.complement,
                    };
                }

                updateData.profilePic = formData.profilePicBase64 || null;
                updateData.bannerImg = formData.bannerImgBase64 || null;
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
                updateData.currentPassword = formData.password;
            }

            const response = await userApi.updateUser(userId, updateData);

            if (response.success) {
                if (activeTab === 'account-general') {
                    authApi.updateProfileImage(updateData.profilePic ?? null);
                    authApi.updateBannerImage(updateData.bannerImg ?? null);
                    authApi.updateUserData({
                        firstName: updateData.firstName,
                        lastName: updateData.lastName,
                        phoneNumber: updateData.phoneNumber,
                        cpf: updateData.cpf,
                    });
                }

                dialogService.success('Informações atualizadas com sucesso!');
                if (response.data?.address?.addressId) {
                    setFormData((prev) => ({
                        ...prev,
                        addressId: response.data?.address?.addressId ? response.data.address.addressId : null,
                    }));
                }
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
                    authApi.logout();
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

    const getPasswordStrengthColor = () => {
        if (formData.newPassword === '') return '#ddd';
        if (validationState.passwordStrength.score <= 2) return '#f55';
        if (validationState.passwordStrength.score <= 4) return '#fa3';
        return '#5c3';
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
                                        src={
                                            formData.profilePic
                                                ? URL.createObjectURL(formData.profilePic)
                                                : formData.profilePicBase64 || 'https://placehold.co/150x150'
                                        }
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
                                        src={
                                            formData.bannerImg
                                                ? URL.createObjectURL(formData.bannerImg)
                                                : formData.bannerImgBase64 || 'https://placehold.co/300x200'
                                        }
                                        alt="Banner"
                                        className="d-block w-100 ui-banner-preview"
                                        style={{ maxHeight: '200px', maxWidth: '300px', objectFit: 'cover' }}
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
                                        <div
                                            className="status-container"
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                        >
                                            <div
                                                className="length-msg"
                                                style={{ fontSize: '11px', visibility: 'hidden', flexGrow: 1, paddingLeft: '10px' }}
                                            ></div>
                                            <div className="char-counter" style={{ fontSize: '11px', textAlign: 'right', color: '#888' }}>
                                                {formData.nickname.length}/20
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">CPF</label>
                                        <div className="input-box">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="cpf"
                                                id="cpf"
                                                value={formData.cpf}
                                                onChange={handleCpfChange}
                                                maxLength={14}
                                                placeholder="000.000.000-00"
                                            />
                                            <i className="bx bx-id-card"></i>
                                        </div>
                                        <div
                                            className="cpf-msg"
                                            style={{
                                                fontSize: '11px',
                                                marginTop: '4px',
                                                display: formData.cpf ? 'block' : 'none',
                                                color: validationState.isCpfValid ? '#5c3' : '#f55',
                                            }}
                                        >
                                            {formData.cpf.replace(/\D/g, '').length !== 11
                                                ? 'CPF incompleto'
                                                : validationState.isCpfValid
                                                  ? 'CPF válido'
                                                  : 'CPF inválido'}
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
                                        <div
                                            className="status-container"
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                        >
                                            <div
                                                className="length-msg"
                                                style={{
                                                    fontSize: '11px',
                                                    visibility: formData.firstName.length > 0 ? 'visible' : 'hidden',
                                                    color: formData.firstName.length >= 3 ? '#5c3' : '#f55',
                                                    flexGrow: 1,
                                                    paddingLeft: '10px',
                                                }}
                                            >
                                                {formData.firstName.length >= 3 ? 'Tamanho válido' : `Mínimo de 3 caracteres`}
                                            </div>
                                            <div
                                                className="char-counter"
                                                style={{
                                                    fontSize: '11px',
                                                    textAlign: 'right',
                                                    color: formData.firstName.length < 3 && formData.firstName.length > 0 ? '#f55' : '#888',
                                                }}
                                            >
                                                {formData.firstName.length}/50
                                            </div>
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
                                        <div
                                            className="status-container"
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                        >
                                            <div
                                                className="length-msg"
                                                style={{
                                                    fontSize: '11px',
                                                    visibility: formData.lastName.length > 0 ? 'visible' : 'hidden',
                                                    color: '#5c3',
                                                    flexGrow: 1,
                                                    paddingLeft: '10px',
                                                }}
                                            >
                                                Tamanho válido
                                            </div>
                                            <div className="char-counter" style={{ fontSize: '11px', textAlign: 'right', color: '#888' }}>
                                                {formData.lastName.length}/50
                                            </div>
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
                                        {formData.email && (
                                            <div
                                                className="email-msg"
                                                style={{
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    display: 'block',
                                                    color: validationState.isEmailValid ? '#5c3' : '#f55',
                                                }}
                                            >
                                                {validationState.isEmailValid ? 'Email válido' : 'Email inválido'}
                                            </div>
                                        )}
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
                                                onChange={handlePhoneChange}
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
                                        <div
                                            className="status-container"
                                            style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                        >
                                            <div
                                                className="length-msg"
                                                style={{
                                                    fontSize: '11px',
                                                    visibility: formData.street.length > 0 ? 'visible' : 'hidden',
                                                    color: '#5c3',
                                                    flexGrow: 1,
                                                    paddingLeft: '10px',
                                                }}
                                            >
                                                Tamanho válido
                                            </div>
                                            <div className="char-counter" style={{ fontSize: '11px', textAlign: 'right', color: '#888' }}>
                                                {formData.street.length}/100
                                            </div>
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
                                                <div
                                                    className="status-container"
                                                    style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                                >
                                                    <div
                                                        className="length-msg"
                                                        style={{
                                                            fontSize: '11px',
                                                            visibility: formData.district.length > 0 ? 'visible' : 'hidden',
                                                            color: '#5c3',
                                                            flexGrow: 1,
                                                            paddingLeft: '10px',
                                                        }}
                                                    >
                                                        Tamanho válido
                                                    </div>
                                                    <div className="char-counter" style={{ fontSize: '11px', textAlign: 'right', color: '#888' }}>
                                                        {formData.district.length}/50
                                                    </div>
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
                                                        onChange={handleZipCodeChange}
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
                                                <div
                                                    className="status-container"
                                                    style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}
                                                >
                                                    <div
                                                        className="length-msg"
                                                        style={{
                                                            fontSize: '11px',
                                                            visibility: formData.complement.length > 0 ? 'visible' : 'hidden',
                                                            color: '#5c3',
                                                            flexGrow: 1,
                                                            paddingLeft: '10px',
                                                        }}
                                                    >
                                                        Tamanho válido
                                                    </div>
                                                    <div className="char-counter" style={{ fontSize: '11px', textAlign: 'right', color: '#888' }}>
                                                        {formData.complement.length}/50
                                                    </div>
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
                                        <div className="password-feedback" style={{ position: 'relative', zIndex: '10', clear: 'both' }}>
                                            <div className="strength-bar">
                                                <div style={{ height: '3px', background: '#ddd', margin: '5px 0' }}>
                                                    <div
                                                        style={{
                                                            height: '100%',
                                                            width: `${validationState.passwordStrength.score * 20}%`,
                                                            background: getPasswordStrengthColor(),
                                                        }}
                                                    ></div>
                                                </div>
                                                <div style={{ fontSize: '11px', color: getPasswordStrengthColor(), marginBottom: '5px' }}>
                                                    {validationState.passwordStrength.message}
                                                </div>
                                            </div>
                                            <div
                                                className="rules-list"
                                                style={{ fontSize: '11px', marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}
                                            >
                                                <div style={{ flex: '1', minWidth: '45%' }}>
                                                    <div
                                                        className="rule length"
                                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
                                                    >
                                                        <span
                                                            className="rule-status"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginRight: '5px',
                                                                color: validationState.passwordStrength.hasLength ? '#5c3' : '#f55',
                                                            }}
                                                        >
                                                            {validationState.passwordStrength.hasLength ? '✓' : '✕'}
                                                        </span>
                                                        <span className="rule-text">Mínimo de 8 caracteres</span>
                                                    </div>
                                                    <div
                                                        className="rule lowercase"
                                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
                                                    >
                                                        <span
                                                            className="rule-status"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginRight: '5px',
                                                                color: validationState.passwordStrength.hasLowercase ? '#5c3' : '#f55',
                                                            }}
                                                        >
                                                            {validationState.passwordStrength.hasLowercase ? '✓' : '✕'}
                                                        </span>
                                                        <span className="rule-text">Pelo menos 1 letra minúscula</span>
                                                    </div>
                                                    <div
                                                        className="rule uppercase"
                                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
                                                    >
                                                        <span
                                                            className="rule-status"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginRight: '5px',
                                                                color: validationState.passwordStrength.hasUppercase ? '#5c3' : '#f55',
                                                            }}
                                                        >
                                                            {validationState.passwordStrength.hasUppercase ? '✓' : '✕'}
                                                        </span>
                                                        <span className="rule-text">Pelo menos 1 letra maiúscula</span>
                                                    </div>
                                                </div>
                                                <div style={{ flex: '1', minWidth: '45%' }}>
                                                    <div
                                                        className="rule number"
                                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
                                                    >
                                                        <span
                                                            className="rule-status"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginRight: '5px',
                                                                color: validationState.passwordStrength.hasNumber ? '#5c3' : '#f55',
                                                            }}
                                                        >
                                                            {validationState.passwordStrength.hasNumber ? '✓' : '✕'}
                                                        </span>
                                                        <span className="rule-text">Pelo menos 1 número</span>
                                                    </div>
                                                    <div
                                                        className="rule special"
                                                        style={{ display: 'flex', alignItems: 'center', marginBottom: '3px' }}
                                                    >
                                                        <span
                                                            className="rule-status"
                                                            style={{
                                                                fontWeight: 'bold',
                                                                marginRight: '5px',
                                                                color: validationState.passwordStrength.hasSpecial ? '#5c3' : '#f55',
                                                            }}
                                                        >
                                                            {validationState.passwordStrength.hasSpecial ? '✓' : '✕'}
                                                        </span>
                                                        <span className="rule-text">Pelo menos 1 caractere especial</span>
                                                    </div>
                                                </div>
                                            </div>
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
                                        {formData.confirmPassword && (
                                            <div
                                                className="confirm-msg"
                                                style={{
                                                    fontSize: '11px',
                                                    marginTop: '4px',
                                                    display: 'block',
                                                    color: validationState.isPasswordMatch ? '#5c3' : '#f55',
                                                }}
                                            >
                                                {validationState.isPasswordMatch ? 'Senhas iguais' : 'Senhas diferentes'}
                                            </div>
                                        )}
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
