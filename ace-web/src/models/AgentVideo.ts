import { IAgent } from './Agent';
export interface IAgentVideo {
    videoId: number;
    agentId?: number;
    youtubeLink: string;
    agent?: IAgent;
}
