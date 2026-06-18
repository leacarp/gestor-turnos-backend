export class ClienteEntity{
  private readonly tipo: 'REGISTRADO' | 'INVITADO';
  private readonly id?: string;      
  private readonly nombre?: string;   
  private readonly email?: string;    
  private readonly celular? : string;

  constructor(tipo: 'REGISTRADO' | 'INVITADO', id? : string, nombre? : string, email?: string, celular?: string){
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

  getCelular() :string | undefined{
    return this.celular;
  }

  static createRegistered(id: string): ClienteEntity {
    if (!id) throw new Error('El ID es obligatorio para clientes registrados');
    return new ClienteEntity('REGISTRADO', id);
  }

  static createGuest(nombre: string, email: string, celular: string): ClienteEntity {
    if (!nombre || !email || !celular) throw new Error('Nombre, email y  celular son obligatorios para invitados');
    return new ClienteEntity('INVITADO', undefined, nombre, email, celular);
  }
}

