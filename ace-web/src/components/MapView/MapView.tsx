import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapDto } from '../../models/Map';
import mapApi from '../../utils/mapApi';
import { dialogService } from '../Dialog/dialogService';
import './MapView.scss';

interface MapViewProps {
    mapId: string;
}

const MapView: React.FC<MapViewProps> = ({ mapId }) => {
    const navigate = useNavigate();
    const [map, setMap] = useState<MapDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMapData = async () => {
            if (!mapId) return;

            try {
                setIsLoading(true);
                const mapResponse = await mapApi.getMapById(mapId);

                if (mapResponse.success && mapResponse.data) {
                    setMap(mapResponse.data);
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

        fetchMapData();
    }, [mapId, navigate]);

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
            </div>
        </div>
    );
};

export default MapView;
