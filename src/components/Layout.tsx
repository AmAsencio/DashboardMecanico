import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    currentView: string;
    setView: (view: 'vehiculos' | 'mantenimientos') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
    return (
        <div className="flex bg-slate-50 min-h-screen text-slate-800 antialiased">
            <Sidebar currentView={currentView} setView={setView} />
            <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};