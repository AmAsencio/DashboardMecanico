# 🔧 GarageControl — Gestión de Mantenimiento Mecánico

GarageControl es una aplicación web **Full Stack** moderna diseñada para el control integral, seguimiento analítico y gestión de mantenimiento de flotas de vehículos personales. Permite registrar vehículos, asociar intervenciones mecánicas pormenorizadas, controlar gastos en tiempo real y asegurar la privacidad absoluta de los datos mediante políticas de seguridad avanzadas a nivel de base de datos.

---

## 🚀 Características Principales

- **Autenticación Segura & Privacidad RLS:** Sistema integrado de registro e inicio de sesión gestionado por Supabase Auth. Cuenta con **Row Level Security (RLS)** en PostgreSQL, garantizando que cada usuario acceda de manera estricta y exclusiva a sus propios datos.
- **Gestión de Vehículos (CRUD Completo):** Control total (Crear, Leer, Actualizar, Eliminar) sobre la flota personal, almacenando métricas críticas como marca, modelo, versión/motorización, año de fabricación, tipo de combustible y kilometraje actual.
- **Historial Mecánico Relacional:** Registro estructurado de intervenciones (Mantenimiento preventivo, Reparaciones, ITV, Modificaciones) enlazado de forma relacional a cada vehículo específico, soportando borrados en cascada (`ON DELETE CASCADE`).
- **Panel Analítico Global:** Pantalla unificada con cruce de datos (_SQL Joins_) que recopila de manera cronológica todas las operaciones de la flota y calcula automáticamente el gasto total acumulado.
- **Arquitectura Reactiva & UX Pulida:** Desarrollado sobre Vite para un rendimiento ultrasónico, tipado estricto con TypeScript, diseño adaptativo y moderno con Tailwind CSS, control de condiciones de carrera asíncronas (`race conditions`) y detalles de UX optimizados de forma global.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React, TypeScript, Vite.
- **Estilos:** Tailwind CSS.
- **Backend & Base de Datos:** Supabase (PostgreSQL, Auth, RLS).
- **Control de Versiones:** Git / GitHub.

---

## 📂 Estructura del Proyecto

```bash
src/
├── components/          # Componentes reutilizables (Layout, Modal, Formularios)
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Modal.tsx
│   ├── VehiculoForm.tsx
│   └── MantenimientoForm.tsx
├── lib/                 # Configuración de clientes externos (Supabase Client)
│   └── supabase.ts
├── types/               # Definición de interfaces estrictas de TypeScript
│   └── index.ts
├── views/               # Vistas principales del flujo de pantallas
│   ├── LoginView.tsx
│   ├── HistorialView.tsx
│   └── MantenimientosGlobalView.tsx
├── App.tsx              # Core de la aplicación, manejo de estados globales y enrutado
├── main.tsx             # Punto de entrada de la aplicación
└── index.css            # Estilos globales e inyecciones de directivas Tailwind
```

---

## 📊 Modelo de Datos (PostgreSQL)

El sistema utiliza dos tablas principales vinculadas de forma relacional:

### Tabla: `vehiculos`

- `id`: UUID (Primary Key)
- `marca`: TEXT
- `modelo`: TEXT
- `version`: TEXT
- `anio`: INT
- `kilometraje_actual`: INT
- `combustible`: TEXT
- `user_id`: UUID (Foreign Key -> auth.users.id)

### Tabla: `mantenimientos`

- `id`: UUID (Primary Key)
- `vehiculo_id`: UUID (Foreign Key -> vehiculos.id ON DELETE CASCADE)
- `fecha`: DATE
- `tipo`: TEXT
- `descripcion`: TEXT
- `kilometraje_reparacion`: INT
- `coste`: NUMERIC
- `created_at`: TIMESTAMPTZ

---

## 💻 Instalación y Configuración Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/dashboard-mecanico.git
   cd dashboard-mecanico
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crea un archivo `.env` en la raíz del proyecto y añade tus credenciales públicas de Supabase (**anon/public**):

   ```env
   VITE_SUPABASE_URL=tu_supabase_url_aqui
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
   ```

4. **Levantar el entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

---

## 🔒 Seguridad (Políticas RLS Ejemplo)

Las consultas automáticas de la aplicación se rigen bajo los candados directos del motor de base de datos:

```sql
-- Ejemplo de política para lectura de vehículos
CREATE POLICY "Usuarios ven sus propios coches"
ON vehiculos FOR SELECT
USING (auth.uid() = user_id);
```

---

Desarrollado con pasión por la ingeniería de software y la mecánica automotriz. 🏎️
