import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.scss';
import authApi from '../../utils/authApi';
import { dialogService } from '../Dialog/dialogService';
import userApi from '../../utils/userApi';
import agentApi from '../../utils/agentApi';
import guideApi from '../../utils/guideApi';
import mapApi from '../../utils/mapApi';
import skinApi from '../../utils/skinApi';
import weaponApi from '../../utils/weaponApi';
import { UserDto } from '../../models/User';
import { AgentDto } from '../../models/Agent';
import { GuideDto } from '../../models/Guide';
import { MapDto } from '../../models/Map';
import { SkinDto } from '../../models/Skin';
import { WeaponCategoryDto, WeaponDto } from '../../models/Weapon';

type Tab = 'users' | 'agents' | 'weapons' | 'guides' | 'maps' | 'skins';

type FilterOption = {
    id: any;
    name: string;
};

const AdminPanel: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('users');
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [weaponCategoryOptions, setWeaponCategoryOptions] = useState<FilterOption[]>([]);
    const [weaponOptions, setWeaponOptions] = useState<FilterOption[]>([]);
    const [guideTypeOptions] = useState<FilterOption[]>([
        { id: 'Agent', name: 'Agent' },
        { id: 'Map', name: 'Map' },
        { id: 'Weapon', name: 'Weapon' },
        { id: 'Other', name: 'Other' },
    ]);
    const containerRef = useRef<HTMLDivElement>(null);

    const tabConfigs = {
        users: {
            title: 'Usuários',
            entity: 'user',
            apiLoad: (search?: string) => userApi.getAllUsers(search),
            apiDelete: (id: string) => userApi.deleteUser(id),
            columns: [
                { key: 'profilePic', label: 'Foto', type: 'image' },
                { key: 'nickname', label: 'Username' },
                { key: 'fullName', label: 'Nome Completo' },
                { key: 'email', label: 'Email' },
            ],
            filters: [],
            canAdd: false,
        },
        agents: {
            title: 'Agentes',
            entity: 'agent',
            apiLoad: (search?: string) => agentApi.getAllAgents(search),
            apiDelete: (id: string) => agentApi.deleteAgent(id),
            columns: [
                { key: 'agentImage', label: 'Imagem', type: 'image' },
                { key: 'agentName', label: 'Nome' },
                { key: 'agentDescription', label: 'Descrição', type: 'description' },
            ],
            filters: [],
            canAdd: true,
        },
        weapons: {
            title: 'Armas',
            entity: 'weapon',
            apiLoad: (search?: string, categoryId?: any) => weaponApi.getAllWeapons(search, categoryId),
            apiDelete: (id: string) => weaponApi.deleteWeapon(id),
            columns: [
                { key: 'weaponImage', label: 'Imagem', type: 'image' },
                { key: 'weaponName', label: 'Nome' },
                { key: 'categoryName', label: 'Categoria' },
                { key: 'credits', label: 'Créditos' },
            ],
            filters: [{ key: 'categoryId', label: 'as Categorias' }],
            canAdd: true,
        },
        guides: {
            title: 'Guias',
            entity: 'guide',
            apiLoad: (search?: string, guideType?: any) => guideApi.getAllGuides(search, guideType),
            apiDelete: (id: string) => guideApi.deleteGuide(id),
            columns: [
                { key: 'title', label: 'Título' },
                { key: 'authorName', label: 'Autor' },
                { key: 'guideType', label: 'Tipo' },
                { key: 'createdAt', label: 'Data de Criação', type: 'date' },
            ],
            filters: [{ key: 'guideType', label: 'os Tipos' }],
            canAdd: true,
        },
        maps: {
            title: 'Mapas',
            entity: 'map',
            apiLoad: (search?: string) => mapApi.getAllMaps(search),
            apiDelete: (id: string) => mapApi.deleteMap(id),
            columns: [
                { key: 'mapImage', label: 'Imagem', type: 'image' },
                { key: 'mapName', label: 'Nome' },
                { key: 'mapDescription', label: 'Descrição', type: 'description' },
            ],
            filters: [],
            canAdd: true,
        },
        skins: {
            title: 'Skins',
            entity: 'skin',
            apiLoad: (search?: string, weaponId?: any) => skinApi.getAllSkins(search, weaponId),
            apiDelete: (id: string) => skinApi.deleteSkin(id),
            columns: [
                { key: 'skinImage', label: 'Imagem', type: 'image' },
                { key: 'skinName', label: 'Nome' },
                { key: 'weaponName', label: 'Arma' },
            ],
            filters: [{ key: 'weaponId', label: 'as Armas' }],
            canAdd: true,
        },
    };

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        if (!currentUser || currentUser.roleName !== 'Admin') {
            navigate('/');
            dialogService.error('Acesso restrito a administradores');
        }
    }, [navigate]);

    useEffect(() => {
        loadData();
        loadFilterOptions();
        setSearchTerm('');
        setFilters({});
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filters]);

    const loadFilterOptions = async () => {
        if (activeTab === 'weapons' || activeTab === 'skins') {
            try {
                const response = await weaponApi.getAllWeaponCategories();
                if (response.success) {
                    const options =
                        response.data?.map((c) => ({
                            id: c.categoryId,
                            name: c.categoryName,
                        })) || [];
                    setWeaponCategoryOptions(options);
                }
            } catch (error) {
                console.error('Error loading weapon categories:', error);
            }
        }

        if (activeTab === 'skins') {
            try {
                const response = await weaponApi.getAllWeapons();
                if (response.success) {
                    const options =
                        response.data?.map((w) => ({
                            id: w.weaponId,
                            name: w.weaponName,
                        })) || [];
                    setWeaponOptions(options);
                }
            } catch (error) {
                console.error('Error loading weapons:', error);
            }
        }
    };

    const loadData = async () => {
        const config = tabConfigs[activeTab];
        try {
            setIsLoading(true);
            const filterValue = Object.values(filters)[0];
            const response = await config.apiLoad(searchTerm, filterValue);

            if (response.success) {
                let processedData = (response.data || []).map((item: any) => {
                    const processed: any = { ...item };

                    if (activeTab === 'users') {
                        processed.fullName = `${item.firstName} ${item.lastName || ''}`;
                    } else if (activeTab === 'guides') {
                        processed.authorName = item.author?.nickname || '-';
                    } else if (activeTab === 'weapons') {
                        processed.categoryName = item.category?.categoryName;
                    } else if (activeTab === 'skins') {
                        processed.weaponName = item.weapon?.weaponName;
                    }

                    return processed;
                });

                setData(processedData);
            } else {
                throw new Error(response.message || `Erro ao carregar ${config.title.toLowerCase()}`);
            }
        } catch (error: any) {
            dialogService.error(error.message || `Erro ao carregar ${config.title.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getFilterOptions = (filterKey: string): FilterOption[] => {
        if (filterKey === 'categoryId') {
            return weaponCategoryOptions;
        } else if (filterKey === 'weaponId') {
            return weaponOptions;
        } else if (filterKey === 'guideType') {
            return guideTypeOptions;
        }
        return [];
    };

    const handleView = (id: number) => {
        navigate(`/${tabConfigs[activeTab].entity}/${id}`);
    };

    const handleEdit = (id: number) => {
        navigate(`/${tabConfigs[activeTab].entity}/edit/${id}`);
    };

    const handleAdd = () => {
        navigate(`/${tabConfigs[activeTab].entity}`);
    };

    const handleDelete = async (id: number) => {
        const config = tabConfigs[activeTab];
        try {
            dialogService.confirm('Confirmar Ação', `Tem certeza que deseja excluir este ${config.entity}?`, async () => {
                const response = await config.apiDelete(id.toString());

                if (response.success) {
                    dialogService.success(`${config.entity.charAt(0).toUpperCase() + config.entity.slice(1)} excluído com sucesso`);
                    loadData();
                } else {
                    throw new Error(response.message || `Erro ao excluir ${config.entity}`);
                }
            });
        } catch (error: any) {
            dialogService.error(error.message || `Erro ao excluir ${config.entity}`);
        }
    };

    const getItemId = (item: any): number => {
        switch (activeTab) {
            case 'users':
                return (item as UserDto).userId;
            case 'agents':
                return (item as AgentDto).agentId;
            case 'weapons':
                return (item as WeaponDto).weaponId;
            case 'guides':
                return (item as GuideDto).guideId;
            case 'maps':
                return (item as MapDto).mapId;
            case 'skins':
                return (item as SkinDto).skinId;
            default:
                return 0;
        }
    };

    const getImageUrl = (item: any, column: string): string => {
        const imageValue = item[column];
        return imageValue ? imageValue : '/logo.png';
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
    };

    const renderTable = () => {
        const config = tabConfigs[activeTab];

        if (isLoading) {
            return <div className="loading">Carregando {config.title.toLowerCase()}...</div>;
        }

        return (
            <div className={`${activeTab}-table-container`}>
                <table className={`${activeTab}-table`}>
                    <thead>
                        <tr>
                            {config.columns.map((col) => (
                                <th key={col.key} className={col.type === 'image' ? 'photo-column' : ''}>
                                    {col.label}
                                </th>
                            ))}
                            <th className="actions-column">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={config.columns.length + 1} className={`no-${activeTab}`}>
                                    Nenhum {config.entity} encontrado
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={getItemId(item)}>
                                    {config.columns.map((col) => {
                                        if (col.type === 'image') {
                                            return (
                                                <td key={col.key}>
                                                    <div
                                                        className={`${activeTab.slice(0, -1)}-photo`}
                                                        style={{
                                                            backgroundImage: `url(${getImageUrl(item, col.key)})`,
                                                        }}
                                                    />
                                                </td>
                                            );
                                        } else if (col.type === 'date') {
                                            return <td key={col.key}>{new Date(item[col.key]).toLocaleDateString()}</td>;
                                        } else if (col.type === 'description') {
                                            return (
                                                <td key={col.key} className="description-cell">
                                                    {item[col.key]}
                                                </td>
                                            );
                                        } else {
                                            return <td key={col.key}>{item[col.key]}</td>;
                                        }
                                    })}
                                    <td className="actions">
                                        <button className="view-button" onClick={() => handleView(getItemId(item))}>
                                            <i className="bx bx-show"></i>
                                        </button>
                                        <button className="edit-button" onClick={() => handleEdit(getItemId(item))}>
                                            <i className="bx bx-edit"></i>
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(getItemId(item))}>
                                            <i className="bx bx-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-panel-container" ref={containerRef}>
            <div className="admin-tabs">
                {Object.entries(tabConfigs).map(([key, config]) => (
                    <button key={key} className={`tab-button ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key as Tab)}>
                        {config.title}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                <div className={`${activeTab}-tab`}>
                    <div className="tab-header">
                        <h2>Gerenciamento de {tabConfigs[activeTab].title}</h2>
                        <div className="actions-container">
                            <div className="search-container">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder={`Buscar por ${activeTab === 'users' ? 'username' : 'nome'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {tabConfigs[activeTab].filters?.map((filter) => (
                                <div key={filter.key} className="select-container">
                                    <select
                                        className="filter-select"
                                        value={filters[filter.key] || ''}
                                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    >
                                        <option value="">{`Todos ${filter.label.toLowerCase()}`}</option>
                                        {getFilterOptions(filter.key).map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            {tabConfigs[activeTab].canAdd && (
                                <button className="add-button" onClick={handleAdd}>
                                    <i className="bx bx-plus"></i>
                                    Adicionar {tabConfigs[activeTab].entity.charAt(0).toUpperCase() + tabConfigs[activeTab].entity.slice(1)}
                                </button>
                            )}
                        </div>
                    </div>

                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
