export class ClientDetailsService{
    private readonly tipo: 'REGISTRADO' | 'INVITADO';
    private readonly id? : string;
    private readonly nombre? : string;
    private readonly email?: string;
    private readonly celular? : string;

    constructor(tipo: 'REGISTRADO' | 'INVITADO', id?: string, nombre?: string, email?: string, celular?: string){
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

    getCelular() : string | undefined {
        return this.celular;
    }


}