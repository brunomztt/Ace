import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapDto } from '../../models/Map';
import { CommentDto } from '../../models/Comment';
import mapApi from '../../utils/mapApi';
import commentApi from '../../utils/commentApi';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';
import CommentForm from '../CommentForm/CommentForm';
import './MapView.scss';
import CommentItem from '../CommentItem/CommentItem';

interface MapViewProps {
    mapId: string;
}

const MapView: React.FC<MapViewProps> = ({ mapId }) => {
    const navigate = useNavigate();
    const [map, setMap] = useState<MapDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
    const [isModOrAdmin, setIsModOrAdmin] = useState<boolean>(false);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser) {
            navigate('/');
            dialogService.error('Acesso restrito a usuários autenticados');
            return;
        }
        setIsModOrAdmin(currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator');
    }, []);

    useEffect(() => {
        const fetchMapData = async () => {
            if (!mapId) return;

            try {
                setIsLoading(true);
                const mapResponse = await mapApi.getMapById(mapId);

                if (mapResponse.success && mapResponse.data) {
                    setMap(mapResponse.data);
                    fetchComments();
                } else {
                    throw new Error(mapResponse.message || 'Falha ao carregar dados do mapa');
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar mapa');
                navigate('/maps');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setIsLoadingComments(true);
                const response = await commentApi.getCommentsByEntity('Map', mapId);

                if (response.success && response.data) {
                    setComments(response.data);
                }
            } catch (error: any) {
                console.error('Erro ao carregar comentários:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchMapData();
    }, [mapId, navigate]);

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
            const response = await commentApi.getCommentsByEntity('Map', mapId);
            if (response.success && response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar comentários:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="map-view-loading">
                <div className="loading-container">
                    <div className="loading-icon">
                        <span className="material-symbols-outlined">radar</span>
                    </div>
                    <div className="loading-text">LOCALIZANDO MAPA</div>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!map) {
        return (
            <div className="map-view-error">
                <div className="error-container">
                    <div className="error-label">MAPA NÃO ENCONTRADO</div>
                    <div className="error-code">ERRO #512</div>
                    <p>O mapa solicitado não existe na nossa base de dados.</p>
                    <button className="return-button" onClick={() => navigate('/maps')}>
                        <div className="button-icon">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </div>
                        <div className="button-text">VOLTAR</div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="map-view-container">
            <div className="map-bg-overlay" style={{ backgroundImage: map.mapImage ? `url(${map.mapImage})` : 'none' }}></div>

            <div className="map-header">
                <div className="header-content">
                    <div className="map-title-wrapper">
                        <h1 className="map-title">{map.mapName}</h1>
                        <div className="map-title-accent"></div>
                    </div>
                </div>
            </div>

            <div className="map-content">
                <div className="map-card">
                    <div className="map-image-section">
                        {map.mapImage ? (
                            <div className="map-image-container">
                                <div className="map-image" style={{ backgroundImage: `url(${map.mapImage})` }}></div>
                                <div className="image-frame-top"></div>
                                <div className="image-frame-bottom"></div>
                                <div className="image-corner-tl"></div>
                                <div className="image-corner-tr"></div>
                                <div className="image-corner-bl"></div>
                                <div className="image-corner-br"></div>
                            </div>
                        ) : (
                            <div className="map-image-placeholder">
                                <span className="material-symbols-outlined">hide_image</span>
                                <div className="placeholder-text">IMAGEM INDISPONÍVEL</div>
                            </div>
                        )}
                    </div>

                    <div className="map-info-section">
                        <div className="map-info-header">
                            <div className="map-name">{map.mapName}</div>
                            <div className="map-label">MAPA TÁTICO</div>
                        </div>

                        <div className="map-description-container">
                            <div className="description-heading">INFORMAÇÕES DO MAPA</div>
                            <div className="description-content">
                                {map.mapDescription ? (
                                    <p>{map.mapDescription}</p>
                                ) : (
                                    <p className="no-description">Informações classificadas. Acesso restrito a agentes autorizados.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="map-comments-section">
                    <div className="section-heading">
                        <h2>DICAS VERIFICADAS</h2>
                        <div className="section-heading-accent"></div>
                    </div>

                    <CommentForm entityType="Map" entityId={parseInt(mapId)} onCommentAdded={handleCommentAdded} />

                    {isLoadingComments ? (
                        <div className="comments-loading">
                            <div className="loading-icon">
                                <span className="material-symbols-outlined">comment</span>
                            </div>
                            <div className="loading-text">Carregando dicas...</div>
                        </div>
                    ) : (
                        <div className="comments-list">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <span className="material-symbols-outlined">info</span>
                                    <p>Nenhuma dica disponível para este mapa.</p>
                                    <div className="hint">{'Seja o primeiro a adicionar uma dica!'}</div>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <CommentItem key={comment.commentId} comment={comment} onCommentUpdated={handleCommentAdded} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapView;
