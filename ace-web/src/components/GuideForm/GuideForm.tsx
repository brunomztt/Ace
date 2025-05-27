import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuideCreateDto, GuideType } from '../../models/Guide';
import guideApi from '../../utils/guideApi';
import { dialogService } from '../Dialog/dialogService';
import authApi from '../../utils/authApi';
import './GuideForm.scss';

interface GuideFormProps {
    guideId?: string;
}

const GuideForm: React.FC<GuideFormProps> = ({ guideId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<GuideCreateDto>({
        title: '',
        content: '',
        guideType: 'Other',
    });

    useEffect(() => {
        const user = authApi.getCurrentUser();
        const isAuthorized = user?.roleName === 'Admin' || user?.roleName === 'Moderator';
        
        if (!isAuthorized) {
            navigate('/');
            dialogService.error('Acesso restrito a administradores');
        }
        }, [navigate]);

    useEffect(() => {
        if (guideId) {
            setIsEditMode(true);
            loadGuideData(guideId);
        }
    }, [guideId]);

    const loadGuideData = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await guideApi.getGuideById(id);
            if (response.success && response.data) {
                const guide = response.data;
                setFormData({
                    title: guide.title,
                    content: guide.content,
                    guideType: guide.guideType,
                });
            } else {
                dialogService.error('Erro ao carregar dados do guia');
                navigate(-1);
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar dados do guia');
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            dialogService.error('O título do guia é obrigatório');
            return;
        }

        if (!formData.content.trim()) {
            dialogService.error('O conteúdo do guia é obrigatório');
            return;
        }

        setIsLoading(true);

        try {
            let response;
            if (isEditMode && guideId) {
                response = await guideApi.updateGuide(guideId, formData);
                if (response.success) {
                    dialogService.success('Guia atualizado com sucesso!');
                }
            } else {
                response = await guideApi.createGuide(formData);
                if (response.success) {
                    dialogService.success('Guia criado com sucesso!');
                }
            }

            if (response && response.success) {
                navigate(-1);
            } else {
                throw new Error((response && response.message) || 'Erro ao processar guia');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao processar guia');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="guide-form-container">
            <h4 className="form-title">{isEditMode ? 'Editar Guia' : 'Criar Novo Guia'}</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações Básicas</h5>

                        <div className="form-group">
                            <label className="form-label">Título *</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Digite o título do guia"
                                    maxLength={100}
                                />
                            </div>
                            <div className="char-counter">{formData.title.length}/100</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tipo de Guia *</label>
                            <div className="input-box">
                                <select className="form-control" name="guideType" value={formData.guideType} onChange={handleInputChange} required>
                                    <option value="Agent">Agente</option>
                                    <option value="Map">Mapa</option>
                                    <option value="Weapon">Arma</option>
                                    <option value="Other">Outro</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Conteúdo *</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control content-editor"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    placeholder="Escreva o conteúdo do seu guia aqui..."
                                    rows={15}
                                    required
                                />
                            </div>
                            <div className="text-light text-small mt-2">
                                <i className="fas fa-info-circle mr-2"></i>
                                Dica: Escreva guias detalhados com dicas úteis para os jogadores
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dicas para Escrever Guias</h5>
                        <ul className="tips-list">
                            <li>Use títulos claros que indiquem o conteúdo do guia</li>
                            <li>Divida o conteúdo em seções para facilitar a leitura</li>
                            <li>Inclua dicas específicas e estratégias úteis</li>
                            <li>Mantenha o texto organizado e fácil de seguir</li>
                            <li>Mencione mapas, agentes ou armas específicas quando relevante</li>
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
                                <i className="fas fa-save mr-2"></i> {isEditMode ? 'Atualizar' : 'Publicar'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuideForm;
