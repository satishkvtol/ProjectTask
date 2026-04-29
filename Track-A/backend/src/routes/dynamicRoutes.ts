import { Express, Request, Response } from "express";
import { getDbPool } from "../services/schemaGenerator";

export function setupDynamicRoutes(app: Express, apisConfig: any[], dbConfig: any) {
  if (!apisConfig) return;

  apisConfig.forEach(api => {
    const routePath = `/api/dynamic${api.endpoint}`;
    console.log(`Setting up dynamic route: [${api.method}] ${routePath}`);
    
    app[api.method.toLowerCase() as keyof Express](routePath, async (req: Request, res: Response) => {
      try {
        const pool = getDbPool();
        const action = api.action;
        const targetTable = api.target;

        if (action === "readAll") {
          const result = await pool.query(`SELECT * FROM "${targetTable}" ORDER BY id DESC`);
          return res.json(result.rows);
        }
        
        if (action === "create") {
          const data = req.body;
          const keys = Object.keys(data).filter(k => k !== 'id');
          const values = keys.map(k => data[k]);
          
          if (keys.length === 0) return res.status(400).json({ error: "No data provided" });

          const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
          const query = `INSERT INTO "${targetTable}" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${placeholders}) RETURNING *`;
          
          const result = await pool.query(query, values);
          return res.status(201).json(result.rows[0]);
        }
        
        if (action === "readOne") {
          const id = req.params.id;
          if (!id) return res.status(400).json({ error: "ID required" });
          const result = await pool.query(`SELECT * FROM "${targetTable}" WHERE id = $1`, [id]);
          return res.json(result.rows[0]);
        }

        if (action === "delete") {
          const id = req.params.id;
          if (!id) return res.status(400).json({ error: "ID required" });
          await pool.query(`DELETE FROM "${targetTable}" WHERE id = $1`, [id]);
          return res.json({ success: true });
        }
        
        return res.status(400).json({ error: "Unsupported action" });
      } catch (error: any) {
        console.error(`Error in dynamic route ${routePath}:`, error.message);
        res.status(500).json({ error: error.message });
      }
    });
  });
}
