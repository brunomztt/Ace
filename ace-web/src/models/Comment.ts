export interface CommentDto {
    commentId: number;
    entityType: string;
    entityId: number;
    commentText: string;
    commentDate: Date;
    status: 'pending' | 'approved' | 'rejected';
    rejectedReason?: string;
    reviewedAt?: Date;
    author?: UserSummaryDto;
    reviewer?: UserSummaryDto;
}

export interface CommentCreateDto {
    entityType: string;
    entityId: number;
    commentText: string;
}

export interface CommentReviewDto {
    approve: boolean;
    rejectedReason?: string;
}

export interface UserSummaryDto {
    userId: number;
    nickname: string;
}
