import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentDto } from '../../models/Agent';
import agentApi from '../../utils/agentApi';
import { dialogService } from '../Dialog/dialogService';
import './AgentView.scss';

interface AgentViewProps {
    agentId: string;
}

const AgentView: React.FC<AgentViewProps> = ({ agentId }) => {
    const navigate = useNavigate();
    const [agent, setAgent] = useState<AgentDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeAbility, setActiveAbility] = useState<number>(0);
    const [activeVideo, setActiveVideo] = useState<number>(0);

    useEffect(() => {
        const fetchAgent = async () => {
            if (!agentId) return;

            try {
                setIsLoading(true);
                const response = await agentApi.getAgentById(agentId);

                if (response.success && response.data) {
                    setAgent(response.data);
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

        fetchAgent();
    }, [agentId, navigate]);

    if (isLoading) {
        return (
            <div className="agent-view-loading">
                <div className="loading-animation">
                    <span className="material-symbols-outlined">cached</span>
                </div>
                <p>Carregando informações do agente...</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="agent-view-error">
                <span className="material-symbols-outlined">error</span>
                <p>Agente não encontrado</p>
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
                <h1>{agent.agentName}</h1>
            </div>

            <div className="agent-view-content">
                <div className="agent-profile">
                    <div className="agent-image-container">
                        <div className="agent-image" style={{ backgroundImage: `url(${agent.agentImage})` }} />
                        <div className="agent-gradient-overlay"></div>
                    </div>

                    <div className="agent-details">
                        <h2>{agent.agentName}</h2>
                        <p className="agent-description">{agent.agentDescription}</p>

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

                {agent.videos && agent.videos.length > 0 && (
                    <div className="agent-videos-section">
                        <h2>Vídeos</h2>
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
            </div>
        </div>
    );
};

export default AgentView;
