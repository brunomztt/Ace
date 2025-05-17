import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import agentApi from '../../utils/agentApi';
import { AgentDto } from '../../models/Agent';
import './AgentListing.scss';

const AgentListing: React.FC = () => {
    const [agents, setAgents] = useState<AgentDto[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const carouselRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await agentApi.getAllAgents(searchTerm);
                if (response.success) {
                    setAgents(response.data || []);
                    setActiveIndex(0);
                }
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };

        const timer = setTimeout(() => {
            fetchAgents();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const container = carouselRef.current;
        const scrollPosition = container.scrollLeft;
        const cardWidth = container.offsetWidth * 0.28 + 48;
        const newActiveIndex = Math.round(scrollPosition / cardWidth);
        if (newActiveIndex !== activeIndex && newActiveIndex >= 0 && newActiveIndex < agents.length) {
            setActiveIndex(newActiveIndex);
        }
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('scroll', handleScroll);
            const handleTouchStart = (e: TouchEvent) => {};
            carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
            return () => {
                carousel.removeEventListener('scroll', handleScroll);
                carousel.removeEventListener('touchstart', handleTouchStart);
            };
        }
    }, [agents.length, activeIndex]);

    const handleAgentClick = (agentId: number) => {
        navigate(`/agent/${agentId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="agentListingContainer">
            <div className="searchContainer">
                <input type="text" className="searchInput" placeholder="Buscar agente..." value={searchTerm} onChange={handleSearchChange} />
            </div>
            <h1 className="verticalTitle">AGENTS</h1>
            <div className="carouselOuterContainer">
                <div className="carouselContainer" ref={carouselRef}>
                    {agents.length === 0 ? (
                        <div className="noAgentsMessage">Nenhum agente encontrado</div>
                    ) : (
                        agents.map((agent, index) => (
                            <div
                                key={agent.agentId}
                                className={`agentCard ${index === activeIndex ? 'active' : ''}`}
                                onClick={() => handleAgentClick(agent.agentId)}
                            >
                                <img src={agent.agentImage} alt={agent.agentName} className="agentImage" loading="lazy" />
                                <h2 className="agentNameVertical">{agent.agentName}</h2>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentListing;
