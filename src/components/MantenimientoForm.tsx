import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface MantenimientoFormProps {
    vehiculoId: string;
    onSuccess: () => void;
}

export const MantenimientoForm: React.FC<MantenimientoFormProps> = ({ vehiculoId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fecha: new Date().toISOString().split('T')[0],
        tipo: 'Mantenimiento Preventivo',
        descripcion: '',
        kilometraje_reparacion: '',
        coste: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('mantenimientos').insert([
                {
                    vehiculo_id: vehiculoId,
                    fecha: formData.fecha,
                    tipo: formData.tipo,
                    descripcion: formData.descripcion,
                    kilometraje_reparacion: formData.kilometraje_reparacion ? parseInt(formData.kilometraje_reparacion) : null,
                    coste: formData.coste ? parseFloat(formData.coste) : null,
                },
            ]);

            if (error) throw error;
            onSuccess();
        } catch (error) {
            console.error('Error al guardar el registro:', error);
            alert('Hubo un error al guardar el registro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                    <input type="date" required name="fecha" value={formData.fecha} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Intervención</label>
                    <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                        <option value="Reparación">Reparación</option>
                        <option value="ITV">ITV</option>
                        <option value="Modificación">Modificación</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del trabajo</label>
                <textarea required name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: Cambio de aceite 5W40, filtro de aceite y filtro de aire..."></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kilómetros (Opcional)</label>
                    <input type="number" name="kilometraje_reparacion" value={formData.kilometraje_reparacion} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: 152000" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Coste en € (Opcional)</label>
                    <input type="number" step="0.01" name="coste" value={formData.coste} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: 120.50" />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Guardar Registro'}
            </button>
        </form>
    );
};