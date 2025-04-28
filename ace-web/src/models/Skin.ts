export type SkinType = 'Weapon' | 'Agent';

export interface ISkin {
    skinId: number;
    skinName: string;
    skinType: SkinType;
    skinImage?: string;
    description?: string;
}

export interface SkinDto {
    skinId: number;
    skinName: string;
    skinType: SkinType;
    skinImage?: string;
    description?: string;
}
