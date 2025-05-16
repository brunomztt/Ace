export interface IWeapon {
    weaponId: number;
    weaponName: string;
    categoryId: number;
    credits: number;
    wallPenetration: string;
    weaponImage?: string;
    weaponDescription?: string;
    fireMode?: string;
    fireRate?: number;
    runSpeed?: number;
    equipSpeed?: number;
    reloadSpeed?: number;
    magazineSize?: number;
    reserveAmmo?: number;
    firstShotSpread?: number;
    damageHeadClose?: number;
    damageBodyClose?: number;
    damageLegClose?: number;
    damageHeadFar?: number;
    damageBodyFar?: number;
    damageLegFar?: number;
    category?: IWeaponCategory;
}

export interface IWeaponCategory {
    categoryId: number;
    categoryName: string;
}

export interface WeaponDto {
    weaponId: number;
    weaponName: string;
    categoryId: number;
    credits: number;
    wallPenetration: string;
    weaponImage?: string;
    weaponDescription?: string;
    fireMode?: string;
    fireRate?: number;
    runSpeed?: number;
    equipSpeed?: number;
    reloadSpeed?: number;
    magazineSize?: number;
    reserveAmmo?: number;
    firstShotSpread?: number;
    damageHeadClose?: number;
    damageBodyClose?: number;
    damageLegClose?: number;
    damageHeadFar?: number;
    damageBodyFar?: number;
    damageLegFar?: number;
    category?: WeaponCategoryDto;
}

export interface WeaponCategoryDto {
    categoryId: number;
    categoryName: string;
}

export interface WeaponCreateDto {
    weaponName: string;
    categoryId: number;
    credits: number;
    wallPenetration: string;
    weaponImage?: string;
    weaponDescription?: string;
    fireMode?: string;
    fireRate?: number;
    runSpeed?: number;
    equipSpeed?: number;
    reloadSpeed?: number;
    magazineSize?: number;
    reserveAmmo?: number;
    firstShotSpread?: number;
    damageHeadClose?: number;
    damageBodyClose?: number;
    damageLegClose?: number;
    damageHeadFar?: number;
    damageBodyFar?: number;
    damageLegFar?: number;
}

export interface WeaponUpdateDto {
    weaponName: string;
    categoryId: number;
    credits: number;
    wallPenetration: string;
    weaponImage?: string;
    weaponDescription?: string;
    fireMode?: string;
    fireRate?: number;
    runSpeed?: number;
    equipSpeed?: number;
    reloadSpeed?: number;
    magazineSize?: number;
    reserveAmmo?: number;
    firstShotSpread?: number;
    damageHeadClose?: number;
    damageBodyClose?: number;
    damageLegClose?: number;
    damageHeadFar?: number;
    damageBodyFar?: number;
    damageLegFar?: number;
}
