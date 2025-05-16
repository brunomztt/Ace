import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuideCreateDto, GuideType } from '../../models/Guide';
import guideApi from '../../utils/guideApi';
import { dialogService } from '../Dialog/dialogService';
import './GuideForm.scss';

const GuideForm: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<GuideCreateDto>({
        title: '',
        content: '',
        guideType: 'Agent',
    });

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
            const response = await guideApi.createGuide(formData);

            if (response.success) {
                dialogService.success('Guia criado com sucesso!');
                navigate('/admin');
            } else {
                throw new Error(response.message || 'Erro ao criar guia');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao criar guia');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="guide-form-container">
            <h4 className="form-title">Criar Novo Guia</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações do Guia</h5>

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
                                    className="form-control content-textarea"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Digite o conteúdo do seu guia aqui..."
                                    rows={15}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Dicas para um bom guia</h5>
                        <ul className="tips-list">
                            <li>Use títulos e subtítulos para organizar o conteúdo</li>
                            <li>Inclua detalhes específicos e dicas práticas</li>
                            <li>Seja claro e conciso em suas explicações</li>
                            <li>Considere incluir exemplos e casos de uso</li>
                            <li>Revise seu texto para erros gramaticais antes de publicar</li>
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
                                <i className="fas fa-save mr-2"></i> Publicar Guia
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GuideForm;
