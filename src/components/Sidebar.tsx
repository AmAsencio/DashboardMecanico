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
        <>
            {/* MODO ESCRITORIO: Barra lateral tradicional */}
            <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-screen sticky top-0">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                        <span>🔧</span> GarageControl
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Gestión de Mantenimiento</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setView('vehiculos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'vehiculos' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                        🚗 Mis Vehículos
                    </button>
                    <button onClick={() => setView('mantenimientos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'mantenimientos' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                        📋 Historial Mecánico
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* MODO MÓVIL: Barra de navegación inferior (App-like) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around items-center p-2 z-50">
                <button onClick={() => setView('vehiculos')} className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors ${currentView === 'vehiculos' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xl mb-1">🚗</span>
                    Flota
                </button>
                <button onClick={() => setView('mantenimientos')} className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors ${currentView === 'mantenimientos' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xl mb-1">📋</span>
                    Historial
                </button>
                <button onClick={handleLogout} className="flex flex-col items-center p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 transition-colors">
                    <span className="text-xl mb-1">🚪</span>
                    Salir
                </button>
            </nav>
        </>
    );
};