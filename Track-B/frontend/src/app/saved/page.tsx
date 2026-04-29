"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, AlertCircle } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SavedCollegesPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [savedColleges, setSavedColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchSavedColleges = async () => {
      try {
        const response = await api.get('/colleges/saved/me');
        setSavedColleges(response.data);
      } catch (error) {
        console.error("Failed to fetch saved colleges", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedColleges();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
        <Bookmark className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Saved Colleges</h1>
          <p className="text-gray-500 mt-1">Colleges you are interested in applying to.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-xl"></div>
          ))}
        </div>
      ) : savedColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedColleges.map((college: any) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-16 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No saved colleges yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't saved any colleges to your profile. Browse the colleges directory and click "Save College" to add them here.
          </p>
          <button 
            onClick={() => router.push('/colleges')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Browse Colleges
          </button>
        </div>
      )}
    </div>
  );
}
