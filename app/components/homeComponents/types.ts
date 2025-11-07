import { UserRoleEnum } from "./enums";

export interface UserProfile {
    firstName: string,
    lastName: string,
    role: UserRoleEnum,
    email: string,
    emailVerified: boolean,
    phoneNumber: string,
    phoneNumberVerified: boolean,
    birthDate: Date,
}