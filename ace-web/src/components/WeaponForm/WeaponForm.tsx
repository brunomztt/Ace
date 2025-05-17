import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeaponCreateDto, WeaponCategoryDto } from '../../models/Weapon';
import weaponApi from '../../utils/weaponApi';
import { dialogService } from '../Dialog/dialogService';
import './WeaponForm.scss';

interface WeaponFormProps {
    weaponId?: string;
}

const WeaponForm: React.FC<WeaponFormProps> = ({ weaponId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [categories, setCategories] = useState<WeaponCategoryDto[]>([]);
    const [weaponImageFile, setWeaponImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<WeaponCreateDto>({
        weaponName: '',
        categoryId: 0,
        credits: 0,
        wallPenetration: 'Low',
        weaponImage: '',
        weaponDescription: '',
        fireMode: '',
        fireRate: 0,
        runSpeed: 0,
        equipSpeed: 0,
        reloadSpeed: 0,
        magazineSize: 0,
        reserveAmmo: 0,
        firstShotSpread: 0,
        damageHeadClose: 0,
        damageBodyClose: 0,
        damageLegClose: 0,
        damageHeadFar: 0,
        damageBodyFar: 0,
        damageLegFar: 0,
    });

    useEffect(() => {
        loadCategories();
        if (weaponId) {
            setIsEditMode(true);
            loadWeaponData(weaponId);
        }
    }, [weaponId]);

    const loadCategories = async () => {
        try {
            const response = await weaponApi.getAllWeaponCategories();
            if (response.success && response.data) {
                setCategories(response.data);
                if (response.data.length > 0 && !isEditMode) {
                    setFormData((prev) => ({
                        ...prev,
                        categoryId: response.data[0].categoryId,
                    }));
                }
            } else {
                dialogService.error('Erro ao carregar categorias de armas');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar categorias de armas');
        }
    };

    const loadWeaponData = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await weaponApi.getWeaponById(id);
            if (response.success && response.data) {
                const weapon = response.data;
                setFormData({
                    weaponName: weapon.weaponName,
                    categoryId: weapon.categoryId,
                    credits: weapon.credits,
                    wallPenetration: weapon.wallPenetration,
                    weaponImage: weapon.weaponImage || '',
                    weaponDescription: weapon.weaponDescription || '',
                    fireMode: weapon.fireMode || '',
                    fireRate: weapon.fireRate || 0,
                    runSpeed: weapon.runSpeed || 0,
                    equipSpeed: weapon.equipSpeed || 0,
                    reloadSpeed: weapon.reloadSpeed || 0,
                    magazineSize: weapon.magazineSize || 0,
                    reserveAmmo: weapon.reserveAmmo || 0,
                    firstShotSpread: weapon.firstShotSpread || 0,
                    damageHeadClose: weapon.damageHeadClose || 0,
                    damageBodyClose: weapon.damageBodyClose || 0,
                    damageLegClose: weapon.damageLegClose || 0,
                    damageHeadFar: weapon.damageHeadFar || 0,
                    damageBodyFar: weapon.damageBodyFar || 0,
                    damageLegFar: weapon.damageLegFar || 0,
                });
            } else {
                dialogService.error('Erro ao carregar dados da arma');
                navigate(-1);
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar dados da arma');
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
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

        if (
            [
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
            ].includes(name)
        ) {
            setFormData({
                ...formData,
                [name]: value === '' ? 0 : Number(value),
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

        if (!formData.weaponName.trim()) {
            dialogService.error('O nome da arma é obrigatório');
            return;
        }

        if (!formData.categoryId) {
            dialogService.error('Selecione uma categoria');
            return;
        }

        setIsLoading(true);

        try {
            let response;
            if (isEditMode && weaponId) {
                response = await weaponApi.updateWeapon(weaponId, formData);
                if (response.success) {
                    dialogService.success('Arma atualizada com sucesso!');
                }
            } else {
                response = await weaponApi.createWeapon(formData);
                if (response.success) {
                    dialogService.success('Arma criada com sucesso!');
                }
            }

            if (response && response.success) {
                navigate(-1);
            } else {
                throw new Error((response && response.message) || 'Erro ao processar arma');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao processar arma');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="weapon-form-container">
            <h4 className="form-title">{isEditMode ? 'Editar Arma' : 'Adicionar Nova Arma'}</h4>

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
                                    placeholder="Digite o nome da arma"
                                    maxLength={50}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Categoria *</label>
                            <div className="input-box">
                                <select className="form-control" name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
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
                            <label className="form-label">Créditos *</label>
                            <div className="input-box">
                                <input
                                    type="number"
                                    className="form-control"
                                    name="credits"
                                    value={formData.credits}
                                    onChange={handleInputChange}
                                    required
                                    min="0"
                                    placeholder="Custo em créditos"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Penetração *</label>
                            <div className="input-box">
                                <select
                                    className="form-control"
                                    name="wallPenetration"
                                    value={formData.wallPenetration}
                                    onChange={handleInputChange}
                                    required
                                >
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
                                    value={formData.weaponDescription}
                                    onChange={handleInputChange}
                                    placeholder="Descrição da arma"
                                    rows={3}
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
                                    {(weaponImageFile || formData.weaponImage) && (
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setWeaponImageFile(null);
                                                setFormData({
                                                    ...formData,
                                                    weaponImage: '',
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
                        <h5>Estatísticas da Arma</h5>

                        <div className="form-group">
                            <label className="form-label">Modo de Tiro</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="fireMode"
                                    value={formData.fireMode}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Automático, Semi-Automático, etc."
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Taxa de Disparo</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="fireRate"
                                        value={formData.fireRate}
                                        onChange={handleInputChange}
                                        placeholder="Disparos por segundo"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Velocidade de Corrida</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="runSpeed"
                                        value={formData.runSpeed}
                                        onChange={handleInputChange}
                                        placeholder="Velocidade relativa"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Velocidade de Equipar</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="equipSpeed"
                                        value={formData.equipSpeed}
                                        onChange={handleInputChange}
                                        placeholder="Segundos"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Velocidade de Recarga</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="reloadSpeed"
                                        value={formData.reloadSpeed}
                                        onChange={handleInputChange}
                                        placeholder="Segundos"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Tamanho do Carregador</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="magazineSize"
                                        value={formData.magazineSize}
                                        onChange={handleInputChange}
                                        placeholder="Balas por carregador"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Munição Reserva</label>
                                <div className="input-box">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="reserveAmmo"
                                        value={formData.reserveAmmo}
                                        onChange={handleInputChange}
                                        placeholder="Balas totais"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Dispersão do Primeiro Tiro</label>
                            <div className="input-box">
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="firstShotSpread"
                                    value={formData.firstShotSpread}
                                    onChange={handleInputChange}
                                    placeholder="Graus"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dano</h5>

                        <div className="stats-section">
                            <h6>Dano Próximo</h6>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Cabeça</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageHeadClose"
                                            value={formData.damageHeadClose}
                                            onChange={handleInputChange}
                                            placeholder="Dano na cabeça (perto)"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Corpo</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageBodyClose"
                                            value={formData.damageBodyClose}
                                            onChange={handleInputChange}
                                            placeholder="Dano no corpo (perto)"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Pernas</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageLegClose"
                                            value={formData.damageLegClose}
                                            onChange={handleInputChange}
                                            placeholder="Dano nas pernas (perto)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stats-section">
                            <h6>Dano Distante</h6>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Cabeça</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageHeadFar"
                                            value={formData.damageHeadFar}
                                            onChange={handleInputChange}
                                            placeholder="Dano na cabeça (longe)"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Corpo</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageBodyFar"
                                            value={formData.damageBodyFar}
                                            onChange={handleInputChange}
                                            placeholder="Dano no corpo (longe)"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Pernas</label>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="damageLegFar"
                                            value={formData.damageLegFar}
                                            onChange={handleInputChange}
                                            placeholder="Dano nas pernas (longe)"
                                        />
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
                                <i className="fas fa-save mr-2"></i> {isEditMode ? 'Atualizar' : 'Salvar'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WeaponForm;
