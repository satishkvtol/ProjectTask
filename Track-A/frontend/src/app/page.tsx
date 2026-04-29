"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Play, Database, Server, Layout } from "lucide-react";

export default function GeneratorPage() {
  const router = useRouter();
  const [configStr, setConfigStr] = useState(`{
  "name": "Employee Dashboard",
  "database": {
    "tables": [
      {
        "name": "employees",
        "fields": [
          {"name": "name", "type": "string", "required": true},
          {"name": "role", "type": "string", "required": true},
          {"name": "department", "type": "string", "required": true}
        ]
      }
    ]
  },
  "apis": [
    {"method": "GET", "endpoint": "/employees", "action": "readAll", "target": "employees"},
    {"method": "POST", "endpoint": "/employees", "action": "create", "target": "employees"},
    {"method": "DELETE", "endpoint": "/employees/:id", "action": "delete", "target": "employees"}
  ],
  "ui": {
    "pages": [
      {
        "path": "/",
        "type": "dashboard",
        "title": "Employee Management",
        "components": [
          {
            "type": "table",
            "title": "All Employees",
            "api": "/employees",
            "columns": ["id", "name", "role", "department"]
          },
          {
            "type": "form",
            "title": "Add New Employee",
            "api": "/employees",
            "fields": [
              {"name": "name", "label": "Full Name", "type": "text"},
              {"name": "role", "label": "Job Title", "type": "text"},
              {"name": "department", "label": "Department", "type": "text"}
            ]
          }
        ]
      }
    ]
  }
}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    
    try {
      const config = JSON.parse(configStr);
      
      const response = await fetch("http://localhost:5001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate application");
      }
      
      router.push("/app");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="flex items-center">
          <Settings className="text-blue-600 w-8 h-8 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">AI App Generator</h1>
        </div>
      </header>

      <main className="flex-grow p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Left Side: JSON Editor */}
        <div className="flex-grow flex flex-col">
          <h2 className="text-lg font-medium text-gray-700 mb-2">JSON Configuration</h2>
          <textarea
            className="flex-grow w-full p-4 font-mono text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-gray-100 min-h-[500px]"
            value={configStr}
            onChange={(e) => setConfigStr(e.target.value)}
          />
          {error && <div className="mt-3 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        </div>

        {/* Right Side: Instructions & Generate */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold mb-4">How it works</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Database className="text-indigo-500 w-6 h-6 mr-3 flex-shrink-0" />
                <p className="text-gray-600 text-sm"><strong className="text-gray-900">Database:</strong> Define your tables and schema. The generator provisions PostgreSQL tables.</p>
              </li>
              <li className="flex items-start">
                <Server className="text-indigo-500 w-6 h-6 mr-3 flex-shrink-0" />
                <p className="text-gray-600 text-sm"><strong className="text-gray-900">APIs:</strong> Define endpoints, methods, and targets. Dynamic routes are exposed securely.</p>
              </li>
              <li className="flex items-start">
                <Layout className="text-indigo-500 w-6 h-6 mr-3 flex-shrink-0" />
                <p className="text-gray-600 text-sm"><strong className="text-gray-900">UI:</strong> Define pages and components. React automatically renders them linked to the APIs.</p>
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl shadow-sm transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Application..." : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Generate & Deploy App
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
