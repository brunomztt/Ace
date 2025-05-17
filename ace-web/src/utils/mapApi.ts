import { MapDto, MapCreateDto, MapUpdateDto } from '../models/Map';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const mapApi = {
    getAllMaps: async (searchTerm?: string): Promise<ApiResponse<MapDto[]>> => {
        const params = searchTerm ? { searchTerm } : {};
        return api.get<ApiResponse<MapDto[]>>('/maps', { params });
    },

    getMapById: async (mapId: string): Promise<ApiResponse<MapDto>> => {
        return api.get<ApiResponse<MapDto>>(`/maps/${mapId}`);
    },

    createMap: async (mapData: MapCreateDto): Promise<ApiResponse<MapDto>> => {
        return api.post<ApiResponse<MapDto>>('/maps', mapData);
    },

    updateMap: async (mapId: string, updateData: MapUpdateDto): Promise<ApiResponse<MapDto>> => {
        return api.put<ApiResponse<MapDto>>(`/maps/${mapId}`, updateData);
    },

    deleteMap: async (mapId: string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/maps/${mapId}`);
    },
};

export default mapApi;
