import { AgentDto, AgentCreateDto } from '../models/Agent';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const agentApi = {
    getAllAgents: async (): Promise<ApiResponse<AgentDto[]>> => {
        return api.get<ApiResponse<AgentDto[]>>('/agents');
    },

    getAgentById: async (agentId: string): Promise<ApiResponse<AgentDto>> => {
        return api.get<ApiResponse<AgentDto>>(`/agents/${agentId}`);
    },

    createAgent: async (agentData: AgentCreateDto): Promise<ApiResponse<AgentDto>> => {
        return api.post<ApiResponse<AgentDto>>('/agents', agentData);
    },

    updateAgent: async (agentId: string, updateData: AgentCreateDto): Promise<ApiResponse<AgentDto>> => {
        return api.put<ApiResponse<AgentDto>>(`/agents/${agentId}`, updateData);
    },

    deleteAgent: async (agentId: string): Promise<ApiResponse<null>> => {
        return api.delete<ApiResponse<null>>(`/agents/${agentId}`);
    },
};

export default agentApi;
