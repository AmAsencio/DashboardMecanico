import React from 'react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
    currentView: string;
    setView: (view: 'vehiculos' | 'mantenimientos') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                    <span>🔧</span> GarageControl
                </h1>
                <p className="text-xs text-slate-400 mt-1">Gestión de Mantenimiento</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <button
                    onClick={() => setView('vehiculos')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'vehiculos'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    🚗 Mis Vehículos
                </button>

                <button
                    onClick={() => setView('mantenimientos')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'mantenimientos'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    📋 Historial Mecánico
                </button>
            </nav>

            {/* <-- ZONA INFERIOR CON EL BOTÓN DE LOGOUT --> */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors"
                >
                    🚪 Cerrar Sesión
                </button>
                <div className="text-center text-xs text-slate-500">
                    v1.0.0 — Entorno de Desarrollo
                </div>
            </div>
        </aside>
    );
};