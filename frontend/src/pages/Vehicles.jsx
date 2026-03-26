import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load vehicles.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter(v => 
    v.vehicle_id?.toString().toLowerCase().includes(search.toLowerCase()) || 
    v.registration_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Vehicle Registry</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            {vehicles.length} Total
          </span>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search License Plate..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all shadow-sm"
              style={{ paddingLeft: "3.2rem" }}
            />
          </div>
          <Link to="/vehicles/new" className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all whitespace-nowrap">
            + New Vehicle
          </Link>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse flex space-x-4 mb-6 border-b border-slate-100 pb-6 last:border-0 last:mb-0 last:pb-0">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-medium">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 flex flex-col items-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="font-medium">
              {search ? `No vehicles found matching "${search}"` : "No vehicles registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-6 py-4">License Plate</th>
                  <th className="px-6 py-4">Make / Model</th>
                  <th className="px-6 py-4">Body Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map(vehicle => (
                  <tr key={vehicle.vehicle_id} className="hover:bg-slate-50 even:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{vehicle.registration_number || vehicle.vehicle_id}</td>
                    <td className="px-6 py-4 text-slate-600">{vehicle.make || 'Unknown'} {vehicle.model || ''}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{vehicle.vehicle_type || vehicle.body_type || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                        !vehicle.is_blacklisted
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                      }`}>
                        {vehicle.is_blacklisted ? "BLACKLISTED" : "ACTIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/vehicles/${vehicle.vehicle_id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-all active:scale-95"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Vehicles;