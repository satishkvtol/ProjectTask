import Link from "next/link";
import { MapPin, IndianRupee, Star } from "lucide-react";

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  placementRate: number;
  rating: number;
  imageUrl?: string | null;
}

export default function CollegeCard({ college }: { college: College }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div 
        className="h-48 w-full bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${college.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'})` }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            <Link href={`/colleges/${college.id}`} className="hover:text-blue-600">
              {college.name}
            </Link>
          </h3>
          <div className="flex items-center bg-green-100 px-2 py-1 rounded text-green-800 text-xs font-bold">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {college.rating}
          </div>
        </div>
        
        <div className="text-gray-500 text-sm flex items-center mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {college.location}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Avg. Fees</p>
            <p className="font-bold text-gray-900 flex items-center">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {college.fees.toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Placement</p>
            <p className="font-bold text-gray-900 text-right">{college.placementRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
