export class GuestDetailsService{
    private readonly nombre : string;
    private readonly email: string;
    private readonly celular : string;

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


}