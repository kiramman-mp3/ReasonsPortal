const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Cargar variables de entorno del archivo .env en la raíz
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.error('\x1b[31mError: No se encontró el archivo .env en la raíz del proyecto.\x1b[0m');
  process.exit(1);
}
require('dotenv').config({ path: envPath });

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

async function runMigration() {
  console.log('\x1b[36m==================================================\x1b[0m');
  console.log('\x1b[36m    ACTUALIZADOR DE ESQUEMA DE BASE DE DATOS      \x1b[0m');
  console.log('\x1b[36m==================================================\x1b[0m');
  console.log(`Conectando a MySQL en ${DB_HOST}:${DB_PORT} base: ${DB_NAME}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      database: DB_NAME
    });

    console.log('\x1b[32m✔ Conexión exitosa a MySQL.\x1b[0m');

    // 1. Agregar columna 'lines' a 'research_lines' si no existe
    console.log('Comprobando columna \'lines\' en \'research_lines\'...');
    const [rlCols] = await connection.query('SHOW COLUMNS FROM research_lines LIKE \'lines\'');
    if (rlCols.length === 0) {
      console.log('Añadiendo columna \'lines\' a la tabla \'research_lines\'...');
      await connection.query('ALTER TABLE research_lines ADD COLUMN `lines` TEXT NULL;');
      console.log('\x1b[32m✔ Columna \'lines\' agregada exitosamente.\x1b[0m');
    } else {
      console.log('✔ La columna \'lines\' ya existe.');
    }

    // 2. Agregar columna 'research_line_id' a 'projects' si no existe
    console.log('Comprobando columna \'research_line_id\' en \'projects\'...');
    const [pCols] = await connection.query('SHOW COLUMNS FROM projects LIKE \'research_line_id\'');
    if (pCols.length === 0) {
      console.log('Añadiendo columna \'research_line_id\' a la tabla \'projects\'...');
      await connection.query('ALTER TABLE projects ADD COLUMN research_line_id INT NULL;');
      
      console.log('Estableciendo clave foránea para \'research_line_id\'...');
      await connection.query(`
        ALTER TABLE projects 
        ADD CONSTRAINT fk_projects_research_line 
        FOREIGN KEY (research_line_id) REFERENCES research_lines(id) 
        ON DELETE SET NULL;
      `);
      console.log('\x1b[32m✔ Columna \'research_line_id\' y relación agregadas exitosamente.\x1b[0m');
    } else {
      console.log('✔ La columna \'research_line_id\' ya existe.');
    }

    // 3. Comprobar si 'research_lines' está vacía y sembrar los 3 ejes iniciales
    console.log('Verificando si la tabla \'research_lines\' tiene registros...');
    const [existingLines] = await connection.query('SELECT COUNT(*) AS count FROM research_lines');
    if (existingLines[0].count === 0) {
      console.log('La tabla \'research_lines\' está vacía. Insertando los 3 ejes por defecto...');
      await connection.query(`
        INSERT INTO research_lines (id, settings_id, title, description, icon, \`lines\`, order_index) VALUES 
        (1, 1, 'Diseño, Materiales, Producción, Identidad, Sostenibilidad y Tecnologías aplicadas', 'Enfoque en la creación de productos ecológicos, análisis del ciclo de vida, optimización de materiales e innovaciones en procesos productivos industriales.', 'bi-palette', 'Diseño de productos ecológicos, Análisis de ciclo de vida, Optimización de materiales, Innovaciones en procesos industriales', 1),
        (2, 1, 'Software, Tecnologías de la Información y Ciencias de Datos', 'Desarrollo de sistemas de información inteligentes, análisis predictivos usando Big Data, soluciones móviles y automatización aplicada a la resolución de problemas científicos y sociales.', 'bi-code-slash', 'Sistemas de información inteligentes, Big Data y analítica predictiva, Desarrollo de aplicaciones móviles y web, Automatización científica', 2),
        (3, 1, 'Energía, Desarrollo Sostenible y Gestión de Recursos Naturales', 'Estudio de energías renovables, mitigación de la huella de carbono, optimización del recurso hídrico y conservación ambiental a través de la ingeniería.', 'bi-globe-americas', 'Energías renovables y limpias, Mitigación de huella de carbono, Optimización de recursos hídricos, Conservación ambiental', 3)
      `);
      console.log('\x1b[32m✔ Los 3 ejes por defecto han sido insertados exitosamente.\x1b[0m');
    } else {
      console.log('✔ La tabla \'research_lines\' ya contiene registros.');
    }

    // 4. Sembrar/actualizar datos de líneas de investigación específicas dinámicamente si faltan
    console.log('Sembrando líneas de investigación específicas por defecto de forma dinámica...');
    const [allRlRows] = await connection.query('SELECT id, title FROM research_lines');
    
    const defaultLinesMap = {
      'Diseño': 'Diseño de productos ecológicos, Análisis de ciclo de vida, Optimización de materiales, Innovaciones en procesos industriales',
      'Software': 'Sistemas de información inteligentes, Big Data y analítica predictiva, Desarrollo de aplicaciones móviles y web, Automatización científica',
      'Energía': 'Energías renovables y limpias, Mitigación de huella de carbono, Optimización de recursos hídricos, Conservación ambiental'
    };

    for (const rlRow of allRlRows) {
      let matchedLines = '';
      for (const [key, val] of Object.entries(defaultLinesMap)) {
        if (rlRow.title.toLowerCase().includes(key.toLowerCase())) {
          matchedLines = val;
          break;
        }
      }
      if (!matchedLines) {
        matchedLines = 'Líneas generales de investigación aplicadas a la ingeniería y sostenibilidad';
      }
      
      console.log(`Sembrando líneas para Eje #${rlRow.id} ("${rlRow.title.substring(0, 20)}...")...`);
      await connection.query('UPDATE research_lines SET `lines` = ? WHERE id = ?', [matchedLines, rlRow.id]);
    }
    console.log('\x1b[32m✔ Sembrado de líneas específicas completado.\x1b[0m');

    // 5. Si hay proyectos existentes sin research_line_id, asociarlos al primer eje por defecto
    console.log('Comprobando proyectos sin clasificar...');
    const [rlRows] = await connection.query('SELECT id FROM research_lines ORDER BY id ASC LIMIT 1');
    if (rlRows.length > 0) {
      const defaultLineId = rlRows[0].id;
      const [projRows] = await connection.query('SELECT id, title FROM projects WHERE research_line_id IS NULL');
      if (projRows.length > 0) {
        console.log(`Clasificando ${projRows.length} proyectos bajo el Eje #${defaultLineId} por defecto...`);
        await connection.query('UPDATE projects SET research_line_id = ? WHERE research_line_id IS NULL', [defaultLineId]);
        console.log('\x1b[32m✔ Proyectos clasificados exitosamente.\x1b[0m');
      } else {
        console.log('✔ Todos los proyectos ya están clasificados.');
      }
    } else {
      console.log('⚠ No hay ejes de investigación en la base de datos para asociar a los proyectos.');
    }

    console.log('\x1b[32m==================================================\x1b[0m');
    console.log('\x1b[32m✔ ¡MIGRACIÓN DE BASE DE DATOS COMPLETADA CON ÉXITO!\x1b[0m');
    console.log('\x1b[32m==================================================\x1b[0m');

  } catch (error) {
    console.error('\x1b[31m✖ ERROR EN LA MIGRACIÓN DE LA BASE DE DATOS:\x1b[0m');
    console.error(error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
