import { Model } from 'mongoose';
import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUserRepository } from 'src/user/domain/interfaces/IUserRepository';
import {User as UserSchema, UserDocument} from '../schemas/user.schema';
import { UserEntity } from 'src/user/domain/entities/user.entity';
import { ProviderDataEntity } from 'src/user/domain/entities/providerData.entity';
import { SocialMediaLinkEntity } from 'src/user/domain/entities/socialMediaLink.entity';

@Injectable()
export class UserRepository implements IUserRepository{
    constructor(@InjectModel(UserSchema.name) private userModel: Model<UserDocument>) {}

    async save(user: UserEntity): Promise<UserEntity> {
        const providerDataForDb = user.getProviderData() ? this.mapProviderDataDtoToEntity(user.getProviderData()!) : undefined;

        const doc = new this.userModel({
            name: user.getName(),
            email: user.getEmail(),
            phone: user.getPhone(),
            password: user.getPassword(),
            role: user.getRole(),
            providerData: providerDataForDb,
        });

        const saved = await doc.save();
        return this.mapDocumentToEntity(saved);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return null;
        }
        console.log('✓ Usuario encontrado');
        return this.mapDocumentToEntity(user);
    }

    async findById(id: string): Promise<UserEntity | null> {
        console.log(`📖 Repository: Buscando usuario por ID: ${id}`);

        const user = await this.userModel.findById(id);

        if (!user) {
            console.log('❌ Usuario no encontrado');
            return null;
        }

        console.log('✓ Usuario encontrado');
        return this.mapDocumentToEntity(user);
    }

    async updateUser(id: string, user: UserEntity): Promise<UserEntity> {
        const updateData = this.buildUpdateDataUser(user);

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
        return this.mapDocumentToEntity(updatedUser);
    }

    async deleteUser(id: string, role : string): Promise<void> {
        
        if (role === 'provider') {
        console.log('📦 Marcando provider como inactivo (soft delete)');
        const result = await this.userModel.findByIdAndUpdate(
            id,
            {
                isActive: false,
                deletedAt: new Date(),
            },
            { new: true }
        );

        if (!result) {
            throw new NotFoundException('Provider no encontrado');
        }
        } else {
            console.log('🗑️ Eliminando usuario completamente de BD');
            const result = await this.userModel.findByIdAndDelete(id);
                if (!result) {
                    console.log('❌ Usuario no encontrado');
                    throw new NotFoundException('Usuario no encontrado');
                }
        }
    }

    async findAllUsers(): Promise<UserEntity[]> {
        console.log('📖 Repository: Obteniendo todos los usuarios...');

        const users = await this.userModel.find();

        console.log(`✓ ${users.length} usuarios encontrados`);
        return users.map(user => this.mapDocumentToEntity(user));
    }

    async findByRole(role: string): Promise<UserEntity[]> {
        console.log(`📖 Repository: Buscando usuarios con rol: ${role}`);

        const users = await this.userModel.find({ role });

        console.log(`✓ ${users.length} usuarios encontrados`);
        return users.map(user => this.mapDocumentToEntity(user));
    }

    async existsByEmail(email: string): Promise<boolean> {
        console.log(`🔍 Repository: Verificando si existe email: ${email}`);

        const exists = await this.userModel.exists({ email });

        return !!exists;
    }

    async existsByPhone(phone: string): Promise<boolean> {
        console.log(`🔍 Repository: Verificando si existe phone: ${phone}`);
        const exists = await this.userModel.exists({ phone });
        return !!exists;
    }

    private mapDocumentToEntity(user: any): UserEntity {
        const providerDataEntity = user.providerData ? this.mapProviderDataToEntity(user.providerData) : undefined;
        return new UserEntity(
            user.name,
            user.email,
            user.phone,
            user.password,
            user.role,
            providerDataEntity,
            user.socialMediaLink ?? [],
            user.createdAt,
            user.updatedAt,
            user.id.toString()
        );
    }

    private mapProviderDataToEntity(providerData: any): ProviderDataEntity {
        return new ProviderDataEntity(
            providerData.publicInfo,
            providerData.address,
            providerData.minimumAdvance,
            providerData.serviceType,
            providerData.socialMedia.map(
                (social: any) => new SocialMediaLinkEntity(social.platform, social.url)
            )
        );
    }

    private mapProviderDataDtoToEntity(providerData: ProviderDataEntity): {
        publicInfo: string;
        address: string;
        minimumAdvance: number;
        serviceType: string;
        socialMedia: { platform: string; url: string }[];
    } {
        return {
            publicInfo: providerData.getPublicInfo(),
            address: providerData.getAddress(),
            minimumAdvance: providerData.getMinimumAdvance(),
            serviceType: providerData.getServiceType(),
            socialMedia: providerData.getSocialMediaLink().map(social => ({
                platform: social.getPlatform(),
                url: social.getUrl(),
            })),
        };
    }

    private buildUpdateDataUser(user: UserEntity): any {
        const updateData: any = { updatedAt: new Date(),};

        if (user.getName()) {
            updateData.name = user.getName();
        }

        if (user.getEmail()) {
            updateData.email = user.getEmail();
        }

        if (user.getPhone()) {
            updateData.phone = user.getPhone();
        }

        if (user.getPassword()) {
            updateData.password = user.getPassword();
        }

        if (user.getProviderData()) {
            const providerDataUpdate = this.mapUpdateProviderDataToDb(
                user.getProviderData()!
            );

            if (Object.keys(providerDataUpdate).length > 0) {
                updateData.providerData = providerDataUpdate;
            }
        }

        return updateData;
    }

    private mapUpdateProviderDataToDb(providerData: ProviderDataEntity): any {
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
        
        const socialMedia = providerData.getSocialMediaLink();
        if (socialMedia) {
            result.socialMedia = socialMedia.map(social => ({
                platform: social.getPlatform(),
                url: social.getUrl(),
            }));
        }

        return result;
    }
}