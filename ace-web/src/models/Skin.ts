import { WeaponDto } from './Weapon';

export interface ISkin {
    skinId: number;
    skinName: string;
    weaponId: number;
    skinImage?: string;
    description?: string;
    weapon?: WeaponDto;
}

export interface SkinDto {
    skinId: number;
    skinName: string;
    weaponId: number;
    skinImage?: string;
    description?: string;
    weapon?: WeaponDto;
}

export interface SkinCreateDto {
    skinName: string;
    weaponId: number;
    skinImage?: string;
    description?: string;
}

export interface SkinUpdateDto {
    skinName: string;
    weaponId: number;
    skinImage?: string;
    description?: string;
}
