import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateDatabaseSchema, initializeConfigModels } from "./services/schemaGenerator";
import { setupDynamicRoutes } from "./routes/dynamicRoutes";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// The current loaded config
export let appConfig: any = null;

app.post("/api/generate", async (req, res) => {
  try {
    const config = req.body;
    
    // Save config for persistence (simple file-based for demo)
    fs.writeFileSync(path.join(__dirname, "current_config.json"), JSON.stringify(config, null, 2));
    appConfig = config;

    // 1. Generate Database Schema based on config
    await generateDatabaseSchema(config.database);

    // 2. Initialize Models/Connections
    await initializeConfigModels(config.database);

    // 3. Setup dynamic routes based on config APIs
    setupDynamicRoutes(app, config.apis, config.database);

    res.json({ message: "Application generated successfully", status: "ok" });
  } catch (error: any) {
    console.error("Error generating application:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/config", (req, res) => {
  if (appConfig) {
    res.json(appConfig);
  } else {
    try {
      const savedConfig = fs.readFileSync(path.join(__dirname, "current_config.json"), "utf8");
      appConfig = JSON.parse(savedConfig);
      
      // Initialize if starting up
      setupDynamicRoutes(app, appConfig.apis, appConfig.database);
      
      res.json(appConfig);
    } catch (e) {
      res.status(404).json({ error: "No configuration found" });
    }
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`AI Generator Backend running on http://localhost:${PORT}`);
});
