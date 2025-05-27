import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentDto } from '../../models/Agent';
import { CommentDto } from '../../models/Comment';
import agentApi from '../../utils/agentApi';
import commentApi from '../../utils/commentApi';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';
import CommentForm from '../CommentForm/CommentForm';
import './AgentView.scss';

interface AgentViewProps {
    agentId: string;
}

const AgentView: React.FC<AgentViewProps> = ({ agentId }) => {
    const navigate = useNavigate();
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
    const [activeAbility, setActiveAbility] = useState<number>(0);
    const [activeVideo, setActiveVideo] = useState<number>(0);
    const [isModOrAdmin, setIsModOrAdmin] = useState<boolean>(false);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setIsModOrAdmin(currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator');
    }, []);

    useEffect(() => {
        const fetchAgent = async () => {
            if (!agentId) return;

            try {
                setIsLoading(true);
                const response = await agentApi.getAgentById(agentId);

                if (response.success && response.data) {
                    setAgent(response.data);
                    fetchComments();
                } else {
                    throw new Error(response.message || 'Falha ao carregar dados do agente');
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar agente');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setIsLoadingComments(true);
                const response = await commentApi.getCommentsByEntity('Agent', agentId);

                if (response.success && response.data) {
                    setComments(response.data);
                }
            } catch (error: any) {
                console.error('Erro ao carregar comentários:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchAgent();
    }, [agentId, navigate]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const handleCommentAdded = async () => {
        try {
            const response = await commentApi.getCommentsByEntity('Agent', agentId);
            if (response.success && response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar comentários:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="agent-view-loading">
                <div className="loading-container">
                    <div className="loading-icon">
                        <span className="material-symbols-outlined">person_search</span>
                    </div>
                    <div className="loading-text">LOCALIZANDO AGENTE</div>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="agent-view-error">
                <div className="error-container">
                    <div className="error-label">AGENTE NÃO ENCONTRADO</div>
                    <div className="error-code">ERRO #404</div>
                    <p>O agente solicitado não existe na nossa base de dados ou foi removido.</p>
                    <button className="return-button" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        VOLTAR
                    </button>
                </div>
            </div>
        );
    }

    const abilities = [
        { name: agent.abilityOne, description: agent.abilityOneDescription, type: 'Q' },
        { name: agent.abilityTwo, description: agent.abilityTwoDescription, type: 'E' },
        { name: agent.abilityThree, description: agent.abilityThreeDescription, type: 'C' },
        { name: agent.ultimate, description: agent.ultimateDescription, type: 'X' },
    ].filter((ability) => ability.name);

    const extractVideoId = (url: string) => {
        const regExp = /^.*(youtube.com\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    return (
        <div className="agent-view-container">
            <div className="agent-view-header">
                <div className="agent-name-wrapper">
                    <h1 className="agent-name" data-text={agent.agentName}>
                        {agent.agentName}
                    </h1>
                    <div className="agent-name-accent"></div>
                </div>
            </div>

            <div className="agent-view-content">
                <div className="agent-profile">
                    <div className="agent-image-container">
                        <div className="agent-image" style={{ backgroundImage: `url(${agent.agentImage})` }} />
                        <div className="image-frame-top"></div>
                        <div className="image-frame-bottom"></div>
                        <div className="image-corner-tl"></div>
                        <div className="image-corner-tr"></div>
                        <div className="image-corner-bl"></div>
                        <div className="image-corner-br"></div>
                        <div className="agent-gradient-overlay"></div>
                    </div>

                    <div className="agent-details">
                        <div className="agent-info-header">
                            <div className="agent-title">{agent.agentName}</div>
                            <div className="agent-codename">INFORMAÇÕES</div>
                        </div>

                        <div className="agent-description-container">
                            <div className="description-content">
                                <p>{agent.agentDescription || 'Informação classificada. Acesso restrito a agentes autorizados.'}</p>
                            </div>
                        </div>

                        <div className="ability-section">
                            <div className="ability-heading">HABILIDADES</div>
                            <div className="ability-selector">
                                {abilities.map((ability, index) => (
                                    <button
                                        key={index}
                                        className={`ability-key ${activeAbility === index ? 'active' : ''}`}
                                        onClick={() => setActiveAbility(index)}
                                    >
                                        {ability.type}
                                    </button>
                                ))}
                            </div>

                            <div className="ability-details">
                                {abilities.length > 0 && (
                                    <>
                                        <h3>{abilities[activeAbility].name}</h3>
                                        <p>{abilities[activeAbility].description}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {agent.videos && agent.videos.length > 0 && (
                    <div className="agent-videos-section">
                        <h2>VÍDEOS DO AGENTE</h2>
                        <div className="video-selector">
                            {agent.videos.map((video, index) => (
                                <button
                                    key={index}
                                    className={`video-btn ${activeVideo === index ? 'active' : ''}`}
                                    onClick={() => setActiveVideo(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="video-player">
                            {agent.videos[activeVideo] && (
                                <iframe
                                    src={`https://www.youtube.com/embed/${extractVideoId(agent.videos[activeVideo].youtubeLink)}`}
                                    allowFullScreen
                                    title={`${agent.agentName} Video ${activeVideo + 1}`}
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="agent-comments-section">
                    <h2>DICAS DA MODERAÇÃO</h2> 

                    {isModOrAdmin && (
                        <CommentForm entityType="Agent" entityId={parseInt(agentId)} onCommentAdded={handleCommentAdded} darkMode={true} />
                    )}

                    

                    {isLoadingComments ? (
                        <div className="comments-loading">
                            <span className="material-symbols-outlined loading-icon">comment</span>
                            <p>Carregando dicas...</p>
                        </div>
                    ) : (
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <span className="material-symbols-outlined">info</span>
                                    <p>Nenhuma dica disponível para este agente.</p>
                                    <div className="hint">Nossos moderadores ainda não adicionaram dicas para este agente.</div>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.commentId} className="comment-item">
                                        <div className="comment-header">
                                            <div className="comment-author">
                                                <div className="author-avatar">{comment.author ? getInitials(comment.author.nickname) : 'AN'}</div>
                                                <span className="author-name">{comment.author ? comment.author.nickname : 'ANÔNIMO'}</span>
                                            </div>
                                            <span className="comment-date">{formatDate(comment.commentDate)}</span>
                                        </div>
                                        <div className="comment-text">{comment.commentText}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        
                    )}


                    {!isModOrAdmin && (
                        <CommentForm entityType="Agent" entityId={parseInt(agentId)} onCommentAdded={handleCommentAdded} darkMode={true} />
                    )}
                </div>
                
            </div>
        </div>
    );
};

export default AgentView;
