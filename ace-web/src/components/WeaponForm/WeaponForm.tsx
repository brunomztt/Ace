import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeaponCreateDto, WeaponCategoryDto } from '../../models/Weapon';
import weaponApi from '../../utils/weaponApi';
import { dialogService } from '../Dialog/dialogService';
import './WeaponForm.scss';

const WeaponForm: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<WeaponCategoryDto[]>([]);
    const [weaponImageFile, setWeaponImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<WeaponCreateDto>({
        weaponName: '',
        categoryId: 0,
        credits: 0,
        wallPenetration: 'Low',
        weaponDescription: '',
        fireMode: '',
        fireRate: undefined,
        runSpeed: undefined,
        equipSpeed: undefined,
        reloadSpeed: undefined,
        magazineSize: undefined,
        reserveAmmo: undefined,
        firstShotSpread: undefined,
        damageHeadClose: undefined,
        damageBodyClose: undefined,
        damageLegClose: undefined,
        damageHeadFar: undefined,
        damageBodyFar: undefined,
        damageLegFar: undefined,
        weaponImage: undefined,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await weaponApi.getAllWeaponCategories();
                if (response.success && response.data) {
                    setCategories(response.data);
                    if (response.data.length > 0) {
                        setFormData((prev) => ({
                            ...prev,
                            categoryId: response.data[0].categoryId,
                        }));
                    }
                }
            } catch (error) {
                dialogService.error('Erro ao carregar categorias de armas');
            }
        };

        fetchCategories();
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
                setWeaponImageFile(file);
                setFormData({
                    ...formData,
                    weaponImage: dataUrl,
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
                dialogService.error('Erro ao processar a imagem');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        // Handle numeric fields separately
        const numericFields = [
            'credits',
            'fireRate',
            'runSpeed',
            'equipSpeed',
            'reloadSpeed',
            'magazineSize',
            'reserveAmmo',
            'firstShotSpread',
            'damageHeadClose',
            'damageBodyClose',
            'damageLegClose',
            'damageHeadFar',
            'damageBodyFar',
            'damageLegFar',
            'categoryId',
        ];

        if (numericFields.includes(name)) {
            if (value === '') {
                // Handle empty string for numeric fields by setting to undefined
                setFormData({
                    ...formData,
                    [name]: undefined,
                });
            } else {
                const numValue = name === 'categoryId' ? parseInt(value) : parseFloat(value);
                setFormData({
                    ...formData,
                    [name]: numValue,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.weaponName) {
            dialogService.error('O nome da arma é obrigatório');
            return;
        }

        if (!formData.categoryId) {
            dialogService.error('Selecione uma categoria');
            return;
        }

        setIsLoading(true);

        try {
            const response = await weaponApi.createWeapon(formData);

            if (response.success) {
                dialogService.success('Arma criada com sucesso!');
                navigate('/admin');
            } else {
                throw new Error(response.message || 'Erro ao criar arma');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao criar arma');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="weapon-form-container">
            <h4 className="form-title">Adicionar Nova Arma</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações Básicas</h5>

                        <div className="form-group">
                            <label className="form-label">Nome da Arma *</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="weaponName"
                                    value={formData.weaponName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Categoria *</label>
                            <div className="input-box">
                                <select
                                    className="form-control"
                                    name="categoryId"
                                    value={formData.categoryId || ''}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Créditos</label>
                            <div className="input-box">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="credits"
                                    value={formData.credits === undefined ? '' : formData.credits}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Penetração de Parede</label>
                            <div className="input-box">
                                <select className="form-control" name="wallPenetration" value={formData.wallPenetration} onChange={handleInputChange}>
                                    <option value="Low">Baixa</option>
                                    <option value="Medium">Média</option>
                                    <option value="High">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="weaponDescription"
                                    value={formData.weaponDescription || ''}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagem da Arma</label>
                            <div className="image-upload-container">
                                {formData.weaponImage && (
                                    <div className="image-preview">
                                        <img src={formData.weaponImage} alt="Preview" className="preview-image" />
                                    </div>
                                )}
                                <div className="upload-buttons">
                                    <label className="btn btn-outline-primary">
                                        <i className="fas fa-upload mr-2"></i> Escolher Imagem
                                        <input type="file" className="hidden-file-input" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    {weaponImageFile && (
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setWeaponImageFile(null);
                                                setFormData({
                                                    ...formData,
                                                    weaponImage: undefined,
                                                });
                                            }}
                                        >
                                            <i className="fas fa-times mr-2"></i> Remover
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Propriedades de Disparo</h5>

                        <div className="form-group">
                            <label className="form-label">Modo de Disparo</label>
                            <div className="input-box">
                                <select className="form-control" name="fireMode" value={formData.fireMode || ''} onChange={handleInputChange}>
                                    <option value="">Selecione o modo</option>
                                    <option value="Auto">Automático</option>
                                    <option value="Semi">Semi-automático</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Taxa de Disparo (tiros/seg)</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="fireRate"
                                            value={formData.fireRate === undefined ? '' : formData.fireRate}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Precisão Primeiro Tiro</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="firstShotSpread"
                                            value={formData.firstShotSpread === undefined ? '' : formData.firstShotSpread}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Tamanho do Carregador</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="magazineSize"
                                            value={formData.magazineSize === undefined ? '' : formData.magazineSize}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Munição Reserva</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="reserveAmmo"
                                            value={formData.reserveAmmo === undefined ? '' : formData.reserveAmmo}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="form-label">Tempo de Recarga (seg)</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="reloadSpeed"
                                            value={formData.reloadSpeed === undefined ? '' : formData.reloadSpeed}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Propriedades de Movimento</h5>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Velocidade de Corrida (m/s)</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="runSpeed"
                                            value={formData.runSpeed === undefined ? '' : formData.runSpeed}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Velocidade de Equipar (seg)</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="equipSpeed"
                                            value={formData.equipSpeed === undefined ? '' : formData.equipSpeed}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dano</h5>

                        <div className="form-subsection">
                            <h6>Dano à Curta Distância (0-30m)</h6>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Cabeça</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageHeadClose"
                                                value={formData.damageHeadClose === undefined ? '' : formData.damageHeadClose}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Corpo</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageBodyClose"
                                                value={formData.damageBodyClose === undefined ? '' : formData.damageBodyClose}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Pernas</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageLegClose"
                                                value={formData.damageLegClose === undefined ? '' : formData.damageLegClose}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-subsection">
                            <h6>Dano à Longa Distância (30-50m)</h6>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Cabeça</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageHeadFar"
                                                value={formData.damageHeadFar === undefined ? '' : formData.damageHeadFar}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Corpo</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageBodyFar"
                                                value={formData.damageBodyFar === undefined ? '' : formData.damageBodyFar}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Pernas</label>
                                        <div className="input-box">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="damageLegFar"
                                                value={formData.damageLegFar === undefined ? '' : formData.damageLegFar}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default WeaponForm;
