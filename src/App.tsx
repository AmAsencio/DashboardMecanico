import { useState } from 'react';
import { Layout } from './components/Layout';

function App() {
  const [view, setView] = useState<'vehiculos' | 'mantenimientos'>('vehiculos');

  return (
    <Layout currentView={view} setView={setView}>
      {view === 'vehiculos' ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Mis Vehículos</h2>
              <p className="text-sm text-slate-500 mt-1">Gestiona tu flota personal y su kilometraje actual.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              + Añadir Vehículo
            </button>
          </div>

          {/* Zona temporal para las tarjetas de los coches */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 shadow-xs">
            No hay vehículos registrados. ¡Añade el primero para empezar!
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Historial Mecánico</h2>
            <p className="text-sm text-slate-500 mt-1">Registro completo de reparaciones, revisiones e ITV.</p>
          </div>

          {/* Zona temporal para la tabla de mantenimientos */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 shadow-xs">
            Aún no hay registros de mantenimiento almacenados.
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;