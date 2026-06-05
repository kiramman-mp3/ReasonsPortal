# Manual del Usuario: Administración del Portal REASONS

Este manual detalla el funcionamiento del panel de administración del Portal Web Institucional del grupo de investigación **REASONS** (Universidad Técnica de Ambato), diseñado para gestionar todo el contenido público del sitio sin requerir conocimientos técnicos ni modificaciones en el código fuente.

---

## 1. Acceso al Panel de Administración

El panel administrativo es privado y requiere credenciales válidas:

1. **Dirección de Acceso**: Navega a [http://localhost:4200/admin/login](http://localhost:4200/admin/login) o haz clic en el botón **Portal Administrador** de la barra de navegación superior.
2. **Credenciales por Defecto**:
   * **Usuario**: `admin`
   * **Contraseña**: `AdminReasons2026!`
3. **Persistencia de Sesión**: Si inicias sesión y cierras la ventana, la sesión se mantendrá activa por 24 horas. Al hacer clic nuevamente en **Portal Administrador**, entrarás directamente al panel de control sin necesidad de volver a ingresar tus credenciales.

> [!WARNING]
> Cambia tu contraseña o crea administradores adicionales mediante el comando de consola `npm run db:admin` en la raíz del proyecto para evitar accesos no autorizados en producción.

---

## 2. Configuración General e Identidad del Portal

En el módulo **Configuración** (menú izquierdo) se administran los textos institucionales, los colores de marca y el logotipo oficial. Está dividido en 5 pestañas de control:

### 2.1. Información General (Pestaña 1)
Permite modificar los textos fundamentales del grupo:
* **Nombre del Grupo** e **Institución**.
* **Descripción Corta**: Párrafo de presentación que se muestra en el inicio y en el pie de página global.
* **Objetivo General**, **Misión** y **Visión**.
* **Datos de Contacto**: Dirección física de las oficinas, correo electrónico principal y ciudad/país.

*Para aplicar estos cambios, haz clic en el botón **Guardar y Aplicar Cambios** al final del formulario.*

### 2.2. Colores y Logotipo (Pestaña 2)
Aquí se gestiona la apariencia e identidad visual:
* **Paleta de Colores**: Utiliza los selectores visuales para definir el *Color Primario*, *Color Secundario* y *Color de Acento*. Todo el portal adaptará su paleta cromática en tiempo real de forma dinámica una vez que guardes los cambios.
* **Logotipo Institucional**:
  1. Haz clic en **Examinar** o **Seleccionar Archivo** bajo la sección *Subir Nuevo Logotipo*.
  2. Al seleccionar la imagen, el sistema comprimirá el archivo automáticamente para optimizar el tamaño de carga.
  3. Haz clic en **Confirmar Subida de Logo** para guardarlo en la base de datos y aplicarlo en la cabecera.

### 2.3. Imágenes Ilustrativas de Inicio (Home)
Ubicadas en la pestaña *Colores y Logotipo*, permiten modificar las dos grandes ilustraciones de la página pública de inicio:
1. **Imagen de Propósito**: Se muestra junto al objetivo general y visión.
2. **Imagen de Colaboración**: Se muestra en el marco azul inferior de llamado a la acción (CTA).
* **Instrucciones de Subida**:
  * Haz clic en seleccionar archivo bajo la tarjeta correspondiente.
  * Se habilitará de inmediato el botón de confirmación en color verde (**Confirmar Imagen Propósito** o **Confirmar Imagen Colaboración**).
  * Haz clic en el botón de confirmación para guardar la imagen en el servidor y ver el resultado en vivo.

### 2.4. Objetivos Específicos (Pestaña 3)
* **Agregar**: Haz clic en el botón **Agregar Objetivo** superior derecho, se añadirá una fila en blanco al final de la lista. Escribe el texto del objetivo.
* **Eliminar**: Haz clic en el botón rojo de papelera junto a la fila que deseas eliminar.
* Haz clic en **Guardar y Aplicar Cambios** al pie para guardar la lista completa.

### 2.5. Líneas de Investigación (Pestaña 4)
Gestión de los Ejes Temáticos prioritarios expuestos en la página pública:
* **Ejes Temáticos**: Cada eje se compone de un *Título*, un *Icono de Bootstrap* (ej: `bi-code-slash`), una *Descripción del Alcance* y sus *Líneas específicas asociadas* (redactadas como texto separado por comas).
* Haz clic en **Agregar Eje Temático** para crear uno nuevo, o haz clic en la papelera roja para removerlo. Haz clic en **Guardar y Aplicar Cambios** para consolidar los cambios.

---

## 3. Gestión del Carrusel de Portada (Pestaña 5)

Permite administrar el carrusel de fondo conautoplay que se muestra al inicio del portal:

### 3.1. Agregar Diapositiva
1. Al final de la pestaña, localiza el formulario **Cargar Nueva Diapositiva al Carrusel**.
2. Ingresa el *Título*, *Subtítulo / Mensaje* y el *Orden numérico de aparición* (ej: 1, 2, 3).
3. Selecciona el archivo de imagen (se recomiendan imágenes paisajísticas horizontales de alta resolución).
4. Haz clic en **Agregar Nueva Diapositiva**.

### 3.2. Modificar o Eliminar Diapositiva
* Cada diapositiva existente se lista con su imagen miniatura actual.
* Puedes modificar sus textos, cambiar su orden numérico o seleccionar un archivo de reemplazo en su tarjeta. Haz clic en el botón **Actualizar** de su tarjeta correspondiente para guardar los cambios de ese elemento específico.
* Haz clic en **Eliminar** en la tarjeta para remover permanentemente la diapositiva del sistema (esto también borrará el archivo de imagen del servidor para liberar espacio de almacenamiento).

---

## 4. Gestión del Equipo (Investigadores)

Modulo para administrar a los miembros del grupo de investigación:

* **Listado General**: Muestra a todos los investigadores registrados con su cargo y correo.
* **Agregar Investigador**:
  1. Haz clic en **Registrar Investigador** (botón superior derecho).
  2. Llena la información: *Nombres*, *Correo Institucional*, *Cargo/Rol* (ej: Director, Investigador Principal), *Biografía Corta*, enlace a *ORCID* y redes de contacto opcionales.
  3. Selecciona una fotografía (se sugiere formato cuadrado o tipo perfil de hasta 5MB).
  4. Haz clic en **Guardar Investigador**.
* **Editar**: Haz clic en el icono azul de lápiz de la fila del investigador, modifica sus datos o selecciona una nueva foto de perfil, y haz clic en **Guardar Cambios**.
* **Eliminar**: Haz clic en el icono rojo de papelera para dar de baja al investigador.

---

## 5. Gestión del Catálogo de Proyectos

* **Registrar Proyecto**: Haz clic en **Nuevo Proyecto**.
  * Llena los campos obligatorios: *Título del Proyecto*, *Descripción General*, *Objetivos del Proyecto* y *Resultados Obtenidos*.
  * **Eje Temático**: Selecciona del menú desplegable el Eje de Investigación correspondiente al que se asocia el proyecto.
  * **Investigadores Asociados**: Marca la casilla de verificación de cada miembro del equipo que participa en el proyecto.
  * **Portada**: Selecciona una imagen representativa para el catálogo público.
  * Haz clic en **Crear Proyecto**.
* **Editar y Eliminar**: Usa los botones correspondientes en la tabla de administración. Al eliminar un proyecto, se eliminan sus relaciones Todos a Todos con investigadores y su archivo de imagen en el servidor.

---

## 6. Gestión de Publicaciones Científicas

* **Registrar Publicación**: Haz clic en **Nueva Publicación**.
  * Completa el *Título*, *Resumen (Abstract)* y la *Cita Bibliográfica* en formato APA/IEEE.
  * **Enlace DOI**: Agrega el enlace directo a la editorial científica (ej: `https://doi.org/10.1016/...`).
  * **Autores del Grupo**: Selecciona las casillas correspondientes a los investigadores del grupo que son coautores del artículo.
  * **Portada de la Revista**: Sube de manera opcional una imagen de la portada del volumen o revista indexada.
  * Haz clic en **Crear Publicación**.

---

## 7. Bandeja del Formulario de Contacto (Mensajes)

Permite visualizar e interactuar con los mensajes que envían los visitantes públicos desde el formulario de contacto:

* **Lectura**: Los mensajes nuevos se muestran con el estado **Sin Leer** y fondo destacado. Haz clic en el mensaje para desplegar su contenido completo.
* **Estados**:
  * Haz clic en el botón de verificación para marcar un mensaje como **Leído** (cambiará de estado y removerá el fondo destacado).
  * Haz clic en el botón de flecha/correo para marcarlo como **Respondido** (si ya le escribiste un correo de respuesta al remitente).
* **Eliminación**: Haz clic en el botón rojo de papelera para borrar el mensaje del buzón de entrada de forma permanente.

---

## 8. Herramientas de Accesibilidad Universal (Portal Público)

Para garantizar la inclusión y el cumplimiento de las pautas de accesibilidad web, el portal cuenta con un **Widget Flotante de Accesibilidad** accesible desde cualquier sección pública del sitio (esquina inferior derecha con icono de accesibilidad):

* **Tamaño de Texto**: Permite ajustar dinámicamente la escala tipográfica entre tres niveles: *Normal*, *Grande* y *Muy Grande*.
* **Alto Contraste**: Invierte y optimiza los esquemas de color (fondos oscuros profundos y textos amarillos/blancos brillantes) para mejorar drásticamente la visibilidad en personas con baja visión o fatiga ocular.
* **Tipografía Accesible (Dislexia)**: Cambia la fuente del portal a una tipografía optimizada con mayor peso en la base de los caracteres, facilitando la lectura a personas con dislexia.
* **Reducir Movimiento**: Desactiva todas las transiciones CSS y animaciones en caliente (incluido el deslizamiento automático del carrusel de portada) para usuarios propensos a mareos o sensibilidad al movimiento.
* **Resaltar Enlaces**: Aplica un estilo de subrayado e indicador de enfoque de alto contraste a todos los enlaces interactivos del sitio.

> [!NOTE]
> La configuración de accesibilidad seleccionada por el visitante se almacena automáticamente en su navegador mediante `localStorage`, de forma que sus preferencias se mantendrán activas en visitas futuras.

