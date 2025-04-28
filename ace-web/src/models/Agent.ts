import { IAgentVideo } from './AgentVideo';

export interface IAgent {
    agentId: number;
    agentName: string;
    agentDescription?: string;
    abilityOne?: string;
    abilityOneDescription?: string;
    abilityTwo?: string;
    abilityTwoDescription?: string;
    abilityThree?: string;
    abilityThreeDescription?: string;
    ultimate?: string;
    ultimateDescription?: string;
    agentImage?: string;
    agentVideos?: IAgentVideo[];
}

export interface AgentDto {
    agentId: number;
    agentName: string;
    agentDescription?: string;
    abilityOne?: string;
    abilityOneDescription?: string;
    abilityTwo?: string;
    abilityTwoDescription?: string;
    abilityThree?: string;
    abilityThreeDescription?: string;
    ultimate?: string;
    ultimateDescription?: string;
    agentImage?: string;
    videos?: AgentVideoDto[];
}

export interface AgentVideoDto {
    videoId: number;
    youtubeLink: string;
}
