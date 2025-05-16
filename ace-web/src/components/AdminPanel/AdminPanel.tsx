import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.scss';
import authApi from '../../utils/authApi';
import userApi from '../../utils/userApi';
import agentApi from '../../utils/agentApi';
import { dialogService } from '../Dialog/dialogService';
import { UserDto } from '../../models/User';
import { AgentDto, IAgent } from '../../models/Agent';
import { GuideDto } from '../../models/Guide';
import { MapDto } from '../../models/Map';
import { SkinDto } from '../../models/Skin';
import guideApi from '../../utils/guideApi';
import mapApi from '../../utils/mapApi';
import skinApi from '../../utils/skinApi';
import weaponApi from '../../utils/weaponApi';
import { WeaponDto } from '../../models/Weapon';

type Tab = 'users' | 'agents' | 'weapons' | 'guides' | 'maps' | 'skins';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('users');
    const [users, setUsers] = useState<UserDto[]>([]);
    const [agents, setAgents] = useState<AgentDto[]>([]);
    const [weapons, setWeapons] = useState<WeaponDto[]>([]);
    const [guides, setGuides] = useState<GuideDto[]>([]);
    const [maps, setMaps] = useState<MapDto[]>([]);
    const [skins, setSkins] = useState<SkinDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || currentUser.roleName !== 'Admin') {
            navigate('/');
            dialogService.error('Acesso restrito a administradores');
        }
    }, [navigate]);

    useEffect(() => {
        switch (activeTab) {
            case 'users':
                loadUsers();
                break;
            case 'agents':
                loadAgents();
                break;
            case 'weapons':
                loadWeapons();
                break;
            case 'guides':
                loadGuides();
                break;
            case 'maps':
                loadMaps();
                break;
            case 'skins':
                loadSkins();
                break;
            default:
                break;
        }
    }, [activeTab]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await userApi.getAllUsers();

            if (response.success) {
                setUsers(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar usuários');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    const loadAgents = async () => {
        try {
            setIsLoading(true);
            const response = await agentApi.getAllAgents();

            if (response.success) {
                setAgents(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar agentes');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar agentes');
        } finally {
            setIsLoading(false);
        }
    };

    const loadWeapons = async () => {
        try {
            setIsLoading(true);
            const response = await weaponApi.getAllWeapons();

            if (response.success) {
                setWeapons(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar armas');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar armas');
        } finally {
            setIsLoading(false);
        }
    };

    const loadGuides = async () => {
        try {
            setIsLoading(true);
            const response = await guideApi.getAllGuides();

            if (response.success) {
                setGuides(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar guias');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar guias');
        } finally {
            setIsLoading(false);
        }
    };

    const loadMaps = async () => {
        try {
            setIsLoading(true);
            const response = await mapApi.getAllMaps();

            if (response.success) {
                setMaps(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar mapas');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar mapas');
        } finally {
            setIsLoading(false);
        }
    };

    const loadSkins = async () => {
        try {
            setIsLoading(true);
            const response = await skinApi.getAllSkins();

            if (response.success) {
                setSkins(response.data || []);
            } else {
                throw new Error(response.message || 'Erro ao carregar skins');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar skins');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAgent = () => {
        navigate('/agent');
    };

    const handleEditAgent = (agentId: number) => {
        navigate(`/agent/${agentId}`);
    };

    const handleDeleteAgent = async (agentId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir este agente?')) {
                return;
            }

            const response = await agentApi.deleteAgent(agentId.toString());

            if (response.success) {
                dialogService.success('Agente excluído com sucesso');
                loadAgents();
            } else {
                throw new Error(response.message || 'Erro ao excluir agente');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir agente');
        }
    };

    const handleAddWeapon = () => {
        navigate('/weapon');
    };

    const handleEditWeapon = (weaponId: number) => {
        navigate(`/weapon/${weaponId}`);
    };

    const handleDeleteWeapon = async (weaponId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir esta arma?')) {
                return;
            }

            const response = await weaponApi.deleteWeapon(weaponId.toString());

            if (response.success) {
                dialogService.success('Arma excluída com sucesso');
                loadWeapons();
            } else {
                throw new Error(response.message || 'Erro ao excluir arma');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir arma');
        }
    };

    const handleAddGuide = () => {
        navigate('/guide');
    };

    const handleEditGuide = (guideId: number) => {
        navigate(`/guide/${guideId}`);
    };

    const handleDeleteGuide = async (guideId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir este guia?')) {
                return;
            }

            const response = await guideApi.deleteGuide(guideId.toString());

            if (response.success) {
                dialogService.success('Guia excluído com sucesso');
                loadGuides();
            } else {
                throw new Error(response.message || 'Erro ao excluir guia');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir guia');
        }
    };

    const handleAddMap = () => {
        navigate('/map');
    };

    const handleEditMap = (mapId: number) => {
        navigate(`/map/${mapId}`);
    };

    const handleDeleteMap = async (mapId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir este mapa?')) {
                return;
            }

            const response = await mapApi.deleteMap(mapId.toString());

            if (response.success) {
                dialogService.success('Mapa excluído com sucesso');
                loadMaps();
            } else {
                throw new Error(response.message || 'Erro ao excluir mapa');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir mapa');
        }
    };

    const handleAddSkin = () => {
        navigate('/skin');
    };

    const handleEditSkin = (skinId: number) => {
        navigate(`/skin/${skinId}`);
    };

    const handleDeleteSkin = async (skinId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir esta skin?')) {
                return;
            }

            const response = await skinApi.deleteSkin(skinId.toString());

            if (response.success) {
                dialogService.success('Skin excluída com sucesso');
                loadSkins();
            } else {
                throw new Error(response.message || 'Erro ao excluir skin');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir skin');
        }
    };

    const handleEditUser = (userId: number) => {
        navigate(`/usersettings/${userId}`);
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
                return;
            }

            const response = await userApi.deleteUser(userId.toString());

            if (response.success) {
                dialogService.success('Usuário excluído com sucesso');
                loadUsers();
            } else {
                throw new Error(response.message || 'Erro ao excluir usuário');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao excluir usuário');
        }
    };

    return (
        <div className="admin-panel-container" ref={containerRef}>
            <div className="admin-tabs">
                <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    Usuários
                </button>
                <button className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
                    Agentes
                </button>
                <button className={`tab-button ${activeTab === 'weapons' ? 'active' : ''}`} onClick={() => setActiveTab('weapons')}>
                    Armas
                </button>
                <button className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`} onClick={() => setActiveTab('guides')}>
                    Guias
                </button>
                <button className={`tab-button ${activeTab === 'maps' ? 'active' : ''}`} onClick={() => setActiveTab('maps')}>
                    Mapas
                </button>
                <button className={`tab-button ${activeTab === 'skins' ? 'active' : ''}`} onClick={() => setActiveTab('skins')}>
                    Skins
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'users' && (
                    <div className="users-tab">
                        <h2>Gerenciamento de Usuários</h2>

                        {isLoading ? (
                            <div className="loading">Carregando usuários...</div>
                        ) : (
                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th className="photo-column">Foto</th>
                                            <th>Username</th>
                                            <th>Nome Completo</th>
                                            <th>Email</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="no-users">
                                                    Nenhum usuário encontrado
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.userId}>
                                                    <td>
                                                        <div
                                                            className="user-photo"
                                                            style={{
                                                                backgroundImage: user.profilePic ? `url(${user.profilePic})` : 'url(/logo.png)',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{user.nickname}</td>
                                                    <td>{`${user.firstName} ${user.lastName || ''}`}</td>
                                                    <td>{user.email}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditUser(user.userId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteUser(user.userId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'agents' && (
                    <div className="agents-tab">
                        <div className="tab-header">
                            <h2>Gerenciamento de Agentes</h2>
                            <button className="add-button" onClick={handleAddAgent}>
                                <i className="bx bx-plus"></i>
                                Adicionar Agente
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading">Carregando agentes...</div>
                        ) : (
                            <div className="agents-table-container">
                                <table className="agents-table">
                                    <thead>
                                        <tr>
                                            <th className="photo-column">Imagem</th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {agents.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="no-agents">
                                                    Nenhum agente encontrado
                                                </td>
                                            </tr>
                                        ) : (
                                            agents.map((agent) => (
                                                <tr key={agent.agentId}>
                                                    <td>
                                                        <div
                                                            className="agent-photo"
                                                            style={{
                                                                backgroundImage: agent.agentImage ? `url(${agent.agentImage})` : 'url(/logo.png)',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{agent.agentName}</td>
                                                    <td className="description-cell">{agent.agentDescription}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditAgent(agent.agentId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteAgent(agent.agentId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'weapons' && (
                    <div className="weapons-tab">
                        <div className="tab-header">
                            <h2>Gerenciamento de Armas</h2>
                            <button className="add-button" onClick={handleAddWeapon}>
                                <i className="bx bx-plus"></i>
                                Adicionar Arma
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading">Carregando armas...</div>
                        ) : (
                            <div className="weapons-table-container">
                                <table className="weapons-table">
                                    <thead>
                                        <tr>
                                            <th className="photo-column">Imagem</th>
                                            <th>Nome</th>
                                            <th>Categoria</th>
                                            <th>Créditos</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weapons.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="no-weapons">
                                                    Nenhuma arma encontrada
                                                </td>
                                            </tr>
                                        ) : (
                                            weapons.map((weapon) => (
                                                <tr key={weapon.weaponId}>
                                                    <td>
                                                        <div
                                                            className="weapon-photo"
                                                            style={{
                                                                backgroundImage: weapon.weaponImage ? `url(${weapon.weaponImage})` : 'url(/logo.png)',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{weapon.weaponName}</td>
                                                    <td>{weapon.category?.categoryName}</td>
                                                    <td>{weapon.credits}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditWeapon(weapon.weaponId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteWeapon(weapon.weaponId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="guides-tab">
                        <div className="tab-header">
                            <h2>Gerenciamento de Guias</h2>
                            <button className="add-button" onClick={handleAddGuide}>
                                <i className="bx bx-plus"></i>
                                Adicionar Guia
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading">Carregando guias...</div>
                        ) : (
                            <div className="guides-table-container">
                                <table className="guides-table">
                                    <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Autor</th>
                                            <th>Tipo</th>
                                            <th>Data de Criação</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {guides.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="no-guides">
                                                    Nenhum guia encontrado
                                                </td>
                                            </tr>
                                        ) : (
                                            guides.map((guide) => (
                                                <tr key={guide.guideId}>
                                                    <td>{guide.title}</td>
                                                    <td>{guide.author?.nickname || '-'}</td>
                                                    <td>{guide.guideType}</td>
                                                    <td>{new Date(guide.createdAt).toLocaleDateString()}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditGuide(guide.guideId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteGuide(guide.guideId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'maps' && (
                    <div className="maps-tab">
                        <div className="tab-header">
                            <h2>Gerenciamento de Mapas</h2>
                            <button className="add-button" onClick={handleAddMap}>
                                <i className="bx bx-plus"></i>
                                Adicionar Mapa
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading">Carregando mapas...</div>
                        ) : (
                            <div className="maps-table-container">
                                <table className="maps-table">
                                    <thead>
                                        <tr>
                                            <th className="photo-column">Imagem</th>
                                            <th>Nome</th>
                                            <th>Descrição</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maps.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="no-maps">
                                                    Nenhum mapa encontrado
                                                </td>
                                            </tr>
                                        ) : (
                                            maps.map((map) => (
                                                <tr key={map.mapId}>
                                                    <td>
                                                        <div
                                                            className="map-photo"
                                                            style={{
                                                                backgroundImage: map.mapImage ? `url(${map.mapImage})` : 'url(/logo.png)',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{map.mapName}</td>
                                                    <td className="description-cell">{map.mapDescription}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditMap(map.mapId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteMap(map.mapId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'skins' && (
                    <div className="skins-tab">
                        <div className="tab-header">
                            <h2>Gerenciamento de Skins</h2>
                            <button className="add-button" onClick={handleAddSkin}>
                                <i className="bx bx-plus"></i>
                                Adicionar Skin
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="loading">Carregando skins...</div>
                        ) : (
                            <div className="skins-table-container">
                                <table className="skins-table">
                                    <thead>
                                        <tr>
                                            <th className="photo-column">Imagem</th>
                                            <th>Nome</th>
                                            <th>Arma</th>
                                            <th className="actions-column">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skins.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="no-skins">
                                                    Nenhuma skin encontrada
                                                </td>
                                            </tr>
                                        ) : (
                                            skins.map((skin) => (
                                                <tr key={skin.skinId}>
                                                    <td>
                                                        <div
                                                            className="skin-photo"
                                                            style={{
                                                                backgroundImage: skin.skinImage ? `url(${skin.skinImage})` : 'url(/logo.png)',
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{skin.skinName}</td>
                                                    <td>{skin.weapon?.weaponName}</td>
                                                    <td className="actions">
                                                        <button className="edit-button" onClick={() => handleEditSkin(skin.skinId)}>
                                                            <i className="bx bx-edit"></i>
                                                            Editar
                                                        </button>
                                                        <button className="delete-button" onClick={() => handleDeleteSkin(skin.skinId)}>
                                                            <i className="bx bx-trash"></i>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
