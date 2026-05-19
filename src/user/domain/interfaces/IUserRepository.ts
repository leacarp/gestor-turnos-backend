import { UserEntity } from "../entities/user.entity";

export interface MpCredentialsData {
    mpAccessToken: string;
    mpRefreshToken?: string;
    mpUserId: string;
    mpConnected: boolean;
    mpTokenExpiresAt?: Date;
}

export interface IUserRepository{
    save(user: UserEntity) : Promise<UserEntity>;
    existsByEmail(email: string): Promise<boolean>;
    existsByPhone(phone : string) : Promise<boolean>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    updateUser(id: string, updateUserDtoEntity: UserEntity): Promise<UserEntity>
    deleteUser(id: string, role : string) : Promise<void>;
    findAllUsers(): Promise<UserEntity[]>;
    updateMpCredentials(userId: string, data: MpCredentialsData): Promise<void>;
}