import { IAddress, AddressDto } from './Address';
import { IRole, RoleDto } from './Role';

export interface IUser {
    userId: number;
    roleId?: number;
    isEnabled: boolean;
    fullName: string;
    nickname: string;
    cpf: string;
    phoneNumber?: string;
    email: string;
    password: string;
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
    fullName: string;
    nickname: string;
    cpf: string;
    phoneNumber?: string;
    email: string;
    password: string;
    address?: AddressDto;
}

export interface UserUpdateDto {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    birthDate?: string;
    address?: AddressDto;
}

export interface UserDto {
    userId: number;
    fullName: string;
    nickname: string;
    cpf: string;
    email: string;
    phoneNumber?: string;
    isEnabled: boolean;
    birthDate?: string;
    role?: RoleDto;
    address?: AddressDto;
}

export interface LoginResponseDto {
    userId: number;
    nickname: string;
    fullName: string;
    email: string;
    roleName: string;
    token: string;
}
