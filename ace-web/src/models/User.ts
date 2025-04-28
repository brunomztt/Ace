import { IAddress, AddressDto } from './Address';
import { IRole, RoleDto } from './Role';

export interface IUser {
    userId: number;
    roleId?: number;
    isEnabled: boolean;
    firstName: string;
    lastName: string;
    nickname: string;
    cpf: string;
    phoneNumber?: string;
    email: string;
    password: string;
    profilePic?: string;
    bannerImg?: string;
    addressId?: number;
    birthDate?: string;
    role?: IRole;
    address?: IAddress;
}

export interface UserLoginDto {
    nickname: string;
    password: string;
}

export interface UserRegistrationDto {
    firstName: string;
    lastName?: string;
    nickname: string;
    cpf: string;
    phoneNumber?: string;
    email: string;
    password: string;
    profilePic?: string;
    bannerImg?: string;
    address?: AddressDto;
}

export interface UserUpdateDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    profilePic?: string;
    bannerImg?: string;
    birthDate?: string;
    address?: AddressDto;
}

export interface UserDto {
    userId: number;
    firstName: string;
    lastName: string;
    nickname: string;
    cpf: string;
    email: string;
    phoneNumber?: string;
    profilePic?: string;
    bannerImg?: string;
    isEnabled: boolean;
    birthDate?: string;
    role?: RoleDto;
    address?: AddressDto;
    password?: string;
}

export interface LoginResponseDto {
    userId: number;
    nickname: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
    roleName: string;
    token: string;
}
