import { Model } from 'mongoose';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from 'src/user/domain/interfaces/IUserRepository';
import {User as UserSchema, UserDocument} from '../schemas/user.schema';
import { UserDtoEntityInfrastructure } from '../dto/user.dto';
import { ProviderDataDtoEntity } from '../dto/providerData.dto';
import { SocialMediaDtoEntity } from '../dto/socialMedia.dto';
import { UpdateUserDtoEntity } from '../dto/update-user.dto';
import { UpdateProviderDataDtoEntity } from '../dto/update-providerData.dto';

@Injectable()
export class UserRepository implements IUserRepository{
    constructor(@InjectModel(UserSchema.name) private userModel: Model<UserDocument>) {}

    async save(entityDto: UserDtoEntityInfrastructure): Promise<UserDtoEntityInfrastructure> {
        const providerDataForDb = entityDto.getProviderData() ? this.mapProviderDataDtoToDb(entityDto.getProviderData()!) : undefined;

        const user = new this.userModel({
            name: entityDto.getName(),
            email: entityDto.getEmail(),
            phone: entityDto.getPhone(),
            password: entityDto.getPassword(),
            role: entityDto.getRole(),
            providerData: providerDataForDb,
            createdAt: entityDto.getCreatedAt()
        });

        const savedUser = await user.save();

        return this.mapDocumentToDto(savedUser);
    }

    async findByEmail(email: string): Promise<UserDtoEntityInfrastructure | null> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return null;
        }
        console.log('✓ Usuario encontrado');
        return this.mapDocumentToDto(user);
    }

    async findById(id: string): Promise<UserDtoEntityInfrastructure | null> {
        console.log(`📖 Repository: Buscando usuario por ID: ${id}`);

        const user = await this.userModel.findById(id);

        if (!user) {
            console.log('❌ Usuario no encontrado');
            return null;
        }

        console.log('✓ Usuario encontrado');
        return this.mapDocumentToDto(user);
    }

    async updateUser(id: string, updateUserDtoEntity: UpdateUserDtoEntity): Promise<UserDtoEntityInfrastructure> {
        const updateData = this.buildUpdateDataUser(updateUserDtoEntity);

        const updatedUser = await this.userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            console.log('❌ Usuario no encontrado');
            throw new NotFoundException('Usuario no encontrado');
        }

        console.log('✓ Usuario actualizado');
        return this.mapDocumentToDto(updatedUser);
    }

    async delete(id: string): Promise<void> {
        console.log(`🗑️ Repository: Eliminando usuario ${id}...`);

        const result = await this.userModel.findByIdAndDelete(id);

        if (!result) {
            console.log('❌ Usuario no encontrado');
            throw new Error('Usuario no encontrado');
        }

        console.log('✓ Usuario eliminado');
    }

    async findAll(): Promise<UserDtoEntityInfrastructure[]> {
        console.log('📖 Repository: Obteniendo todos los usuarios...');

        const users = await this.userModel.find();

        console.log(`✓ ${users.length} usuarios encontrados`);
        return users.map(user => this.mapDocumentToDto(user));
    }

    async findByRole(role: string): Promise<UserDtoEntityInfrastructure[]> {
        console.log(`📖 Repository: Buscando usuarios con rol: ${role}`);

        const users = await this.userModel.find({ role });

        console.log(`✓ ${users.length} usuarios encontrados`);
        return users.map(user => this.mapDocumentToDto(user));
    }

    async existsByEmail(email: string): Promise<boolean> {
        console.log(`🔍 Repository: Verificando si existe email: ${email}`);

        const exists = await this.userModel.exists({ email });

        return !!exists;
    } 

    private mapDocumentToDto(user: any): UserDtoEntityInfrastructure {
        return new UserDtoEntityInfrastructure(
            user.name,
            user.email,
            user.phone,
            user.password,
            user.role,
            user.providerData ? this.mapProviderDataToDto(user.providerData) : undefined,
            user.createdAt,
            user.id.toString()
        );
    }

    private mapProviderDataToDto(providerData: any): ProviderDataDtoEntity {
        return new ProviderDataDtoEntity(
            providerData.publicInfo,
            providerData.address,
            providerData.minimumAdvance,
            providerData.serviceType,
            providerData.socialMedia.map(
                (social: any) => new SocialMediaDtoEntity(social.platform, social.url)
            )
        );
    }

    private mapProviderDataDtoToDb(providerData: ProviderDataDtoEntity): {
        publicInfo: string;
        address: string;
        minimumAdvance: string;
        serviceType: string;
        socialMedia: { platform: string; url: string }[];
    } {
        return {
            publicInfo: providerData.getPublicInfo(),
            address: providerData.getAddress(),
            minimumAdvance: providerData.getMinimumAdvance(),
            serviceType: providerData.getServiceType(),
            socialMedia: providerData.getSocialMedia().map(social => ({
                platform: social.getPlatform(),
                url: social.getUrl(),
            })),
        };
    }

    private buildUpdateDataUser(userDtoEntity: UpdateUserDtoEntity): any {
        const updateData: any = { updatedAt: new Date(),};

        if (userDtoEntity.getName()) {
            updateData.name = userDtoEntity.getName();
        }

        if (userDtoEntity.getEmail()) {
            updateData.email = userDtoEntity.getEmail();
        }

        if (userDtoEntity.getPhone()) {
            updateData.phone = userDtoEntity.getPhone();
        }

        if (userDtoEntity.getPassword()) {
            updateData.password = userDtoEntity.getPassword();
        }

        if (userDtoEntity.getProviderData()) {
            const providerDataUpdate = this.mapUpdateProviderDataToDb(
                userDtoEntity.getProviderData()!
            );

            if (Object.keys(providerDataUpdate).length > 0) {
                updateData.providerData = providerDataUpdate;
            }
        }
        
        return updateData;
    }

    private mapUpdateProviderDataToDb(providerData: UpdateProviderDataDtoEntity): any {
    const result: any = {};

        if (providerData.getPublicInfo()) {
            result.publicInfo = providerData.getPublicInfo();
        }

        if (providerData.getAddress()) {
            result.address = providerData.getAddress();
        }

        if (providerData.getMinimumAdvance()) {
            result.minimumAdvance = providerData.getMinimumAdvance();
        }

        if (providerData.getServiceType()) {
            result.serviceType = providerData.getServiceType();
        }
        
        const socialMedia = providerData.getSocialMedia();
        if (socialMedia) {
            result.socialMedia = socialMedia.map(social => ({
                platform: social.getPlatform(),
                url: social.getUrl(),
            }));
        }

        return result;
    }
}