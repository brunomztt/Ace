import React, { useState, useEffect } from 'react';
import { userApi } from '../../utils/userApi';
import { dialogService } from '../Dialog/dialogService';
import { UserDto } from '../../models/User';
import './UserProfile.scss';

interface UserProfileProps {
    userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState<{
        firstName: string;
        lastName: string;
        nickname: string;
        username: string;
        email: string;
        phoneNumber: string;
        profilePic: string | null;
        bannerImg: string | null;
        location: string;
        stats: {
            tips: number;
            visits: number;
        };
        lastPost: {
            id: string;
            title: string;
            coverImage: string;
        };
    }>({
        firstName: '',
        lastName: '',
        nickname: '',
        username: '',
        email: '',
        phoneNumber: '',
        profilePic: null,
        bannerImg: null,
        location: '',
        stats: {
            tips: 0,
            visits: 0,
        },
        lastPost: {
            id: '',
            title: '',
            coverImage: '',
        },
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const response = await userApi.getUserById(userId);
                if (response.success && response.data) {
                    const user: UserDto = response.data;

                    setUserData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        nickname: user.nickname || '',
                        username: user.nickname || '',
                        email: user.email || '',
                        phoneNumber: user.phoneNumber || '',
                        profilePic: user.profilePic || null,
                        bannerImg: user.bannerImg || null,
                        location: formatLocation(user.address),
                        stats: {
                            tips: 0,
                            visits: 0,
                        },
                        lastPost: {
                            id: '',
                            title: 'No posts yet',
                            coverImage: '',
                        },
                    });
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Error loading user information');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const formatLocation = (address: any): string => {
        if (!address) return '';
        const district = address.district || '';
        const city = address.city || '';
        const state = address.state || '';

        if (district && (city || state)) {
            return `${district}, ${city || state}`;
        }
        return district || city || state || '';
    };

    const handleViewPost = () => {
        if (userData.lastPost.id) {
            window.location.href = `/posts/${userData.lastPost.id}`;
        }
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="loading">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="profile-card">
                <div className="profile-header" style={userData.bannerImg ? { background: `url(${userData.bannerImg}) center/cover` } : {}}>
                    <div className="main-profile">
                        <div
                            className="profile-image"
                            style={userData.profilePic ? { background: `url(${userData.profilePic}) center/cover` } : {}}
                        ></div>
                        <div className="profile-names">
                            <h1 className="username">
                                {userData.firstName} {userData.lastName}
                            </h1>
                            <small className="page-title">({userData.nickname})</small>
                        </div>
                    </div>
                </div>

                <div className="profile-body">
                    <div className="profile-actions">
                        <div className="infos-profile">
                            <p>
                                <i className="fa fa-map-marker-alt"></i> Localização: {userData.location}
                            </p>
                            <p>
                                <i className="fa fa-phone"></i> Telefone: {userData.phoneNumber}
                            </p>
                            <p>
                                <i className="fa fa-envelope"></i> Email: {userData.email}
                            </p>
                        </div>
                    </div>

                    <div className="account-info">
                        <div className="data">
                            <div className="other-data">
                                <section className="data-item">
                                    <h3 className="value">{userData.stats.tips}</h3>
                                    <small className="title">Dicas</small>
                                </section>
                                <section className="data-item">
                                    <h3 className="value">{userData.stats.visits}</h3>
                                    <small className="title">Visitas</small>
                                </section>
                            </div>
                        </div>

                        <div className="last-post">
                            <div
                                className="post-cover"
                                style={userData.lastPost.coverImage ? { background: `url(${userData.lastPost.coverImage}) center/cover` } : {}}
                            >
                                <span className="last-badge">Última dica</span>
                            </div>
                            <h3 className="post-title">{userData.lastPost.title}</h3>
                            <button className="post-CTA" onClick={handleViewPost}>
                                Ver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
