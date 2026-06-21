import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ClientDetailsService } from 'src/turnos/services/dto/client-details-service.dto';


export class ClienteRequestDto{

  // 'REGISTRADO' | 'INVITADO' nos sirve para saber qué campos validar
  @IsString()
  @IsIn(['REGISTRADO', 'INVITADO'], { message: 'El tipo debe ser REGISTRADO o INVITADO' })
  tipo: 'REGISTRADO' | 'INVITADO';

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  email?: string; 

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  celular?: string;

  constructor(tipo: 'REGISTRADO' | 'INVITADO', id?: string, nombre?: string, email?: string, celular?: string) {
    this.tipo = tipo;
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.celular = celular;
  }

    getTipo() : 'REGISTRADO' | 'INVITADO'{
        return this.tipo;
    }

    getId() : string | undefined{
        return this.id;
    }

    getNombre() : string | undefined{
        return this.nombre;
    }

    getEmail() : string | undefined{
        return this.email;
    }

    getCelular() : string | undefined{
        return this.celular;
    }

    toServiceDto() : ClientDetailsService{
        return new ClientDetailsService(
            this.tipo,
            this.id,
            this.nombre,
            this.email,
            this.celular
        )
    }

}