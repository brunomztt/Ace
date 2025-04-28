export interface IAddress {
    addressId: number;
    street: string;
    district: string;
    zipCode: string;
    houseNumber: string;
    complement?: string;
}

export interface AddressDto {
    addressId: number | undefined;
    street: string;
    district: string;
    zipCode: string;
    houseNumber: string;
    complement?: string;
}
