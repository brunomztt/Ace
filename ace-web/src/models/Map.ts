export interface IMap {
    mapId: number;
    mapName: string;
    mapDescription?: string;
    mapImage?: string;
}

export interface MapDto {
    mapId: number;
    mapName: string;
    mapDescription?: string;
    mapImage?: string;
}

export interface MapCreateDto {
    mapName: string;
    mapDescription?: string;
    mapImage?: string;
}

export interface MapUpdateDto {
    mapName: string;
    mapDescription?: string;
    mapImage?: string;
}
