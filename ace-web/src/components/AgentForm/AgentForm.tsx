import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgentCreateDto, AgentVideoDto } from '../../models/Agent';
import agentApi from '../../utils/agentApi';
import { dialogService } from '../Dialog/dialogService';
import './AgentForm.scss';

interface AgentFormProps {
    agentId?: string;
}

const AgentForm: React.FC<AgentFormProps> = ({ agentId }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [formData, setFormData] = useState<AgentCreateDto>({
        agentName: '',
        agentDescription: '',
        abilityOne: '',
        abilityOneDescription: '',
        abilityTwo: '',
        abilityTwoDescription: '',
        abilityThree: '',
        abilityThreeDescription: '',
        ultimate: '',
        ultimateDescription: '',
        agentImage: '',
        videos: [],
    });

    const [agentImageFile, setAgentImageFile] = useState<File | null>(null);
    const [videoInputs, setVideoInputs] = useState<{ youtubeLink: string }[]>([{ youtubeLink: '' }]);

    useEffect(() => {
        if (agentId) {
            setIsEditMode(true);
            loadAgentData(agentId);
        }
    }, [agentId]);

    const loadAgentData = async (id: string) => {
        setIsLoading(true);
        try {
            const response = await agentApi.getAgentById(id);
            if (response.success && response.data) {
                const agent = response.data;
                setFormData({
                    agentName: agent.agentName || '',
                    agentDescription: agent.agentDescription || '',
                    abilityOne: agent.abilityOne || '',
                    abilityOneDescription: agent.abilityOneDescription || '',
                    abilityTwo: agent.abilityTwo || '',
                    abilityTwoDescription: agent.abilityTwoDescription || '',
                    abilityThree: agent.abilityThree || '',
                    abilityThreeDescription: agent.abilityThreeDescription || '',
                    ultimate: agent.ultimate || '',
                    ultimateDescription: agent.ultimateDescription || '',
                    agentImage: agent.agentImage || '',
                    videos: agent.videos || [],
                });

                if (agent.videos && agent.videos.length > 0) {
                    setVideoInputs(agent.videos.map((video) => ({ youtubeLink: video.youtubeLink })));
                }
            } else {
                dialogService.error('Erro ao carregar dados do agente');
                navigate('/admin');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar dados do agente');
            navigate('/admin');
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
                setAgentImageFile(file);
                setFormData({
                    ...formData,
                    agentImage: dataUrl,
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

    const handleVideoChange = (index: number, value: string) => {
        const updatedVideoInputs = [...videoInputs];
        updatedVideoInputs[index].youtubeLink = value;
        setVideoInputs(updatedVideoInputs);

        const validVideos: AgentVideoDto[] = updatedVideoInputs
            .filter((v) => v.youtubeLink.trim() !== '')
            .map((v, i) => ({
                videoId: isEditMode && formData.videos && formData.videos[i] ? formData.videos[i].videoId : 0,
                youtubeLink: v.youtubeLink,
            }));

        setFormData({
            ...formData,
            videos: validVideos,
        });
    };

    const addVideoInput = () => {
        setVideoInputs([...videoInputs, { youtubeLink: '' }]);
    };

    const removeVideoInput = (index: number) => {
        const updatedVideoInputs = [...videoInputs];
        updatedVideoInputs.splice(index, 1);
        setVideoInputs(updatedVideoInputs);

        const validVideos: AgentVideoDto[] = updatedVideoInputs
            .filter((v) => v.youtubeLink.trim() !== '')
            .map((v, i) => ({
                videoId: isEditMode && formData.videos && formData.videos[i] ? formData.videos[i].videoId : 0,
                youtubeLink: v.youtubeLink,
            }));

        setFormData({
            ...formData,
            videos: validVideos,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agentName) {
            dialogService.error('O nome do agente é obrigatório');
            return;
        }

        setIsLoading(true);

        try {
            const validVideos: AgentVideoDto[] = videoInputs
                .filter((v) => v.youtubeLink.trim() !== '')
                .map((v, i) => ({
                    videoId: isEditMode && formData.videos && formData.videos[i] ? formData.videos[i].videoId : 0,
                    youtubeLink: v.youtubeLink,
                }));

            const agentData: AgentCreateDto = {
                ...formData,
                videos: validVideos,
            };

            let response;
            if (isEditMode && agentId) {
                response = await agentApi.updateAgent(agentId, agentData);
                if (response.success) {
                    dialogService.success('Agente atualizado com sucesso!');
                }
            } else {
                response = await agentApi.createAgent(agentData);
                if (response.success) {
                    dialogService.success('Agente criado com sucesso!');
                }
            }

            if (response && response.success) {
                navigate('/admin');
            } else {
                throw new Error((response && response.message) || 'Erro ao processar agente');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao processar agente');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    return (
        <div className="agent-form-container">
            <h4 className="form-title">{isEditMode ? 'Editar Agente' : 'Adicionar Novo Agente'}</h4>

            <form onSubmit={handleSubmit}>
                <div className="form-content">
                    <div className="form-section">
                        <h5>Informações Básicas</h5>

                        <div className="form-group">
                            <label className="form-label">Nome do Agente *</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="agentName"
                                    value={formData.agentName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="agentDescription"
                                    value={formData.agentDescription}
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagem do Agente</label>
                            <div className="image-upload-container">
                                {formData.agentImage && (
                                    <div className="image-preview">
                                        <img src={formData.agentImage} alt="Preview" className="preview-image" />
                                    </div>
                                )}
                                <div className="upload-buttons">
                                    <label className="btn btn-outline-primary">
                                        <i className="fas fa-upload mr-2"></i> Escolher Imagem
                                        <input type="file" className="hidden-file-input" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    {(agentImageFile || formData.agentImage) && (
                                        <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={() => {
                                                setAgentImageFile(null);
                                                setFormData({
                                                    ...formData,
                                                    agentImage: '',
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
                        <h5>Habilidades</h5>

                        <div className="form-group">
                            <label className="form-label">Habilidade 1</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="abilityOne"
                                    value={formData.abilityOne}
                                    onChange={handleInputChange}
                                    placeholder="Nome da habilidade"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição da Habilidade 1</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="abilityOneDescription"
                                    value={formData.abilityOneDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Habilidade 2</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="abilityTwo"
                                    value={formData.abilityTwo}
                                    onChange={handleInputChange}
                                    placeholder="Nome da habilidade"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição da Habilidade 2</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="abilityTwoDescription"
                                    value={formData.abilityTwoDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Habilidade 3</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="abilityThree"
                                    value={formData.abilityThree}
                                    onChange={handleInputChange}
                                    placeholder="Nome da habilidade"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição da Habilidade 3</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="abilityThreeDescription"
                                    value={formData.abilityThreeDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Ultimate</label>
                            <div className="input-box">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ultimate"
                                    value={formData.ultimate}
                                    onChange={handleInputChange}
                                    placeholder="Nome da ultimate"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição da Ultimate</label>
                            <div className="input-box">
                                <textarea
                                    className="form-control"
                                    name="ultimateDescription"
                                    value={formData.ultimateDescription}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h5>Vídeos</h5>
                        <p className="text-light">Adicione links do YouTube relacionados a este agente</p>

                        {videoInputs.map((video, index) => (
                            <div className="form-group video-input-group" key={index}>
                                <div className="input-box with-button">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={video.youtubeLink}
                                        onChange={(e) => handleVideoChange(index, e.target.value)}
                                        placeholder="Link do YouTube (https://youtube.com/...)"
                                    />
                                    {videoInputs.length > 1 && (
                                        <button type="button" className="btn-remove" onClick={() => removeVideoInput(index)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button type="button" className="btn btn-outline-primary btn-sm mt-2" onClick={addVideoInput}>
                            <i className="fas fa-plus mr-2"></i> Adicionar outro vídeo
                        </button>
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

export default AgentForm;
