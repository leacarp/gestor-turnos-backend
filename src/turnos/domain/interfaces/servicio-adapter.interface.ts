export interface IServicioAdapter {
  exists(id: string): Promise<boolean>;
  belongsToProvider(servicioId: string, proveedorId: string): Promise<boolean>;
  requiereSeña(servicioId: string): Promise<boolean>;
}
