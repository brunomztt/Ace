import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.scss';
import authApi from '../../utils/authApi';
import userApi from '../../utils/userApi';
import { dialogService } from '../Dialog/dialogService';
import { UserDto } from '../../models/User';

type Tab = 'users' | 'agents' | 'weapons' | 'guides' | 'maps' | 'skins';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('users');
    const [users, setUsers] = useState<UserDto[]>([]);
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
        if (activeTab === 'users') {
            loadUsers();
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
                    <div className="placeholder-tab">
                        <h2>Gerenciamento de Agentes</h2>
                        <p>Esta funcionalidade será implementada em breve.</p>
                    </div>
                )}

                {activeTab === 'weapons' && (
                    <div className="placeholder-tab">
                        <h2>Gerenciamento de Armas</h2>
                        <p>Esta funcionalidade será implementada em breve.</p>
                    </div>
                )}

                {activeTab === 'guides' && (
                    <div className="placeholder-tab">
                        <h2>Gerenciamento de Guias</h2>
                        <p>Esta funcionalidade será implementada em breve.</p>
                    </div>
                )}

                {activeTab === 'maps' && (
                    <div className="placeholder-tab">
                        <h2>Gerenciamento de Mapas</h2>
                        <p>Esta funcionalidade será implementada em breve.</p>
                    </div>
                )}

                {activeTab === 'skins' && (
                    <div className="placeholder-tab">
                        <h2>Gerenciamento de Skins</h2>
                        <p>Esta funcionalidade será implementada em breve.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
