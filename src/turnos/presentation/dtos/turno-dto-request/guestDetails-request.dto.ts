import { IsString, IsNotEmpty} from 'class-validator';
import { GuestDetailsService } from 'src/turnos/services/dto/guestDetails-service.dto';


export class GuestDetailsRequestDto{

    @IsString()
    @IsNotEmpty()
    private readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    private readonly email: string;

    @IsString()
    @IsNotEmpty()
    private readonly celular: string;

    constructor(nombre: string, email: string, celular: string){
        this.nombre = nombre;
        this.email = email;
        this.celular = celular;
    }

    getNombre() : string{
        return this.nombre;
    }

    getEmail() : string{
        return this.email;
    }

    getCelular() : string {
        return this.celular;
    }

    toServiceDto() : GuestDetailsService{
        return new GuestDetailsService(
            this.nombre,
            this.email,
            this.celular
        )
    }

}