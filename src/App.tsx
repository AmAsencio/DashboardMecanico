import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Modal } from './components/Modal';
import { VehiculoForm } from './components/VehiculoForm';
import { HistorialView } from './views/HistorialView';
import { MantenimientosGlobalView } from './views/MantenimientosGlobalView';
import { supabase } from './lib/supabase';
import { LoginView } from './views/LoginView';
import type { Session } from '@supabase/supabase-js'; // <-- Importamos el tipo de sesión
import type { Vehiculo } from './types';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Vigila si el usuario inicia o cierra sesión
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [view, setView] = useState<'vehiculos' | 'mantenimientos'>('vehiculos');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);

  const [vehiculoToEdit, setVehiculoToEdit] = useState<Vehiculo | null>(null);

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

  const handleDeleteVehiculo = async (id: string, marca: string, modelo: string) => {
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el ${marca} ${modelo}? Se borrará también todo su historial.`);
    if (!confirmacion) return;

    try {
      const { error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchVehiculos();
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      alert('No se pudo eliminar el vehículo.');
    }
  };

  const handleVehiculoAddedOrEdited = () => {
    setIsModalOpen(false);
    setVehiculoToEdit(null);
    fetchVehiculos();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVehiculoToEdit(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Si no hay sesión, devolvemos la pantalla de login directamente
  if (!session) {
    return <LoginView />;
  }

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
                onClick={() => {
                  setVehiculoToEdit(null);
                  setIsModalOpen(true);
                }}
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
                  <div key={coche.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">

                    {/* Cabecera limpia sin absolute */}
                    <div className="flex justify-between items-start mb-4">

                      {/* Título, Versión y Año */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{coche.marca} {coche.modelo}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-500">{coche.version}</p>
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {coche.anio}
                          </span>
                        </div>
                      </div>

                      {/* Botones de acción ahora viven en su propio espacio a la derecha */}
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setVehiculoToEdit(coche);
                            setIsModalOpen(true);
                          }}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
                          title="Editar vehículo"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteVehiculo(coche.id, coche.marca, coche.modelo)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                          title="Eliminar vehículo"
                        >
                          🗑️
                        </button>
                      </div>

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
                      <button
                        onClick={() => setSelectedVehiculo(coche)}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium py-2 rounded border border-emerald-200 transition-colors"
                      >
                        + Mantenimiento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              title={vehiculoToEdit ? "Editar vehículo" : "Añadir nuevo vehículo"}
            >
              <VehiculoForm
                onSuccess={handleVehiculoAddedOrEdited}
                vehiculoToEdit={vehiculoToEdit}
              />
            </Modal>
          </div>
        )
      ) : (
        <MantenimientosGlobalView />
      )}
    </Layout>
  );
}

export default App;