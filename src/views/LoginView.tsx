import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const LoginView: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // <-- MENSAJE DE ÉXITO INTEGRADO
                setFeedback({
                    type: 'success',
                    message: '¡Registro completado! Revisa tu bandeja de entrada para verificar tu cuenta.'
                });
            }
        } catch (error: any) {
            // <-- MENSAJE DE ERROR INTEGRADO
            setFeedback({
                type: 'error',
                message: error.error_description || 'Ocurrió un error al procesar la solicitud.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
                    <span>🔧</span> GarageControl
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {isLogin ? 'Inicia sesión para gestionar tu flota' : 'Crea una cuenta para empezar'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">

                    {/* <-- ZONA DE BANNERS DE FEEDBACK --> */}
                    {feedback.message && (
                        <div className={`mb-6 p-4 rounded-md text-sm ${feedback.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {feedback.message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Correo Electrónico</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                                {loading ? 'Procesando...' : isLogin ? 'Entrar al Dashboard' : 'Registrarse'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">O si lo prefieres</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setFeedback({ type: '', message: '' });
                                }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                {isLogin ? 'Crear una cuenta nueva' : 'Ya tengo una cuenta'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};