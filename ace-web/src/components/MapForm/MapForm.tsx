import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapCreateDto } from '../../models/Map';
import mapApi from '../../utils/mapApi';
import { dialogService } from '../Dialog/dialogService';
import './MapForm.scss';

const MapForm: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<MapCreateDto>({
        mapName: '',
        mapDescription: '',
        mapImage: undefined,
    });

    const [mapImageFile, setMapImageFile] = useState<File | null>(null);

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
                setMapImageFile(file);
                setFormData({
                    ...formData,
                    mapImage: dataUrl,
                });
            } catch (error) {
                console.error('Error converting file to base64:', error);
                dialogService.error('Erro ao processar a imagem');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.mapName.trim()) {
            dialogService.error('O nome do mapa é obrigatório');
            return;
        }

        setIsLoading(true);

        try {
            const response = await mapApi.createMap(formData);

            if (response.success) {
                dialogService.success('Mapa criado com sucesso!');
                navigate('/admin');
            } else {
                throw new Error(response.message || 'Erro ao criar mapa');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao criar mapa');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="map-form-container">
            <h4 className="form-title">Adicionar Novo Mapa</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações do Mapa</h5>

                        <div className="form-group">
                            <label className="form-label">Nome do Mapa *</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="mapName"
                                    value={formData.mapName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Digite o nome do mapa"
                                    maxLength={50}
                                />
                            </div>
                            <div className="char-counter">{formData.mapName.length}/50</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="mapDescription"
                                    value={formData.mapDescription}
                                    onChange={handleInputChange}
                                    placeholder="Descrição do mapa, características principais, etc."
                                    rows={5}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagem do Mapa</label>
                            <div className="image-upload-container">
                                {formData.mapImage && (
                                    <div className="image-preview">
                                        <img src={formData.mapImage} alt="Preview" className="preview-image" />
                                    </div>
                                )}
                                <div className="upload-buttons">
                                    <label className="btn btn-outline-primary">
                                        <i className="fas fa-upload mr-2"></i> Escolher Imagem
                                        <input type="file" className="hidden-file-input" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    {mapImageFile && (
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setMapImageFile(null);
                                                setFormData({
                                                    ...formData,
                                                    mapImage: undefined,
                                                });
                                            }}
                                        >
                                            <i className="fas fa-times mr-2"></i> Remover
                                        </button>
                                    )}
                                </div>
                                <div className="text-light text-small mt-2">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Recomendado: Imagem com visão geral do mapa ou layout
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dicas para Adicionar Mapas</h5>
                        <ul className="tips-list">
                            <li>Certifique-se de que o nome está correto e como é conhecido pelos jogadores</li>
                            <li>Na descrição, inclua informações sobre características únicas do mapa</li>
                            <li>Mencione pontos estratégicos importantes</li>
                            <li>Use uma imagem de alta qualidade que mostre claramente o layout do mapa</li>
                            <li>Se possível, adicione guias específicos para este mapa depois de criá-lo</li>
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

export default MapForm;
