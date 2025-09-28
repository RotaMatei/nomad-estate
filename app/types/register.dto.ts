import { RoleEnum } from "../enums";

export interface RegisterDto {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    role: RoleEnum;
    countryId: number;
    cityId: number;
    stateId: number;
}