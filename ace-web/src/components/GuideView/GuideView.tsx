import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import guideApi from '../../utils/guideApi';
import commentApi from '../../utils/commentApi';
import { GuideDto } from '../../models/Guide';
import { CommentDto } from '../../models/Comment';
import { dialogService } from '../Dialog/dialogService';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './GuideView.scss';
import authApi from '../../utils/authApi';
import CommentForm from '../CommentForm/CommentForm';

interface GuideViewProps {
    guideId: string;
}

const GuideView: React.FC<GuideViewProps> = ({ guideId }) => {
    const navigate = useNavigate();
    const [guide, setGuide] = useState<GuideDto | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
    const [parsedContent, setParsedContent] = useState<string>('');
    const [isModOrAdmin, setIsModOrAdmin] = useState<boolean>(false);

    useEffect(() => {
        const currentUser = authApi.getCurrentUser();
        setIsModOrAdmin(currentUser?.roleName === 'Admin' || currentUser?.roleName === 'Moderator');
    }, []);

    useEffect(() => {
        const fetchGuide = async () => {
            if (!guideId) return;

            try {
                setIsLoading(true);
                const response = await guideApi.getGuideById(guideId);

                if (response.success && response.data) {
                    setGuide(response.data);
                    const rawMarkup = marked.parse(response.data.content);
                    if (rawMarkup instanceof Promise) {
                        rawMarkup.then((result) => {
                            setParsedContent(DOMPurify.sanitize(result));
                        });
                    } else {
                        setParsedContent(DOMPurify.sanitize(rawMarkup));
                    }

                    fetchComments();
                } else {
                    throw new Error(response.message || 'Falha ao carregar guia');
                }
            } catch (error: any) {
                dialogService.error(error.message || 'Erro ao carregar guia');
                navigate('/guides');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                setIsLoadingComments(true);
                const response = await commentApi.getCommentsByEntity('Guide', guideId);

                if (response.success && response.data) {
                    setComments(response.data);
                }
            } catch (error: any) {
                console.error('Erro ao carregar comentários:', error);
            } finally {
                setIsLoadingComments(false);
            }
        };

        fetchGuide();
    }, [guideId, navigate]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Agent':
                return 'bx bx-user';
            case 'Map':
                return 'bx bx-map-alt';
            case 'Weapon':
                return 'bx bx-target-lock';
            case 'Other':
            default:
                return 'bx bx-book-open';
        }
    };

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
            const response = await commentApi.getCommentsByEntity('Guide', guideId);
            if (response.success && response.data) {
                setComments(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar comentários:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="guide-view-loading">
                <div className="loading-container">
                    <div className="loading-icon">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="loading-text">ACESSANDO ARQUIVOS</div>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="guide-view-error">
                <div className="error-container">
                    <div className="error-label">GUIA NÃO ENCONTRADO</div>
                    <div className="error-code">ERRO #404</div>
                    <p>O guia solicitado não existe em nossa base de dados ou foi removido.</p>
                    <button className="return-button" onClick={() => navigate('/guides')}>
                        <span className="material-symbols-outlined">arrow_back</span>
                        VOLTAR
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="guide-view-container">
            <div className="guide-view-header">
                <div className="guide-title-wrapper">
                    <h1 className="guide-title" data-text={guide.title}>
                        {guide.title}
                    </h1>
                    <div className="guide-title-accent"></div>
                </div>
                <div className="guide-type-badge" data-type={guide.guideType}>
                    <i className={`${getTypeIcon(guide.guideType)}`}></i>
                    <span>{guide.guideType}</span>
                </div>
                <div className="guide-metadata">
                    <div className="author-info">
                        <div className="author-avatar">{guide.author ? getInitials(guide.author.nickname) : 'AN'}</div>
                        <div className="author-details">
                            <span className="author-name">{guide.author ? guide.author.nickname : 'ANÔNIMO'}</span>
                            <span className="guide-date">{formatDate(guide.createdAt)}</span>
                        </div>
                    </div>
                    <div className="comments-count">
                        <i className="bx bx-comment"></i>
                        <span>{comments.length} DICAS</span>
                    </div>
                </div>
            </div>

            <div className="guide-view-content">
                <div className="guide-card">
                    <div className="guide-content">
                        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: parsedContent }} />
                    </div>
                </div>

                <div className="guide-comments-section">
                    <div className="section-heading">
                        <h2>DICAS DA MODERAÇÃO</h2>
                        <div className="section-heading-accent"></div>
                    </div>

                    {isModOrAdmin && (
                        <CommentForm entityType="Guide" entityId={parseInt(guideId)} onCommentAdded={handleCommentAdded} darkMode={true} />
                    )}

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
                                    <p>Nenhuma dica disponível para este guia.</p>
                                    <div className="hint">Nossos moderadores ainda não adicionaram dicas para este guia.</div>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.commentId} className="comment-item">
                                        <div className="comment-header">
                                            <div className="comment-author">
                                                <div className="author-avatar">{comment.author ? getInitials(comment.author.nickname) : 'AN'}</div>
                                                <span className="author-name">{comment.author ? comment.author.nickname : 'ANÔNIMO'}</span>
                                            </div>
                                            <span className="comment-date">{formatDate(comment.commentDate)}</span>
                                        </div>
                                        <div className="comment-text">{comment.commentText}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideView;
