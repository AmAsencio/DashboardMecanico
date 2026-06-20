import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    currentView: string;
    setView: (view: 'vehiculos' | 'mantenimientos') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">

            {/* Cabecera superior solo visible en móvil */}
            <div className="md:hidden bg-slate-900 p-4 text-center sticky top-0 z-40 shadow-md flex justify-center items-center">
                <h1 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
                    <span>🔧</span> GarageControl
                </h1>
            </div>

            <Sidebar currentView={currentView} setView={setView} />

            {/* Añadimos pb-24 en móvil para que la barra inferior no tape el último elemento */}
            <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full max-w-7xl mx-auto overflow-x-hidden">
                {children}
            </main>

        </div>
    );
};