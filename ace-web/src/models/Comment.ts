import { IGuide } from './Guide';
import { IUser, UserDto } from './User';

export interface CommentDto {
    commentId: number;
    entityType: string;
    entityId: number;
    commentText: string;
    commentDate: Date;
    author?: UserDto;
}

export interface CommentCreateDto {
    entityType: string;
    entityId: number;
    commentText: string;
}
