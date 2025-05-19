import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapApi from '../../utils/mapApi';
import { MapDto } from '../../models/Map';
import './MapListing.scss';

const MapListing: React.FC = () => {
    const [maps, setMaps] = useState<MapDto[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const mapsResponse = await mapApi.getAllMaps();

                if (mapsResponse.success) {
                    setMaps(mapsResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching maps:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredMaps = maps.filter((map) => {
        return map.mapName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleMapClick = (mapId: number) => {
        navigate(`/map/${mapId}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="mapListingContainer">
            <div className="searchContainer">
                <input type="text" className="searchInput" placeholder="Buscar mapa..." value={searchTerm} onChange={handleSearchChange} />
            </div>
            <h1 className="pageTitle">MAPAS</h1>
            <p className="pageSubtitle">Conheça os campos de batalha</p>

            <div className="mapsGridContainer">
                {isLoading ? (
                    <div className="loadingMessage">Carregando mapas</div>
                ) : filteredMaps.length === 0 ? (
                    <div className="noMapsMessage">Nenhum mapa encontrado</div>
                ) : (
                    <div className="mapsGrid">
                        {filteredMaps.map((map) => (
                            <div key={map.mapId} className="mapCard" onClick={() => handleMapClick(map.mapId)}>
                                <div className="mapImageContainer">
                                    <img src={map.mapImage} alt={map.mapName} className="mapImage" loading="lazy" />
                                </div>
                                <div className="mapInfoOverlay">
                                    <div className="mapHeader">
                                        <h3 className="mapName">{map.mapName}</h3>
                                    </div>
                                    {map.mapDescription && <p className="mapDescription">{map.mapDescription}</p>}
                                    <div className="mapFooter">
                                        <button className="viewMapBtn">
                                            <span>Ver Detalhes</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapListing;
