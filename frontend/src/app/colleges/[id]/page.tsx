"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, IndianRupee, Star, BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [college, setCollege] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const res = await api.get(`/colleges/${params.id}`);
        setCollege(res.data);
        
        // If authenticated, check if saved
        if (isAuthenticated) {
          const savedRes = await api.get('/colleges/saved/me');
          const savedIds = savedRes.data.map((c: any) => c.id);
          setIsSaved(savedIds.includes(params.id));
        }
      } catch (error) {
        console.error("Failed to fetch college details", error);
        toast.error("Failed to load college details");
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchCollegeDetails();
    }
  }, [params.id, isAuthenticated]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save colleges");
      router.push('/login');
      return;
    }
    
    try {
      if (isSaved) {
        await api.delete(`/colleges/${params.id}/save`);
        setIsSaved(false);
        toast.success("Removed from saved colleges");
      } else {
        await api.post(`/colleges/${params.id}/save`);
        setIsSaved(true);
        toast.success("College saved successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update saved status");
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-xl font-semibold animate-pulse">Loading college details...</div>;
  }

  if (!college) {
    return <div className="p-20 text-center text-xl font-semibold">College not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      <div 
        className="w-full h-64 md:h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${college.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 max-w-7xl mx-auto">
          <div className="flex justify-between items-end">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{college.name}</h1>
              <div className="flex items-center text-gray-200 text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {college.location}
              </div>
            </div>
            <button 
              onClick={handleSaveToggle}
              className={`hidden md:flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isSaved ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-5 h-5 mr-2" /> : <Bookmark className="w-5 h-5 mr-2" />}
              {isSaved ? 'Saved' : 'Save College'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mobile Save Button */}
          <button 
            onClick={handleSaveToggle}
            className={`w-full md:hidden flex justify-center items-center px-4 py-3 rounded-lg font-medium shadow-sm transition-colors ${
              isSaved ? 'bg-green-600 text-white' : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5 mr-2" /> : <Bookmark className="w-5 h-5 mr-2" />}
            {isSaved ? 'Saved' : 'Save College'}
          </button>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              {college.description || `${college.name} is a premier institution located in ${college.location}. It offers various programs and has a strong track record of placements.`}
            </p>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Courses Offered
            </h2>
            <div className="flex flex-wrap gap-3">
              {college.courses?.map((course: string, idx: number) => (
                <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full font-medium text-sm">
                  {course}
                </span>
              ))}
            </div>
          </section>
          
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Student Reviews</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-sm mr-3">5.0</div>
                  <span className="font-medium text-gray-900">Excellent academics</span>
                </div>
                <p className="text-gray-600 text-sm">Great campus life and extremely supportive faculty. Placements are top notch.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded text-sm mr-3">4.0</div>
                  <span className="font-medium text-gray-900">Good infrastructure</span>
                </div>
                <p className="text-gray-600 text-sm">Labs are well equipped but hostel food can be improved.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Average Fees / Year</p>
                  <p className="text-xl font-bold text-gray-900">₹{college.fees.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Placement Rate</p>
                  <p className="text-xl font-bold text-gray-900">{college.placementRate}%</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="bg-yellow-100 p-3 rounded-full mr-4 text-yellow-600">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Student Rating</p>
                  <p className="text-xl font-bold text-gray-900">{college.rating} / 5.0</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-600 rounded-xl shadow-sm text-white p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Interested?</h3>
            <p className="mb-4 text-blue-100 text-sm">Add this college to compare it with others and make an informed decision.</p>
            <button 
              onClick={() => router.push('/compare')}
              className="bg-white text-blue-600 hover:bg-gray-100 w-full py-2 rounded-lg font-bold transition-colors"
            >
              Compare College
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
