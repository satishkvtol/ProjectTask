"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import api from "@/lib/api";

function CollegesList() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");
  
  const fetchColleges = async () => {
    setLoading(true);
    try {
      let query = `/colleges?`;
      if (search) query += `search=${encodeURIComponent(search)}&`;
      if (location) query += `location=${encodeURIComponent(location)}&`;
      if (maxFees) query += `maxFees=${encodeURIComponent(maxFees)}&`;
      
      const response = await api.get(query);
      setColleges(response.data);
    } catch (error) {
      console.error("Error fetching colleges", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchColleges();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Colleges</h1>
          <p className="text-gray-500 mt-1">Find the best institution matching your criteria.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center mb-4 text-lg font-bold text-gray-900 border-b pb-3">
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </div>
            
            <form onSubmit={handleFilterSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. IIT"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Mumbai"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fees (₹)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 500000"
                  value={maxFees}
                  onChange={(e) => setMaxFees(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex justify-center items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-xl"></div>
              ))}
            </div>
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colleges.map((college: any) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No colleges found</h3>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setMaxFees("");
                  setTimeout(() => handleFilterSubmit({ preventDefault: () => {} } as any), 0);
                }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <CollegesList />
    </Suspense>
  );
}
