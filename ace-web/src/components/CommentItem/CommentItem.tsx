import React, { useState } from 'react';
import './CommentItem.scss';
import { CommentDto } from '../../models/Comment';
import authApi from '../../utils/authApi';
import commentApi from '../../utils/commentApi';
import { dialogService } from '../Dialog/dialogService';

interface CommentItemProps {
    comment: CommentDto;
    onCommentUpdated: () => void;
    showActions?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onCommentUpdated, showActions = true }) => {
    const [isReviewing, setIsReviewing] = useState(false);
    const [showRejectReason, setShowRejectReason] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const currentUser = authApi.getCurrentUser();
    const isModOrAdmin = currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator';
    const isAuthor = currentUser?.userId === comment.author?.userId;

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

    const handleApprove = async () => {
        setIsReviewing(true);
        try {
            const response = await commentApi.reviewComment(comment.commentId, {
                approve: true,
            });

            if (response.success) {
                dialogService.success('Comentário aprovado com sucesso');
                onCommentUpdated();
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao aprovar comentário');
        } finally {
            setIsReviewing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim() && showRejectReason) {
            dialogService.error('Por favor, forneça uma razão para a rejeição');
            return;
        }

        if (!showRejectReason) {
            setShowRejectReason(true);
            return;
        }

        setIsReviewing(true);
        try {
            const response = await commentApi.reviewComment(comment.commentId, {
                approve: false,
                rejectedReason: rejectReason.trim(),
            });

            if (response.success) {
                dialogService.success('Comentário rejeitado');
                onCommentUpdated();
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao rejeitar comentário');
        } finally {
            setIsReviewing(false);
            setShowRejectReason(false);
            setRejectReason('');
        }
    };

    const handleDelete = async () => {
        dialogService.confirm('Ação irreversível', 'Tem certeza que deseja excluir este comentário?', async () => {
            try {
                const response = await commentApi.deleteComment(comment.commentId);
                if (response.success) {
                    dialogService.success('Comentário excluído com sucesso');
                    onCommentUpdated();
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao excluir comentário');
            }
        });
    };

    const getStatusBadge = () => {
        switch (comment.status) {
            case 'pending':
                return <span className="status-badge pending">Aguardando aprovação</span>;
            case 'rejected':
                return <span className="status-badge rejected">Rejeitado</span>;
            default:
                return null;
        }
    };

    return (
        <div className={`comment-item ${comment.status}`}>
            <div className="comment-header">
                <div className="comment-author">
                    <div className="author-avatar">{comment.author ? getInitials(comment.author.nickname) : 'AN'}</div>
                    <span className="author-name">{comment.author ? comment.author.nickname : 'ANÔNIMO'}</span>
                    {getStatusBadge()}
                </div>
                <div className="comment-meta">
                    <span className="comment-date">{formatDate(comment.commentDate)}</span>
                    {showActions && (isAuthor || isModOrAdmin) && (
                        <button className="delete-button" onClick={handleDelete} title="Excluir comentário">
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="comment-text">{comment.commentText}</div>

            {comment.status === 'rejected' && comment.rejectedReason && isAuthor && (
                <div className="rejection-reason">
                    <span className="material-symbols-outlined">info</span>
                    <span>Motivo da rejeição: {comment.rejectedReason}</span>
                </div>
            )}

            {showActions && isModOrAdmin && comment.status === 'pending' && (
                <div className="moderation-actions">
                    <button className="approve-button" onClick={handleApprove} disabled={isReviewing}>
                        <span className="material-symbols-outlined">check_circle</span>
                        Aprovar
                    </button>
                    <button className="reject-button" onClick={handleReject} disabled={isReviewing}>
                        <span className="material-symbols-outlined">cancel</span>
                        Rejeitar
                    </button>
                </div>
            )}

            {showRejectReason && (
                <div className="reject-reason-form">
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Motivo da rejeição..."
                        rows={2}
                        maxLength={255}
                    />
                    <div className="reject-actions">
                        <button
                            onClick={() => {
                                setShowRejectReason(false);
                                setRejectReason('');
                            }}
                        >
                            Cancelar
                        </button>
                        <button onClick={handleReject} disabled={!rejectReason.trim()}>
                            Confirmar Rejeição
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentItem;
