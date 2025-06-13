import React, { useState, useEffect } from 'react';
import commentApi from '../../utils/commentApi';
import authApi from '../../utils/authApi';
import { CommentDto } from '../../models/Comment';
import CommentItem from '../CommentItem/CommentItem';
import { dialogService } from '../Dialog/dialogService';
import './CommentModeration.scss';
import { useNavigate } from 'react-router-dom';

const CommentModeration: React.FC = () => {
    const navigate = useNavigate();
    const [pendingComments, setPendingComments] = useState<CommentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<'all' | 'Guide' | 'Weapon' | 'Map' | 'Agent'>('all');

    useEffect(() => {
        const usr = authApi.getCurrentUser();
        if (!usr) {
            navigate('/');
            dialogService.error('Acesso restrito a usuários autenticados');
        }
    }, [navigate]);

    const currentUser = authApi.getCurrentUser();
    const isModOrAdmin = currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator';

    useEffect(() => {
        if (!isModOrAdmin) {
            dialogService.error('Acesso negado');
            // Redirecionar para home se não for moderador/admin
            window.location.href = '/';
            return;
        }

        fetchPendingComments();
    }, [isModOrAdmin]);

    const fetchPendingComments = async () => {
        try {
            setIsLoading(true);
            const response = await commentApi.getPendingComments();

            if (response.success && response.data) {
                setPendingComments(response.data);
            } else {
                throw new Error(response.message || 'Erro ao carregar comentários pendentes');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao carregar comentários pendentes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommentUpdated = () => {
        fetchPendingComments();
    };

    const getFilteredComments = () => {
        if (filter === 'all') return pendingComments;
        return pendingComments.filter((comment) => comment.entityType === filter);
    };

    const getEntityTypeLabel = (entityType: string) => {
        switch (entityType) {
            case 'Guide':
                return 'Guia';
            case 'Weapon':
                return 'Arma';
            case 'Map':
                return 'Mapa';
            case 'Agent':
                return 'Agente';
            default:
                return entityType;
        }
    };

    if (isLoading) {
        return (
            <div className="comment-moderation">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Carregando comentários pendentes...</p>
                </div>
            </div>
        );
    }

    const filteredComments = getFilteredComments();

    return (
        <div className="comment-moderation">
            <div className="moderation-header">
                <h1>Moderação de Comentários</h1>
                <div className="pending-count">
                    <span className="material-symbols-outlined">pending</span>
                    <span>{pendingComments.length} comentários aguardando aprovação</span>
                </div>
            </div>

            <div className="moderation-filters">
                <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                    Todos ({pendingComments.length})
                </button>
                <button className={`filter-button ${filter === 'Guide' ? 'active' : ''}`} onClick={() => setFilter('Guide')}>
                    Guias ({pendingComments.filter((c) => c.entityType === 'Guide').length})
                </button>
                <button className={`filter-button ${filter === 'Weapon' ? 'active' : ''}`} onClick={() => setFilter('Weapon')}>
                    Armas ({pendingComments.filter((c) => c.entityType === 'Weapon').length})
                </button>
                <button className={`filter-button ${filter === 'Map' ? 'active' : ''}`} onClick={() => setFilter('Map')}>
                    Mapas ({pendingComments.filter((c) => c.entityType === 'Map').length})
                </button>
                <button className={`filter-button ${filter === 'Agent' ? 'active' : ''}`} onClick={() => setFilter('Agent')}>
                    Agentes ({pendingComments.filter((c) => c.entityType === 'Agent').length})
                </button>
            </div>

            <div className="moderation-content">
                {filteredComments.length === 0 ? (
                    <div className="no-pending">
                        <span className="material-symbols-outlined">check_circle</span>
                        <h2>Tudo em dia!</h2>
                        <p>
                            {filter === 'all'
                                ? 'Não há comentários pendentes de aprovação.'
                                : `Não há comentários de ${getEntityTypeLabel(filter)} pendentes.`}
                        </p>
                    </div>
                ) : (
                    <div className="pending-list">
                        {filteredComments.map((comment) => (
                            <div key={comment.commentId} className="pending-item">
                                <div className="pending-meta">
                                    <span className="entity-badge">{getEntityTypeLabel(comment.entityType)}</span>
                                    <span className="entity-id">#{comment.entityId}</span>
                                    <span className="submission-date">Enviado em {new Date(comment.commentDate).toLocaleString('pt-BR')}</span>
                                </div>
                                <CommentItem comment={comment} onCommentUpdated={handleCommentUpdated} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentModeration;
