import React, { useState, useEffect } from 'react';
import { userApi } from '../../utils/userApi';
import { dialogService } from '../Dialog/dialogService';
import { UserDto } from '../../models/User';
import { CommentDto } from '../../models/Comment';
import './UserProfile.scss';

interface UserProfileProps {
    userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userComments, setUserComments] = useState<CommentDto[]>([]);
    const [userData, setUserData] = useState<{
        firstName: string;
        lastName: string;
        nickname: string;
        email: string;
        phoneNumber: string;
        profilePic: string | null;
        bannerImg: string | null;
        location: string;
        tipsCount: number;
    }>({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        phoneNumber: '',
        profilePic: null,
        bannerImg: null,
        location: '',
        tipsCount: 0,
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await userApi.getUserById(userId);
                if (response.success && response.data) {
                    const user: UserDto = response.data;
                    console.log(user);
                    const comments = user.comments || [];

                    setUserComments(comments);
                    setUserData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        nickname: user.nickname || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        profilePic: user.profilePic || null,
                        bannerImg: user.bannerImg || null,
                        location: formatLocation(user.address),
                        tipsCount: comments.length,
                    });
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar informações do usuário');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const formatLocation = (address: any): string => {
        if (!address) return 'Localização desconhecida';
        const district = address.district || '';
        const city = address.city || '';
        const state = address.state || '';

        if (district && (city || state)) {
            return `${district}, ${city || state}`;
        }
        return district || city || state || 'Localização desconhecida';
    };

    const getEntityTypeIcon = (entityType: string) => {
        switch (entityType) {
            case 'Guide':
                return 'book';
            case 'Map':
                return 'map';
            case 'Weapon':
                return 'local_fire_department';
            case 'Agent':
                return 'user';
            default:
                return 'message';
        }
    };

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getEntityTypeName = (entityType: string) => {
        switch (entityType) {
            case 'Guide':
                return 'Guia';
            case 'Map':
                return 'Mapa';
            case 'Weapon':
                return 'Arma';
            case 'Agent':
                return 'Agente';
            default:
                return entityType;
        }
    };

    if (isLoading) {
        return (
            <div className="profile-loading">
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

    return (
        <div className="profile-container">
            <div className="profile-background" style={userData.bannerImg ? { backgroundImage: `url(${userData.bannerImg})` } : {}}></div>

            <div className="profile-header">
                <div className="profile-identity">
                    <div className="profile-avatar" style={userData.profilePic ? { backgroundImage: `url(${userData.profilePic})` } : {}}>
                        {!userData.profilePic && (userData.firstName[0] || '') + (userData.lastName[0] || '')}
                        <div className="avatar-frame-top"></div>
                        <div className="avatar-frame-bottom"></div>
                        <div className="avatar-frame-left"></div>
                        <div className="avatar-frame-right"></div>
                    </div>

                    <div className="profile-name-container">
                        <div className="profile-codename">
                            <div className="code-label">AGENTE</div>
                            <h1 className="profile-name">{userData.nickname}</h1>
                        </div>
                        <div className="profile-full-name">
                            {userData.firstName} {userData.lastName}
                            <div className="name-underline"></div>
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat-card">
                        <div className="stat-value">{userData.tipsCount}</div>
                        <div className="stat-label">DICAS</div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-section info-section">
                    <div className="section-title">
                        <span className="material-symbols-outlined">info</span>
                        INFORMAÇÕES DO AGENTE
                        <div className="title-accent"></div>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label">
                                <span className="material-symbols-outlined">mail</span>
                                EMAIL
                            </div>
                            <div className="info-value">{userData.email || 'Não informado'}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">
                                <span className="material-symbols-outlined">call</span>
                                TELEFONE
                            </div>
                            <div className="info-value">{userData.phoneNumber || 'Não informado'}</div>
                        </div>

                        <div className="info-item">
                            <div className="info-label">
                                <span className="material-symbols-outlined">location_on</span>
                                LOCALIZAÇÃO
                            </div>
                            <div className="info-value">{userData.location}</div>
                        </div>
                    </div>
                </div>

                <div className="profile-section activity-section">
                    <div className="section-title">
                        <span className="material-symbols-outlined">history</span>
                        DICAS RECENTES
                        <div className="title-accent"></div>
                    </div>

                    {userComments.length === 0 ? (
                        <div className="no-activity">
                            <span className="material-symbols-outlined">search_off</span>
                            <p>Nenhuma dica encontrada</p>
                            <div className="action-hint">As dicas do usuário serão exibidas aqui</div>
                        </div>
                    ) : (
                        <div className="recent-comments">
                            {userComments.slice(0, 5).map((comment) => (
                                <div key={comment.commentId} className="recent-comment-item">
                                    <div className="comment-entity-type">
                                        <span className="material-symbols-outlined">{getEntityTypeIcon(comment.entityType)}</span>
                                        <div className="entity-badge">{getEntityTypeName(comment.entityType)}</div>
                                    </div>
                                    <div className="comment-content">
                                        <div className="comment-text">{comment.commentText}</div>
                                        <div className="comment-date">{formatDate(comment.commentDate)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
