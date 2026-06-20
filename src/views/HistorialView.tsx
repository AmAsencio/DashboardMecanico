import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { MantenimientoForm } from '../components/MantenimientoForm';
import type { Vehiculo, Mantenimiento } from '../types';

interface HistorialViewProps {
    vehiculo: Vehiculo;
    onBack: () => void;
}

export const HistorialView: React.FC<HistorialViewProps> = ({ vehiculo, onBack }) => {
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [mantenimientoToEdit, setMantenimientoToEdit] = useState<Mantenimiento | null>(null);

    const fetchMantenimientos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('mantenimientos')
                .select('*')
                .eq('vehiculo_id', vehiculo.id)
                .order('fecha', { ascending: false });

            if (error) throw error;
            if (data) setMantenimientos(data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMantenimientos();
    }, [vehiculo.id]);

    const handleDeleteMantenimiento = async (id: string, descripcion: string) => {
        const confirmacion = window.confirm(`¿Seguro que deseas eliminar este registro?\n"${descripcion}"`);
        if (!confirmacion) return;

        try {
            const { error } = await supabase
                .from('mantenimientos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchMantenimientos();
        } catch (error) {
            console.error('Error al borrar mantenimiento:', error);
            alert('No se pudo eliminar el registro.');
        }
    };

    const handleRegistroAddedOrEdited = () => {
        setIsModalOpen(false);
        setMantenimientoToEdit(null);
        fetchMantenimientos();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMantenimientoToEdit(null);
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
                    ←
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Historial de {vehiculo.marca} {vehiculo.modelo}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Control integral de reparaciones y costes mecánicos.</p>
                </div>
                <button
                    onClick={() => {
                        setMantenimientoToEdit(null);
                        setIsModalOpen(true);
                    }}
                    className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    + Nuevo Registro
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                {loading ? (
                    <div className="p-12 text-center flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : mantenimientos.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No hay registros para este vehículo.
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Descripción</th>
                                <th className="px-6 py-4">Km</th>
                                <th className="px-6 py-4 text-right">Coste</th>
                                <th className="px-6 py-4 text-center">Acciones</th> {/* <-- Columna de acciones */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mantenimientos.map((mant) => (
                                <tr key={mant.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {/* Formateo de fecha limpia a formato local europeo */}
                                        {new Date(mant.fecha).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">
                                            {mant.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700">{mant.descripcion}</td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {mant.kilometraje_reparacion?.toLocaleString() || '-'} km
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                                        {mant.coste ? `${mant.coste} €` : '-'}
                                    </td>
                                    {/* Botones de acción dentro de la celda de la tabla */}
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setMantenimientoToEdit(mant);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors mr-1"
                                            title="Editar registro"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMantenimiento(mant.id, mant.descripcion)}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                            title="Eliminar registro"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={mantenimientoToEdit ? `Editar registro mecánico` : `Nuevo registro para ${vehiculo.marca} ${vehiculo.modelo}`}
            >
                <MantenimientoForm
                    vehiculoId={vehiculo.id}
                    onSuccess={handleRegistroAddedOrEdited}
                    mantenimientoToEdit={mantenimientoToEdit}
                />
            </Modal>
        </div>
    );
};