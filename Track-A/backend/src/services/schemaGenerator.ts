import { Pool } from "pg";

let pool: Pool | null = null;

export async function generateDatabaseSchema(dbConfig: any) {
  if (!dbConfig || !dbConfig.tables) return;

  // Assuming POSTGRES_URL is provided in environment
  const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
  
  if (!pool) {
    pool = new Pool({ connectionString });
  }

  for (const table of dbConfig.tables) {
    const tableName = table.name;
    let createTableQuery = `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
    
    // Always add an ID column
    createTableQuery += `  id SERIAL PRIMARY KEY,\n`;
    
    for (const field of table.fields) {
      if (field.name === 'id') continue;
      
      let type = "VARCHAR(255)";
      if (field.type === "string") type = "VARCHAR(255)";
      if (field.type === "text") type = "TEXT";
      if (field.type === "number") type = "INTEGER";
      if (field.type === "boolean") type = "BOOLEAN";
      if (field.type === "date") type = "TIMESTAMP";
      
      createTableQuery += `  "${field.name}" ${type} ${field.required ? "NOT NULL" : ""},\n`;
    }
    
    createTableQuery += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    createTableQuery += `);`;

    try {
      await pool.query(createTableQuery);
      console.log(`Table ${tableName} created or verified.`);
    } catch (e: any) {
      console.error(`Error creating table ${tableName}:`, e.message);
    }
  }
}

export async function initializeConfigModels(dbConfig: any) {
  // Can be used for setting up ORM models if needed.
  // Using direct pg queries so just returning for now.
}

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
    pool = new Pool({ connectionString });
  }
  return pool;
}
