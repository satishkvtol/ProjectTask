"use client";

import { useState, useEffect } from "react";
import { Plus, X, ArrowRightLeft } from "lucide-react";
import api from "@/lib/api";

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/colleges');
        setAllColleges(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      if (selectedIds.length === 0) {
        setComparisonData([]);
        return;
      }
      try {
        const res = await api.post('/colleges/compare', { ids: selectedIds });
        setComparisonData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComparison();
  }, [selectedIds]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id && !selectedIds.includes(id) && selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeCollege = (id: string) => {
    setSelectedIds(selectedIds.filter(colId => colId !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center">
          <ArrowRightLeft className="w-8 h-8 mr-3 text-blue-600" />
          Compare Colleges
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
          Select up to 3 colleges side-by-side to compare fees, placement rates, ratings, and locations to help you make the right choice.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add colleges to compare ({selectedIds.length}/3)</h3>
        <div className="flex items-center gap-4">
          <select 
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={handleSelect}
            value=""
            disabled={selectedIds.length >= 3}
          >
            <option value="" disabled>-- Select a college --</option>
            {allColleges.filter(c => !selectedIds.includes(c.id)).map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.location})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Loading colleges...</div>
      ) : selectedIds.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-16 text-center">
          <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium text-lg">No colleges selected</p>
          <p className="text-gray-500 text-sm mt-1">Select at least one college from the dropdown above to start comparing.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-500 uppercase w-1/4">Feature</th>
                {comparisonData.map(c => (
                  <th key={c.id} className="p-4 border-b border-gray-200 bg-gray-50 text-center w-1/4 relative">
                    <button 
                      onClick={() => removeCollege(c.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 bg-white rounded-full shadow-sm"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div 
                      className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-3 bg-cover bg-center border-2 border-white shadow-sm"
                      style={{ backgroundImage: `url(${c.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f'})` }}
                    ></div>
                    <span className="text-lg font-bold text-gray-900 block leading-tight">{c.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-4 font-medium text-gray-900 bg-gray-50">Location</td>
                {comparisonData.map(c => (
                  <td key={c.id} className="p-4 text-center text-gray-700">{c.location}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900 bg-gray-50">Annual Fees</td>
                {comparisonData.map(c => (
                  <td key={c.id} className="p-4 text-center font-bold text-gray-900">₹{c.fees.toLocaleString('en-IN')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900 bg-gray-50">Placement Rate</td>
                {comparisonData.map(c => (
                  <td key={c.id} className="p-4 text-center">
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                      {c.placementRate}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900 bg-gray-50">Student Rating</td>
                {comparisonData.map(c => (
                  <td key={c.id} className="p-4 text-center font-bold text-blue-600">{c.rating} / 5.0</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-900 bg-gray-50">Top Courses</td>
                {comparisonData.map(c => (
                  <td key={c.id} className="p-4 text-center text-sm text-gray-600">
                    {c.courses.slice(0,3).join(", ")} {c.courses.length > 3 && '...'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
