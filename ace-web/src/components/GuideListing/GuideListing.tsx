import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import guideApi from '../../utils/guideApi';
import { GuideDto, GuideType } from '../../models/Guide';
import './GuideListing.scss';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';

const GuideListing: React.FC = () => {
    const [guides, setGuides] = useState<GuideDto[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            dialogService.error('Acesso restrito a usuários autenticados');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const guidesResponse = await guideApi.getAllGuides();
                if (guidesResponse.success) {
                    setGuides(guidesResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching guides:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredGuides = guides.filter((guide) => {
        const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || guide.guideType === selectedType;
        return matchesSearch && matchesType;
    });

    const handleGuideClick = (guideId: number) => {
        navigate(`/guide/${guideId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
    };

    const getTypeIcon = (type: GuideType) => {
        switch (type) {
            case 'Agent':
                return 'bx bx-user';
            case 'Map':
                return 'bx bx-map-alt';
            case 'Weapon':
                return 'bx bx-target-lock';
            case 'Other':
                return 'bx bx-book-open';
            default:
                return 'bx bx-help-circle';
        }
    };

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

    const getPreviewText = (content: string) => {
        const strippedContent = content.replace(/<[^>]*>?/gm, '');
        return strippedContent.length > 120 ? strippedContent.substring(0, 120) + '...' : strippedContent;
    };

    return (
        <div className="guideListingContainer">
            <div className="searchContainer">
                <input type="text" className="searchInput" placeholder="Buscar guia..." value={searchTerm} onChange={handleSearchChange} />
            </div>

            <h1 className="pageTitle">GUIAS</h1>
            <p className="pageSubtitle">Estratégias e dicas da comunidade</p>

            <div className="filterContainer">
                <button className={`filterButton ${selectedType === 'All' ? 'active' : ''}`} data-type="All" onClick={() => handleTypeFilter('All')}>
                    Todos
                </button>
                <button
                    className={`filterButton ${selectedType === 'Agent' ? 'active' : ''}`}
                    data-type="Agent"
                    onClick={() => handleTypeFilter('Agent')}
                >
                    Agentes
                </button>
                <button className={`filterButton ${selectedType === 'Map' ? 'active' : ''}`} data-type="Map" onClick={() => handleTypeFilter('Map')}>
                    Mapas
                </button>
                <button
                    className={`filterButton ${selectedType === 'Weapon' ? 'active' : ''}`}
                    data-type="Weapon"
                    onClick={() => handleTypeFilter('Weapon')}
                >
                    Armas
                </button>
                <button
                    className={`filterButton ${selectedType === 'Other' ? 'active' : ''}`}
                    data-type="Other"
                    onClick={() => handleTypeFilter('Other')}
                >
                    Outros
                </button>
            </div>

            <div className="guidesGridContainer">
                {isLoading ? (
                    <div className="loadingMessage">Carregando guias</div>
                ) : filteredGuides.length === 0 ? (
                    <div className="noGuidesMessage">Nenhum guia encontrado</div>
                ) : (
                    <div className="guidesGrid">
                        {filteredGuides.map((guide) => (
                            <div
                                key={guide.guideId}
                                className="guideCard"
                                data-type={guide.guideType}
                                onClick={() => handleGuideClick(guide.guideId)}
                            >
                                <i className={`${getTypeIcon(guide.guideType)} guideTypeIcon`}></i>

                                <div className="guideHeader">
                                    <span className="guideType" data-type={guide.guideType}>
                                        {guide.guideType}
                                    </span>
                                    <h3 className="guideTitle">{guide.title}</h3>
                                </div>

                                <p className="guidePreview">{getPreviewText(guide.content)}</p>

                                <div className="guideFooter">
                                    <div className="guideAuthor">
                                        <div className="authorAvatar">{guide.author ? getInitials(guide.author.nickname) : 'AN'}</div>
                                        <div className="authorInfo">
                                            <p className="authorName">{guide.author ? guide.author.nickname : 'Anônimo'}</p>
                                            <span className="guideDate">{formatDate(guide.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="viewGuideActions">
                                        {guide.comments && (
                                            <span className="commentsCount">
                                                <i className="bx bx-comment"></i>
                                                {guide.comments.length}
                                            </span>
                                        )}
                                    </div>

                                    <button className="viewGuideBtn">
                                        <span>Ler Guia</span>
                                        <i className="bx bx-right-arrow-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideListing;
