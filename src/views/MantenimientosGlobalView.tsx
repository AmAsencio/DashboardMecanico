import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface MantenimientoGlobal {
    id: string;
    fecha: string;
    tipo: string;
    descripcion: string;
    kilometraje_reparacion: number | null;
    coste: number | null;
    vehiculos: {
        marca: string;
        modelo: string;
    } | null;
}

export const MantenimientosGlobalView: React.FC = () => {
    const [mantenimientos, setMantenimientos] = useState<MantenimientoGlobal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodosLosMantenimientos = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('mantenimientos')
                    .select(`
            id,
            fecha,
            tipo,
            descripcion,
            kilometraje_reparacion,
            coste,
            vehiculos (
                marca,
                modelo
            )
            `)
                    .order('fecha', { ascending: false });

                if (error) throw error;
                if (data) setMantenimientos(data as unknown as MantenimientoGlobal[]);
            } catch (error) {
                console.error('Error al cargar el historial global:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodosLosMantenimientos();
    }, []);

    const gastoTotal = mantenimientos.reduce((total, mant) => total + (mant.coste || 0), 0);

    return (
        <div>
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Historial Mecánico Global</h2>
                    <p className="text-sm text-slate-500 mt-1">Registro cruzado de todas las intervenciones de la flota.</p>
                </div>

                {/* Pequeña tarjeta de resumen financiero */}
                <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm text-right">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gasto Total Flota</p>
                    <p className="text-xl font-bold text-emerald-600">{gastoTotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €</p>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="p-12 text-center flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : mantenimientos.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        Aún no hay registros de mantenimiento almacenados en toda la flota.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Vehículo</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Descripción</th>
                                <th className="px-6 py-4 text-right">Coste</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mantenimientos.map((mant) => (
                                <tr key={mant.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {new Date(mant.fecha).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-800">
                                            {mant.vehiculos?.marca} {mant.vehiculos?.modelo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                                            {mant.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 truncate max-w-xs" title={mant.descripcion}>
                                        {mant.descripcion}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900 whitespace-nowrap">
                                        {mant.coste ? `${mant.coste} €` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};