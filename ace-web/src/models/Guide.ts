import { IUser } from './User';

export type GuideType = 'Agent' | 'Map' | 'Weapon' | 'Other';

export interface IGuide {
    guideId: number;
    userId?: number;
    title: string;
    content: string;
    guideType: GuideType;
    createdAt: Date;
    user?: IUser;
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
