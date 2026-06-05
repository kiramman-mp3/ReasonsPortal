# Portal Web Institucional Full-Stack - REASONS

> Plataforma web autoadministrable, segura y con diseño responsivo premium, diseñada para el grupo de investigación **REASONS** (Research in Engineering and Advanced Sustainable Operations, Nature, and Society) de la **Universidad Técnica de Ambato** y desarrollada íntegramente por mí como proyecto de portafolio técnico de alto impacto.

[![Angular](https://img.shields.io/badge/Angular-21.x-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnels-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/tunnel/)
[![Swagger](https://img.shields.io/badge/OpenAPI%203.0-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

Este sistema ha sido diseñado e implementando una arquitectura desacoplada SPA, compresión nativa de archivos en el cliente mediante Canvas, blindaje de seguridad activo contra vulnerabilidades comunes de la OWASP y un motor dinámico de plantillas en tiempo real basado en variables CSS controladas desde base de datos.

---

## 💎 Aspectos Destacados de la Arquitectura

### 🎨 1. Motor de Colores Dinámicos en Tiempo Real (CSS Variables)
En lugar de depender de estilos estáticos o compilaciones rígidas, la plataforma cuenta con una **gestión de apariencia autoadministrable**:
*   Los administradores pueden configurar los colores hexadecimales corporativos (primario, secundario y acento) directamente desde su panel de control.
*   En el arranque del cliente (`APP_INITIALIZER`), el frontend consulta la API e inyecta dinámicamente estas variables en el `:root` del DOM (`var(--color-primary)`, etc.).
*   El compilador de Tailwind CSS (`v4`) se vincula directamente a estas variables CSS, lo que permite que todo el portal cambie su paleta cromática de inmediato en caliente y **sin necesidad de recompilar la aplicación o recargar la página**.

### ⚡ 2. Compresión de Imágenes del Lado del Cliente (Canvas API)
Para optimizar el uso de ancho de banda y garantizar subidas rápidas incluso en conexiones móviles limitadas, desarrollamos un optimizador nativo sin dependencias externas utilizando la **API de Canvas de HTML5** ([`image-compressor.ts`](file:///c:/Users/johan/OneDrive/Documentos/Universidad/Web%20y%20Moviles/Ape03/frontend/src/app/core/utils/image-compressor.ts)):
*   Las imágenes seleccionadas para subida (fotos 5x5 cm de investigadores, banners de proyectos y portadas de revistas) son interceptadas en el navegador antes de ser enviadas a la red.
*   Se dibujan asíncronamente en un lienzo `<canvas>` invisible recalculando proporcionalmente su resolución (máximo de 800x800 px para perfiles o 1200x800 px para banners) y exportándolas a un `Blob` comprimido a calidad del `75%-85%` en formato JPEG o PNG transparente.
*   Esto reduce drásticamente el peso de los archivos (ej. de una imagen pesada de **`15 MB`** a un archivo ligero y súper nítido de **`300 KB`**), previniendo para siempre el error *File too large* en el backend y acelerando la subida en un `95%`.

### 🛡️ 3. Ecosistema de Seguridad Activa Multicapa
Diseñado con estrictos principios de programación defensiva para asegurar la integridad de la base de datos relacional y las sesiones del usuario:
*   **Gestión de Sesión y Guardianes**: Interceptores HTTP funcionales de Angular que adjuntan automáticamente el token de sesión (`Bearer <token>`) en peticiones de escritura y guardianes de ruta (`authGuard`) que previenen accesos no autorizados al dashboard.
*   **Helmet y CORS**: Cabeceras HTTP estrictas para proteger contra inyecciones XSS, Clickjacking, sniffing de MIME y control estricto de orígenes cruzados.
*   **Limitador de Tasa (Rate Limiting)**: Control de tráfico en ventanas de tiempo (`express-rate-limit`) aplicado a los endpoints de inicio de sesión y formulario de contacto para mitigar ataques de fuerza bruta y spam.
*   **Sanitización y Validación Anti-XSS**: Limpieza estricta de todos los campos del cuerpo de la petición (`express-validator`), escapando caracteres especiales para neutralizar inyecciones de código HTML/JS y SQL.
*   **Encriptación Criptográfica**: Las contraseñas administrativas son procesadas y almacenadas utilizando `bcrypt` con un factor de coste de 12 rondas de salting.

### 🌐 4. Exposición con un Solo Túnel de Cloudflare
Para facilitar las pruebas y demostraciones en vivo, integramos un sistema de enrutamiento proxy:
*   En lugar de abrir múltiples túneles Cloudflare simultáneos y lidiar con bloqueos de CORS, configuramos un **proxy de desarrollo** en Angular ([`proxy.conf.json`](file:///c:/Users/johan/OneDrive/Documentos/Universidad/Web%20y%20Moviles/Ape03/frontend/proxy.conf.json)).
*   Todas las rutas de datos y multimedia (`/api/*` y `/uploads/*`) son relativas. Al abrir un solo túnel apuntando al puerto de Angular (`4200`), Cloudflare genera **una única URL pública y segura con certificado SSL** que sirve la interfaz visual y redirecciona de forma interna e invisible las llamadas al puerto de Express (`3000`), evitando bloqueos.

---

## 📚 Documentación Completa

Para facilitar la comprensión, el desarrollo y la administración del proyecto, se ha compilado una biblioteca de guías y manuales detallados en la carpeta [`docs/`](docs/):

*   📘 **[Manual del Usuario](docs/user_manual.md)**: Guía paso a paso para que directores y administradores gestionen el contenido del portal (carrusel, investigadores, proyectos, publicaciones, colores corporativos y imágenes de inicio) sin tocar código.
*   💻 **[Guía del Desarrollador](docs/developer_guide.md)**: Detalle técnico de la arquitectura, variables dinámicas CSS, reactividad con Angular Signals, e interceptores/guardianes del flujo.
*   ⚙️ **[Manual de Operaciones y Ejecución](docs/operations_guide.md)**: Instrucciones detalladas de despliegue, configuración de variables de entorno `.env`, inicialización de bases de datos, semillado y resolución de problemas de puertos o MySQL.
*   🌐 **[Especificación de la API REST](docs/api_endpoints.md)**: Detalle completo de los endpoints, payloads de entrada/salida y respuestas JSON de la API.
*   🛡️ **[Medidas de Seguridad](docs/security_measures.md)**: Documentación de las capas de protección implementadas contra las vulnerabilidades más comunes de OWASP.
*   📐 **[Ecosistema Tecnológico](docs/technologies_used.md)**: Ficha técnica detallada con todas las herramientas, lenguajes y librerías que componen la solución.
*   🗃️ **[Esquema de Base de Datos (DDL)](docs/database_schema.sql)**: Código de creación de tablas relacionales InnoDB y datos semilla de MySQL.

---

## 📁 Estructura del Repositorio

```
├── docs/                      # Biblioteca de documentación técnica y manuales
│   ├── user_manual.md         # Manual de administración para usuarios finales
│   ├── developer_guide.md     # Guía arquitectónica y técnica para programadores
│   ├── operations_guide.md    # Manual de instalación, despliegue y base de datos
│   ├── database_schema.sql    # DDL Relacional de InnoDB y datos semilla
│   ├── api_endpoints.md       # Mapa de peticiones y respuestas de la API REST
│   ├── security_measures.md   # Capas de blindaje y sanitización activa
│   └── technologies_used.md   # Especificación de tecnologías y versiones usadas
├── utils/                     # Scripts y utilidades de automatización
│   ├── db-init.js             # Creador físico de la base de datos y tablas SQL
│   ├── db-seed.js             # Generador de imágenes base64 y datos institucionales
│   ├── db-clean.js            # Limpiador atómico (TRUNCATE) y re-semillero seguro
│   ├── create-admin.js        # Registro interactivo por consola de administradores
│   └── start-dev.js           # Lanzador concurrentemente de Express + Angular
├── backend/                   # Código de la API REST (Express y Node.js)
│   ├── src/
│   │   ├── config/            # Pools de MySQL y especificaciones de Swagger UI
│   │   ├── controllers/       # Controladores modulares con lógica de negocio
│   │   ├── middleware/        # Validaciones fuertes, límites de tasa y JWT
│   │   └── routes/            # Ruteadores de endpoints de la API
│   └── uploads/               # Directorio físico para archivos multimedia
└── frontend/                  # Código del Cliente SPA en Angular 21 y Tailwind
    ├── src/app/
    │   ├── core/              # Servicios de sesión, guardianes e image-compressor
    │   ├── shared/            # Layouts públicos y sidebar de administración
    │   └── features/          # Componentes del Home, login y formularios CRUD
    └── proxy.conf.json        # Proxy para enrutamiento unificado de la API
```

---


## 🚀 Guía de Instalación y Ejecución

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (v20+ recomendado)
*   [MySQL](https://www.mysql.com/) server activo localmente
*   [Cloudflare cloudflared CLI](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) (si deseas exponerlo a internet)

### 1. Configurar Entorno (`.env`)
Clona el repositorio y crea un archivo de configuración `.env` en la raíz del proyecto:
```bash
cp .env.example .env
```
Abre el archivo `.env` recién creado y configura tus datos de conexión a MySQL local:
```ini
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=reasons_db
```

### 2. Instalar Dependencias
Instala todas las dependencias del proyecto (Raíz, `/backend` y `/frontend`) de manera recursiva en un solo comando:
```bash
npm run install:all
```

### 3. Inicializar Base de Datos y Semillas
Crea las tablas en tu servidor MySQL local y puebla el portal con datos semilla e imágenes predeterminadas:
```bash
# Crear base de datos y tablas estructuradas relacionales
npm run db:init

# Insertar contenido institucional inicial e imágenes por defecto
npm run db:seed
```

### 4. Iniciar Servidores de Desarrollo
Arranca la API de Express (puerto 3000) y la SPA de Angular con Tailwind (puerto 4200) de manera concurrente con un único script:
```bash
npm run start:dev
```

### 5. Exponer a Internet (Túnel Único)
Para que cualquier dispositivo externo pueda acceder a tu portal completo de forma segura (Frontend + Backend + Fotos):
```bash
cloudflared tunnel --url http://localhost:4200
```
¡Abre el enlace público que te devuelva Cloudflare (ej. `https://xxxx.trycloudflare.com`) en tu celular o tablet y navega sin límites!

---

## 🎨 Paleta Visual Premium y UX

El portal cuenta con un diseño de UI/UX sumamente pulido y premium:
*   **Tipografía de Portafolio**: Google Font **Outfit** como fuente primaria para títulos (aportando impacto tecnológico e ingeniería limpia) e **Inter** para textos (máxima legibilidad).
*   **Micro-animaciones de Estado**: Hover cards con escalados suaves, transiciones fluidas de menús y efectos dinámicos de gradientes interactivos.
*   **Bordes de Alta Gama y Sombras**: Sombras flotantes premium (`box-shadow`), tarjetas con bordes redondeados y efectos glassmorphic con blur dinámico.
*   **Diseño 100% Responsivo**: Adaptabilidad nativa en grids para pantallas Retina, notebooks, tablets y teléfonos mediante menús drawer colapsables.

---

## 🔑 Credenciales Administrativas por Defecto
*   **Panel de Login**: `http://localhost:4200/admin/login` (o en tu enlace de Cloudflare)
*   **Usuario**: `admin`
*   **Contraseña**: `AdminReasons2026!`
*   **Buzón de Pruebas OpenAPI (Swagger UI)**: `http://localhost:3000/api-docs` (sandbox interactivo de la API)

---

## 👤 Autor
* **Desarrollo Full-Stack**: [Tu Nombre / GitHub Profile]
* **Propósito**: Proyecto de Portafolio Profesional de Alto Impacto diseñado para el Grupo de Investigación **REASONS** (Universidad Técnica de Ambato).
