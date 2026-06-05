# Manual de Operaciones y Ejecución: Portal REASONS

Este manual detalla los pasos y comandos requeridos para la instalación, inicialización de bases de datos, despliegue y resolución de problemas del Portal Web REASONS en un entorno local o de producción.

---

## 1. Prerrequisitos del Sistema

Antes de iniciar el proyecto, asegúrate de tener instalado en tu sistema local:
* **Node.js**: Versión `v20.x` o superior (se sugiere utilizar versiones LTS).
* **NPM**: Administrador de paquetes de Node (instalado automáticamente junto a Node.js).
* **MySQL Server**: Versión `8.0` o superior (puede ser a través de XAMPP, Laragon, WAMP o una instalación autónoma de MySQL).

---

## 2. Configuración del Archivo de Entorno (`.env`)

El proyecto requiere un archivo de variables de entorno `.env` en la raíz del proyecto y otro en la carpeta `backend` para configurar las credenciales de base de datos y la clave secreta de tokens JWT.

1. En la raíz del proyecto, haz una copia del archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```
2. Abre el archivo `.env` recientemente creado y define las credenciales de tu servidor de MySQL local:
   ```ini
   # Configuración de la Base de Datos MySQL
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_contraseña_mysql (déjalo vacío si no requiere contraseña)
   DB_NAME=reasons_db

   # Configuración del Backend Express
   PORT=3000
   JWT_SECRET=reasons_uta_ultra_secure_jwt_secret_key_2026_!

   # Entorno (development / production)
   NODE_ENV=development
   ```
3. Copia este mismo archivo `.env` dentro de la carpeta `/backend`:
   ```bash
   cp .env backend/.env
   ```

---

## 3. Instalación de Dependencias

Para instalar todas las dependencias del proyecto de forma automatizada y recursiva tanto en la raíz, como en el backend y el frontend, ejecuta el siguiente comando en la raíz del proyecto:
```bash
npm run install:all
```
*(Este comando instalará Concurrently en la raíz, Express y dependencias de seguridad en el backend, y el Framework Angular con Tailwind CSS en el frontend).*

---

## 4. Inicialización y Semillado de la Base de Datos

### 4.1. Crear las Tablas y Estructura SQL
Para crear de forma física la base de datos `reasons_db` e inicializar todas las tablas relacionales y claves foráneas, ejecuta en la raíz:
```bash
npm run db:init
```
*(El script leerá el archivo `/docs/database_schema.sql` y creará las tablas optimizadas en motor InnoDB).*

### 4.2. Insertar Datos Semilla e Imágenes Predeterminadas
Para poblar las tablas con datos institucionales (misión, visión, objetivos, carrusel de inicio, líneas de investigación) y generar físicamente los archivos de imágenes semilla base en la carpeta `backend/uploads` (evitando imágenes rotas iniciales), ejecuta en la raíz:
```bash
npm run db:seed
```

### 4.3. Crear Usuarios Administradores Adicionales
Si deseas crear un usuario administrador personalizado o actualizar la contraseña del usuario `admin` por defecto, puedes ejecutar el CLI interactivo de consola:
```bash
npm run db:admin
```
*(Sigue las instrucciones en la consola para definir el usuario y la contraseña, la cual será encriptada automáticamente con bcrypt usando 12 rondas de sal).*

---

## 5. Lanzamiento del Portal en Desarrollo

Para arrancar de forma concurrente el servidor backend de Express (puerto `3000`) y el cliente SPA de Angular (puerto `4200`), ejecuta en la raíz:
```bash
npm run start:dev
```
* **API Backend**: Se iniciará con `nodemon` en el puerto `3000` para autorecargarse automáticamente ante cualquier cambio de código.
* **Angular Client**: Se iniciará y estará disponible en [http://localhost:4200](http://localhost:4200) con proxy configurado en `proxy.conf.json` hacia la API.

---

## 6. Resolución de Problemas Comunes

### 6.1. Error: `ECONNREFUSED` al conectar con MySQL
* **Causa**: El servidor backend de Express no puede establecer comunicación con MySQL en el puerto e IP indicados en el `.env`.
* **Solución**:
  1. Verifica que tu servidor local de MySQL (XAMPP, Laragon o servicio de Windows) esté encendido.
  2. Confirma que el puerto configurado en el archivo `.env` sea el mismo en el que corre tu MySQL (por ejemplo, si corre en el `3307`, cámbialo en el `.env`).
  3. Si tu usuario de MySQL requiere contraseña, asegúrate de colocarla en la variable `DB_PASSWORD`.

### 6.2. Error: MySQL shutdown unexpectedly (Cierre inesperado en XAMPP)
* **Causa**: En Windows, XAMPP suele corromper los archivos de logs de InnoDB (`ibdata1`, `ib_logfile0`, etc.) ante un apagado forzado de la PC, impidiendo que MySQL inicie.
* **Solución (Restauración Limpia)**:
  1. Detén todos los servicios en **XAMPP Control Panel** y ciérralo.
  2. Abre tu explorador de archivos y ve a `C:\xampp\mysql\`.
  3. Renombra la carpeta `data` a `data_old`.
  4. Crea una nueva carpeta vacía llamada `data`.
  5. Copia todos los archivos y carpetas que están dentro de la carpeta `backup` (`C:\xampp\mysql\backup\`) y pégalos en la nueva carpeta `data`.
  6. Abre **XAMPP Control Panel** e inicia MySQL (ahora arrancará sin problemas).
  7. Dado que restauramos los datos de fábrica de XAMPP, abre tu consola del proyecto y vuelve a inicializar y sembrar los datos:
     ```bash
     npm run db:init
     npm run db:seed
     ```
