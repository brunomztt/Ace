import { IUser } from './User';
import { IComment } from './Comment';

export type GuideType = 'Agent' | 'Map' | 'Strategy' | 'Other';

export interface IGuide {
    guideId: number;
    userId?: number;
    title: string;
    content: string;
    guideType: GuideType;
    createdAt: Date;
    user?: IUser;
    comments?: IComment[];
}

export interface UserSummaryDto {
    userId: number;
    nickname: string;
}

export interface GuideDto {
    guideId: number;
    title: string;
    content: string;
    guideType: GuideType;
    createdAt: Date;
    author?: UserSummaryDto;
    comments?: CommentDto[];
}

export interface GuideCreateDto {
    title: string;
    content: string;
    guideType: GuideType;
}

export interface CommentDto {
    commentId: number;
    commentText: string;
    commentDate: Date;
    author?: UserSummaryDto;
}

export interface CommentCreateDto {
    guideId: number;
    commentText: string;
}
