export interface IAddress {
    addressId: number | null;
    street: string;
    district: string;
    zipCode: string;
    houseNumber: string;
    complement?: string;
}

export interface AddressDto {
    addressId: number | null;
    street: string;
    district: string;
    zipCode: string;
    houseNumber: string;
    complement?: string;
}
