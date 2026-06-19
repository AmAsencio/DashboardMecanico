import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface VehiculoFormProps {
    onSuccess: () => void;
}

export const VehiculoForm: React.FC<VehiculoFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        marca: '',
        modelo: '',
        version: '',
        anio: '',
        kilometraje_actual: '',
        combustible: 'Gasolina',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('vehiculos').insert([
                {
                    marca: formData.marca,
                    modelo: formData.modelo,
                    version: formData.version,
                    anio: parseInt(formData.anio),
                    kilometraje_actual: parseInt(formData.kilometraje_actual),
                    combustible: formData.combustible,
                },
            ]);

            if (error) throw error;

            onSuccess();
        } catch (error) {
            console.error('Error al guardar el vehículo:', error);
            alert('Hubo un error al guardar el vehículo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                    <input required name="marca" value={formData.marca} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: Renault" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                    <input required name="modelo" value={formData.modelo} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: Clio 3" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Versión / Motor</label>
                <input name="version" value={formData.version} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: 1.6 Dynamique" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
                    <input type="number" required name="anio" value={formData.anio} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Ej: 2006" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kilometraje actual</label>
                    <input type="number" required name="kilometraje_actual" value={formData.kilometraje_actual} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Combustible</label>
                <select name="combustible" value={formData.combustible} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Guardar Vehículo'}
            </button>
        </form>
    );
};