import { NotFoundException } from '@nestjs/common';
import { IUserStrategy } from './userStrategy';
import { CreateUserDtoRequest } from 'src/user/presentation/dtos/user-dto-request/create-user.dto';
import { UpdateUserDtoRequest } from 'src/user/presentation/dtos/user-dto-request/update-user.dto';

export abstract class BaseStrategy implements IUserStrategy {
    
    protected validateName(nombre: string): void {
        if (!nombre || nombre.length < 3) {
            throw new NotFoundException('Nombre debe tener al menos 3 caracteres');
        }
    }

    protected validateEmail(email: string): void {
        if (!email || !this.isValidEmail(email)) {
            throw new NotFoundException('Email inválido');
        }
    }

    protected isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    protected validatePhone(phone: string): void {
        if (!phone || phone.length < 11) {
            throw new NotFoundException('El número debe tener cantidad correcta de dígitos');
        }
    }

    protected validatePassword(password: string): void {
        if (!password || password.length < 8) {
            throw new NotFoundException('Password debe tener al menos 8 caracteres');
        }
    }

    protected validateUpdateBasicFields(user: UpdateUserDtoRequest): void {
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

    abstract validateCreate(user: CreateUserDtoRequest): void;
    abstract validateUpdate(user: UpdateUserDtoRequest): void;
    abstract processCreation(user: CreateUserDtoRequest): Promise<void>;
    abstract processUpdate(user: UpdateUserDtoRequest): Promise<void>;
    abstract processDelete(userId: string): Promise<void>;
}