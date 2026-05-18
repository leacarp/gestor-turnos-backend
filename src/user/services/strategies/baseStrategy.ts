import { BadRequestException } from '@nestjs/common';
import { IUserStrategy } from './userStrategy';
import { UserDtoService } from '../dto/user-dto.request/user-service.dto';
import { UpdateUserDtoService } from '../dto/user-dto.request/update-user-service.dto';


export abstract class BaseStrategy implements IUserStrategy {
    
    protected validateName(nombre: string): void {
        if (!nombre || nombre.length < 3) {
            throw new BadRequestException('Nombre debe tener al menos 3 caracteres');
        }
    }

    protected validateEmail(email: string): void {
        if (!email || !this.isValidEmail(email)) {
            throw new BadRequestException('Email inválido');
        }
    }

    protected isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    protected validatePhone(phone: string): void {
        const digits = phone.replace(/\D/g, '');
        if (!digits || digits.length < 11) {
            throw new BadRequestException('El número debe tener cantidad correcta de dígitos');
        }
    }

    protected validatePassword(password: string): void {
        if (!password || password.length < 6) {
            throw new BadRequestException('Password debe tener al menos 6 caracteres');
        }
    }

    protected validateUpdateBasicFields(user: UpdateUserDtoService): void {
        this.validateIfPresent(user.getName(), (v) => this.validateName(v));
        this.validateIfPresent(user.getEmail(), (v) => this.validateEmail(v));
        this.validateIfPresent(user.getPhone(), (v) => this.validatePhone(v));
        this.validateIfPresent(user.getPassword(), (v) => this.validatePassword(v));
    }

    private validateIfPresent(value: string | undefined, validator: (val: string) => void) : void {
        if (value){
            validator(value);
        }
    }

    abstract validateCreate(user: UserDtoService): void;
    abstract validateUpdate(user: UpdateUserDtoService): void;
    abstract processCreation(user: UserDtoService): Promise<void>;
    abstract processUpdate(user: UpdateUserDtoService): Promise<void>;
    abstract processDelete(userId: string): Promise<void>;
}