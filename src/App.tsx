import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Modal } from './components/Modal';
import { VehiculoForm } from './components/VehiculoForm';
import { HistorialView } from './views/HistorialView';
import { supabase } from './lib/supabase';
import type { Vehiculo } from './types';

function App() {
  const [view, setView] = useState<'vehiculos' | 'mantenimientos'>('vehiculos');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);

  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setVehiculos(data);
    } catch (error) {
      console.error('Error al cargar los vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const handleVehiculoAdded = () => {
    setIsModalOpen(false);
    fetchVehiculos();
  };

  return (
    <Layout 
      currentView={view} 
      setView={(v) => {
        setView(v);
        if (v === 'vehiculos') setSelectedVehiculo(null);
      }}
    >
      {view === 'vehiculos' ? (
        selectedVehiculo ? (
          <HistorialView 
            vehiculo={selectedVehiculo} 
            onBack={() => setSelectedVehiculo(null)} 
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Mis Vehículos</h2>
                <p className="text-sm text-slate-500 mt-1">Gestiona tu flota personal y su kilometraje actual.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                + Añadir Vehículo
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : vehiculos.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 shadow-xs">
                No hay vehículos registrados. ¡Añade el primero para empezar!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehiculos.map((coche) => (
                  <div key={coche.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{coche.marca} {coche.modelo}</h3>
                        <p className="text-sm text-slate-500">{coche.version}</p>
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                        {coche.anio}
                      </span>
                    </div>

                    <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Kilometraje:</span>
                        <span className="font-semibold text-slate-800">
                          {coche.kilometraje_actual?.toLocaleString()} km
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Combustible:</span>
                        <span className="font-semibold text-slate-800">{coche.combustible}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex gap-2">
                      <button 
                        onClick={() => setSelectedVehiculo(coche)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium py-2 rounded border border-slate-200 transition-colors"
                      >
                        Ver Historial
                      </button>
                      <button className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium py-2 rounded border border-emerald-200 transition-colors">
                        + Mantenimiento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="Añadir nuevo vehículo"
            >
              <VehiculoForm onSuccess={handleVehiculoAdded} />
            </Modal>
          </div>
        )
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Historial Mecánico General</h2>
            <p className="text-sm text-slate-500 mt-1">Lista globalizada de todas las intervenciones realizadas.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-500 shadow-xs">
            Próximamente mostraremos una tabla con todos los mantenimientos cruzados de la flota.
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;