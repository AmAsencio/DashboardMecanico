export interface Vehiculo {
    id: string;
    marca: string;
    modelo: string;
    version: string | null;
    anio: number | null;
    kilometraje_actual: number | null;
    combustible: string | null;
    created_at: string;
}

export interface Mantenimiento {
    id: string;
    vehiculo_id: string;
    fecha: string;
    tipo: string;
    descripcion: string;
    kilometraje_reparacion: number | null;
    coste: number | null;
    created_at: string;
}