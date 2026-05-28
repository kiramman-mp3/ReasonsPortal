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

async function migrateHomeImages() {
  console.log('\x1b[36m==================================================\x1b[0m');
  console.log('\x1b[36m   INICIANDO MIGRACIÓN DE IMÁGENES DE INICIO     \x1b[0m');
  console.log('\x1b[36m==================================================\x1b[0m');

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST || 'localhost',
      port: DB_PORT || 3306,
      user: DB_USER || 'root',
      password: DB_PASSWORD || '',
      database: DB_NAME || 'reasons_db'
    });

    // 1. Verificar si existen las columnas en site_settings
    const [columns] = await connection.query('SHOW COLUMNS FROM site_settings');
    const columnNames = columns.map(c => c.Field);

    let altered = false;

    if (!columnNames.includes('purpose_image_url')) {
      console.log('Agregando columna purpose_image_url a la tabla site_settings...');
      await connection.query("ALTER TABLE site_settings ADD COLUMN purpose_image_url VARCHAR(255) DEFAULT 'uploads/sustainability_research.png'");
      altered = true;
    }

    if (!columnNames.includes('cta_image_url')) {
      console.log('Agregando columna cta_image_url a la tabla site_settings...');
      await connection.query("ALTER TABLE site_settings ADD COLUMN cta_image_url VARCHAR(255) DEFAULT 'uploads/team_collaboration.png'");
      altered = true;
    }

    // 2. Si se alteró o si los valores son nulos, rellenarlos con la ruta por defecto
    if (altered) {
      console.log('Rellenando valores por defecto para purpose_image_url y cta_image_url...');
      await connection.query(`
        UPDATE site_settings 
        SET purpose_image_url = 'uploads/sustainability_research.png', 
            cta_image_url = 'uploads/team_collaboration.png' 
        WHERE id = 1 AND (purpose_image_url IS NULL OR cta_image_url IS NULL OR purpose_image_url = '' OR cta_image_url = '')
      `);
      console.log('✔ Valores por defecto aplicados.');
    } else {
      // Incluso si ya existen, asegurar que no estén nulos/vacíos en el registro id = 1
      await connection.query(`
        UPDATE site_settings 
        SET purpose_image_url = IF(purpose_image_url IS NULL OR purpose_image_url = '', 'uploads/sustainability_research.png', purpose_image_url),
            cta_image_url = IF(cta_image_url IS NULL OR cta_image_url = '', 'uploads/team_collaboration.png', cta_image_url)
        WHERE id = 1
      `);
      console.log('✔ Columnas ya existían. Datos limpios validados.');
    }

    console.log('\x1b[32m==================================================\x1b[0m');
    console.log('\x1b[32m✔ ¡MIGRACIÓN DE BASE DE DATOS FINALIZADA CON ÉXITO! \x1b[0m');
    console.log('\x1b[32m==================================================\x1b[0m');

  } catch (err) {
    console.error('\x1b[31m✖ ERROR EN LA MIGRACIÓN DE LA BASE DE DATOS:\x1b[0m');
    console.error(err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateHomeImages();
