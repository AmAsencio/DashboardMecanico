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