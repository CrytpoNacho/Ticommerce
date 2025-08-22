# Ticommerce_Web

Ticommerce_Web es una plataforma de comercio electrónico desarrollada con Next.js (App Router), TypeScript, Prisma y PostgreSQL local. Permite a los vendedores registrar productos (con o sin variantes), manejar stock y a los usuarios buscar y explorar productos fácilmente.

## Tecnologías utilizadas

- Next.js (App Router)
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Vercel Blob
- Zod
- React Hook Form
- ShadCN UI

## Estructura del proyecto

```
Ticommerce_Web/
├── app/
│   ├── api/                   # Rutas backend (Next.js API Routes)
│   ├── busqueda/              # Página de búsqueda
│   ├── vendedor/
│   │   └── productos/
│   │       └── crear/         # Formulario para crear productos
│   └── layout.tsx
├── components/                # Componentes reutilizables
├── prisma/                    # Esquema de base de datos y migraciones
├── public/                    # Archivos estáticos
└── utils/                     # Funciones auxiliares y validaciones
```

## Funcionalidades principales

### Productos

- Creación de productos con nombre, descripción, precio, categoría e imágenes
- Posibilidad de definir variantes con nombre, precio y stock individual
- El campo de stock total se solicita siempre, incluso si hay variantes
- Validación para que la suma del stock de las variantes no supere el stock total
- Toda la información se guarda correctamente en la base de datos

### Búsqueda

- Página /busqueda con filtros por palabra clave, categoría, precio y orden
- Productos recomendados si no hay resultados
- Sistema de paginación con botón "Cargar más"
- Diseño adaptable a escritorio y móvil
- Implementación de debounce, caché y rate limiting

### Autenticación

- Contexto global para usuario autenticado
- Migración completa desde Supabase a PostgreSQL local

## Scripts de desarrollo

Instalar dependencias, generar cliente Prisma y aplicar migraciones:

```
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Acceder a Prisma Studio:

```
npx prisma studio
```

## Variables de entorno

Crear un archivo `.env` con el siguiente contenido:

```
DATABASE_URL="postgresql://PostgresAdmin:PostgresAdmin2025@localhost:5432/postgres"
NEXT_PUBLIC_VERCEL_BLOB_TOKEN=TU_TOKEN_DE_VERCELOB
```

Reemplazar el valor del token con el correspondiente.

## Tareas pendientes

- Dashboard para vendedores
- Edición de productos
- Gestión de órdenes
- Panel de administración
- Optimización de SEO y rendimiento

## Autor

Proyecto desarrollado por [Tu nombre o alias].

## AUTO Documentation
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/CrytpoNacho/Ticommerce)

