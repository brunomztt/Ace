import React, { useState } from 'react';
import { CommentCreateDto } from '../../models/Comment';
import commentApi from '../../utils/commentApi';
import { dialogService } from '../Dialog/dialogService';
import './CommentForm.scss';

interface CommentFormProps {
    entityType: string;
    entityId: number;
    onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ entityType, entityId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) {
            dialogService.error('O comentário não pode estar vazio');
            return;
        }

        setIsSubmitting(true);

        try {
            const commentData: CommentCreateDto = {
                entityType,
                entityId,
                commentText: commentText.trim(),
            };

            const response = await commentApi.addComment(commentData);

            if (response.success) {
                setCommentText('');
                onCommentAdded();
                dialogService.success('Dica adicionada com sucesso!');
            } else {
                throw new Error(response.message || 'Erro ao adicionar dica');
            }
        } catch (error: any) {
            dialogService.error(error.message || 'Erro ao adicionar dica');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`comment-form-container dark-mode`}>
            <h3 className="form-title">ADICIONAR DICA</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="comment-textarea"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Compartilhe sua dica ou informação relevante..."
                    rows={4}
                    maxLength={500}
                    disabled={isSubmitting}
                ></textarea>
                <div className="form-footer">
                    <div className="char-count">{commentText.length}/500</div>
                    <button type="submit" className="submit-button" disabled={isSubmitting || !commentText.trim()}>
                        {isSubmitting ? (
                            <>
                                <span className="loading-spinner"></span>
                                ENVIANDO...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                ENVIAR
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
