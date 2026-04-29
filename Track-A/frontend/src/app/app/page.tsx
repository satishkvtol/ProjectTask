"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export default function DynamicAppPage() {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataCache, setDataCache] = useState<Record<string, any[]>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetch("http://localhost:5001/api/config")
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setConfig(data);
        // Pre-fetch all readAll APIs
        data.apis.filter((a: any) => a.action === 'readAll').forEach((api: any) => {
          fetchData(api.endpoint);
        });
      })
      .catch(e => {
        console.error(e);
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const fetchData = async (endpoint: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/dynamic${endpoint}`);
      const data = await res.json();
      setDataCache(prev => ({ ...prev, [endpoint]: data }));
    } catch (e) {
      console.error("Failed to fetch data for", endpoint);
    }
  };

  const handleCreate = async (endpoint: string, targetTable: string) => {
    try {
      await fetch(`http://localhost:5001/api/dynamic${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData[targetTable] || {})
      });
      // Clear form
      setFormData(prev => ({ ...prev, [targetTable]: {} }));
      // Refresh data
      fetchData(endpoint);
    } catch (e) {
      console.error("Create failed", e);
    }
  };

  const handleDelete = async (endpoint: string, id: any) => {
    try {
      const deleteEndpoint = endpoint.replace(':id', id.toString());
      await fetch(`http://localhost:5001/api/dynamic${deleteEndpoint}`, {
        method: "DELETE"
      });
      // Find the corresponding readAll endpoint to refresh
      const readApi = config.apis.find((a: any) => a.action === "readAll" && deleteEndpoint.startsWith(a.endpoint));
      if (readApi) fetchData(readApi.endpoint);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleFormChange = (targetTable: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [targetTable]: {
        ...(prev[targetTable] || {}),
        [field]: value
      }
    }));
  };

  if (loading) return <div className="p-10 text-center">Loading dynamic application...</div>;
  if (!config) return null;

  // For this MVP, we render the first page in the config.
  const pageDef = config.ui?.pages?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{config.name}</h1>
          <button 
            onClick={() => router.push("/")}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Configurator
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <h2 className="text-3xl font-extrabold text-gray-800">{pageDef?.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dynamically Render Components */}
          {pageDef?.components.map((comp: any, idx: number) => {
            const apiTarget = config.apis.find((a: any) => a.endpoint === comp.api)?.target;

            if (comp.type === "form") {
              return (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 h-fit">
                  <h3 className="text-lg font-bold mb-4">{comp.title}</h3>
                  <div className="space-y-4">
                    {comp.fields.map((field: any, fIdx: number) => (
                      <div key={fIdx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          value={formData[apiTarget]?.[field.name] || ""}
                          onChange={(e) => handleFormChange(apiTarget, field.name, e.target.value)}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleCreate(comp.api, apiTarget)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md flex justify-center items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Save
                    </button>
                  </div>
                </div>
              );
            }

            if (comp.type === "table") {
              const tableData = dataCache[comp.api] || [];
              const deleteApi = config.apis.find((a: any) => a.action === "delete" && a.target === apiTarget);
              
              return (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold">{comp.title}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          {comp.columns.map((col: string, cIdx: number) => (
                            <th key={cIdx} className="p-4 bg-gray-50 text-sm font-semibold text-gray-600 uppercase border-b border-gray-200">
                              {col}
                            </th>
                          ))}
                          {deleteApi && <th className="p-4 bg-gray-50 text-sm font-semibold text-gray-600 uppercase border-b border-gray-200 text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {!Array.isArray(tableData) || tableData.length === 0 ? (
                          <tr>
                            <td colSpan={comp.columns.length + (deleteApi ? 1 : 0)} className="p-8 text-center text-gray-500">
                              {Array.isArray(tableData) 
                                ? "No data found. Add some records to see them here." 
                                : "Error fetching data from database. Please check your DB connection."}
                            </td>
                          </tr>
                        ) : (
                          tableData.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
                              {comp.columns.map((col: string, cIdx: number) => (
                                <td key={cIdx} className="p-4 text-gray-900">{row[col]}</td>
                              ))}
                              {deleteApi && (
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDelete(deleteApi.endpoint, row.id)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </main>
    </div>
  );
}
