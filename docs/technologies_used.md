# Especificación de Arquitectura Tecnológica - Portal REASONS

Este documento detalla el ecosistema tecnológico, frameworks, bibliotecas de seguridad y utilitarios del ciclo de vida que componen el **Portal Web Institucional REASONS** para la **Universidad Técnica de Ambato**. El sistema utiliza una arquitectura desacoplada **Full Stack** (SPA + REST API).

---

## 🎨 1. Frontend (Cliente SPA)

El frontend está desarrollado bajo el paradigma de **Single Page Application (SPA)**, priorizando una interfaz adaptativa (diseño responsivo) y una experiencia estética de alta calidad.

| Tecnología / Biblioteca | Versión | Propósito y Aplicación en el Proyecto |
| :--- | :---: | :--- |
| **Angular** | `v21.x` | Framework core para el desarrollo de la interfaz de usuario. Utiliza arquitectura basada en **Componentes Standalone**, enrutamiento reactivo y carga diferida (lazy loading). |
| **RxJS** | `v7.8.x` | Biblioteca para programación reactiva. Empleada para el manejo asíncrono de peticiones HTTP, reactividad en servicios y mapeo de flujos de datos. |
| **Tailwind CSS** | `v4.x` | Framework de diseño CSS-First. Utilizado para implementar un sistema visual premium con animaciones suaves, bordes redondeados y efectos glassmorphism responsivos. |
| **@tailwindcss/postcss** | `v4.x` | Plugin oficial para integrar la compilación moderna de Tailwind v4 en la canalización de construcción de Angular CLI a través de PostCSS. |
| **Bootstrap Icons** | `v1.11.x` | Conjunto de iconos vectoriales tipográficos utilizados en la navegación, el sidebar de administración y los ejes temáticos de investigación. |
| **Canvas API** | *Nativo* | Utilizado del lado del cliente en [`image-compressor.ts`](file:///c:/Users/johan/OneDrive/Documentos/Universidad/Web%20y%20Moviles/Ape03/frontend/src/app/core/utils/image-compressor.ts) para escalar y comprimir imágenes pesadas antes de la subida física a la red, previniendo el error *File too large*. |

### 💡 Patrones y Características Destacadas en el Frontend:
*   **Signals (Señales de Angular)**: Empleado para la gestión de estados reactivos en tiempo de ejecución (ej: datos de configuración, previsualizaciones de imágenes, alertas, estado de sesión JWT).
*   **Inyección Dinámica de Temas**: El servicio `ConfigService` inyecta dinámicamente variables CSS custom properties en el `:root` del DOM recuperadas desde MySQL en el primer arranque (`APP_INITIALIZER`), lo que permite que el tema de Tailwind cambie instantáneamente en tiempo real sin recompilar.
*   **Seguridad Activa (Auth Guard e Interceptor)**: Un interceptor HTTP adjunta el token JWT (`Bearer <token>`) en cada petición saliente protegida, y un guardia funcional (`authGuard`) bloquea el acceso no autenticado al panel administrativo.

---

## ⚙️ 2. Backend (REST API)

El servidor REST está construido sobre una plataforma modular y asíncrona, robustecida con múltiples capas de seguridad activa y validación de datos.

| Tecnología / Biblioteca | Versión | Propósito y Aplicación en el Proyecto |
| :--- | :---: | :--- |
| **Node.js** | `v24.x` | Entorno de ejecución asíncrono y orientado a eventos de JavaScript en el servidor. |
| **Express** | `v4.19.x` | Framework web rápido y minimalista utilizado para estructurar las rutas REST, middlewares, carga estática de archivos `/uploads` y controladores MVC. |
| **MySQL2 (Promise)** | `v3.9.x` | Controlador de base de datos MySQL con soporte nativo de Promesas (`async/await`) y uso de **Connection Pools** para optimizar la concurrencia. |
| **jsonwebtoken (JWT)** | `v9.0.x` | Generación y validación de tokens seguros y firmados criptográficamente para proteger los endpoints CRUD del administrador. |
| **bcryptjs** | `v2.4.x` | Algoritmo de encriptación hash adaptativo (coste de 12 rondas de sal) utilizado para almacenar de forma totalmente segura las contraseñas de los administradores. |
| **multer** | `v1.4.x` | Middleware especializado en el procesamiento de peticiones `multipart/form-data` para realizar la carga física de imágenes en la carpeta `/uploads`. |
| **express-rate-limit** | `v7.2.x` | Capa de seguridad que limita las peticiones por IP en login y formulario de contacto para mitigar ataques de fuerza bruta y denegación de servicio (DoS). |
| **express-validator** | `v7.0.x` | Middleware robusto de validación y sanitización. Sanitiza entradas de texto mediante el escape automático de caracteres anti-XSS y aplica tipado fuerte. |
| **helmet** | `v7.1.x` | Asegura la aplicación Express configurando de forma automática diversos encabezados HTTP de seguridad (Clickjacking, XSS Protection, Sniffing). |
| **cors** | `v2.8.x` | Configura el intercambio de recursos de origen cruzado para permitir la conexión selectiva de la SPA de Angular. |
| **swagger-ui-express** | `v5.0.x` | Sirve la interfaz interactiva gráfica de Swagger en la ruta `/api-docs` para pruebas en vivo de la API. |
| **swagger-jsdoc** | `v6.2.x` | Compila y valida la especificación de OpenAPI 3.0 integrada de los endpoints. |

---

## 🛠️ 3. Herramientas de Ciclo de Vida y Despliegue (`/utils`)

Biblioteca de scripts internos construida de forma nativa para la automatización de la base de datos, semillas y exposición externa.

*   **Procesos Concurrentes (`start-dev.js`)**: Lanzador nativo asíncrono que inicia simultáneamente y con logs coloreados el backend de Express (puerto 3000) y el frontend de Angular (puerto 4200) heredando las variables del PATH del sistema de forma segura.
*   **Inicializador Físico (`db-init.js`)**: Lee el DDL de base de datos desde [`docs/database_schema.sql`](file:///c:/Users/johan/OneDrive/Documentos/Universidad/Web%20y%20Moviles/Ape03/docs/database_schema.sql), crea la base de datos `reasons_db` e inicializa las 10 tablas relacionales MySQL de forma atómica.
*   **Semillero Inteligente (`db-seed.js`)**: Puebla la base con datos semilla institucionales y **genera dinámicamente imágenes reales mínimas en base64** en la carpeta `/uploads` para evitar enlaces de imagen rotos en el primer arranque.
*   **Limpiador Completo (`db-clean.js`)**: Utilidad en un solo click para truncar de forma atómica las 10 tablas del sistema MySQL (reiniciando autoincrementales a 1) y re-semillar de forma segura la cuenta del administrador para evitar bloqueos.
*   **Exposición y Proxy Unificado**: El frontend de Angular se configuró con un proxy (`proxy.conf.json`) y parámetros de seguridad `allowedHosts` en `angular.json` para permitir la **exposición Full Stack con un único túnel de Cloudflare (`cloudflared`)** apuntando al puerto `4200`, encapsulando interfaz y API en un solo host seguro.
