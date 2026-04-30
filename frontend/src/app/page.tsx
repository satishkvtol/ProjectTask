"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import api from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await api.get('/colleges');
        // Get top 3 rated colleges as featured
        const sorted = response.data.sort((a: any, b: any) => b.rating - a.rating);
        setFeaturedColleges(sorted.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/colleges');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-700 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-20 pattern-grid-lg"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Find Your Dream College Today
          </h1>
          <p className="text-xl text-blue-100 mb-10">
            Discover top institutions, compare fees, and read reviews to make the best choice for your future.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
            <div className="flex-grow flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for colleges, universities..."
                className="w-full py-3 px-4 text-gray-900 focus:outline-none rounded-l-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Colleges</h2>
            <p className="text-gray-500 mt-2">Top rated institutions based on student reviews and placements.</p>
          </div>
          <button
            onClick={() => router.push('/colleges')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View all colleges &rarr;
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredColleges.map((college: any) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
