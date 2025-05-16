import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkinCreateDto } from '../../models/Skin';
import { WeaponDto } from '../../models/Weapon';
import skinApi from '../../utils/skinApi';
import weaponApi from '../../utils/weaponApi';
import { dialogService } from '../Dialog/dialogService';
import './SkinForm.scss';

const SkinForm: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [weapons, setWeapons] = useState<WeaponDto[]>([]);
    const [skinImageFile, setSkinImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<SkinCreateDto>({
        skinName: '',
        weaponId: 0,
        description: '',
        skinImage: undefined,
    });

    useEffect(() => {
        const fetchWeapons = async () => {
            try {
                const response = await weaponApi.getAllWeapons();
                if (response.success && response.data) {
                    setWeapons(response.data);
                    if (response.data.length > 0) {
                        setFormData((prev) => ({
                            ...prev,
                            weaponId: response.data[0].weaponId,
                        }));
                    }
                }
            } catch (error) {
                dialogService.error('Erro ao carregar armas');
            }
        };

        fetchWeapons();
    }, []);

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            try {
                const dataUrl = await fileToBase64(file);
                setSkinImageFile(file);
                setFormData({
                    ...formData,
                    skinImage: dataUrl,
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
                dialogService.error('Erro ao processar a imagem');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'weaponId') {
            setFormData({
                ...formData,
                weaponId: parseInt(value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.skinName.trim()) {
            dialogService.error('O nome da skin é obrigatório');
            return;
        }

        if (!formData.weaponId) {
            dialogService.error('Selecione uma arma');
            return;
        }

        if (!formData.skinImage) {
            dialogService.error('A imagem da skin é obrigatória');
            return;
        }

        setIsLoading(true);

        try {
            const response = await skinApi.createSkin(formData);

            if (response.success) {
                dialogService.success('Skin criada com sucesso!');
                navigate('/admin');
            } else {
                throw new Error(response.message || 'Erro ao criar skin');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao criar skin');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="skin-form-container">
            <h4 className="form-title">Adicionar Nova Skin</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações da Skin</h5>

                        <div className="form-group">
                            <label className="form-label">Nome da Skin *</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="skinName"
                                    value={formData.skinName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Digite o nome da skin"
                                    maxLength={100}
                                />
                            </div>
                            <div className="char-counter">{formData.skinName.length}/100</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Arma *</label>
                            <div className="input-box">
                                <select
                                    className="form-control"
                                    name="weaponId"
                                    value={formData.weaponId || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecione uma arma</option>
                                    {weapons.map((weapon) => (
                                        <option key={weapon.weaponId} value={weapon.weaponId}>
                                            {weapon.weaponName} {weapon.category && `(${weapon.category.categoryName})`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleInputChange}
                                    placeholder="Descrição da skin, como obtê-la, raridade, etc."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagem da Skin *</label>
                            <div className="image-upload-container">
                                {formData.skinImage && (
                                    <div className="image-preview">
                                        <img src={formData.skinImage} alt="Preview" className="preview-image" />
                                    </div>
                                )}
                                <div className="upload-buttons">
                                    <label className="btn btn-outline-primary">
                                        <i className="fas fa-upload mr-2"></i> Escolher Imagem
                                        <input type="file" className="hidden-file-input" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    {skinImageFile && (
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setSkinImageFile(null);
                                                setFormData({
                                                    ...formData,
                                                    skinImage: undefined,
                                                });
                                            }}
                                        >
                                            <i className="fas fa-times mr-2"></i> Remover
                                        </button>
                                    )}
                                </div>
                                <div className="text-light text-small mt-2">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Adicione uma imagem clara da skin, preferencialmente com fundo transparente
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dicas para Adicionar Skins</h5>
                        <ul className="tips-list">
                            <li>Use nomes oficiais para facilitar a busca pelos jogadores</li>
                            <li>Na descrição, inclua informações sobre como obter a skin</li>
                            <li>Mencione se a skin faz parte de uma coleção específica</li>
                            <li>Use imagens de alta qualidade para mostrar os detalhes da skin</li>
                            <li>Certifique-se de selecionar a arma correta à qual a skin pertence</li>
                        </ul>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-default" onClick={handleCancel}>
                        <i className="fas fa-times mr-2"></i> Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
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
                </div>
            </form>
        </div>
    );
};

export default SkinForm;
