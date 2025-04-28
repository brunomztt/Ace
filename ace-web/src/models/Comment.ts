import { IGuide } from './Guide';
import { IUser } from './User';

export interface IComment {
    commentId: number;
    guideId?: number;
    userId?: number;
    commentText: string;
    commentDate: Date;
    guide?: IGuide;
    user?: IUser;
}
