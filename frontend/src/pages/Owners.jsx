import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Owners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get('/owners');
        setOwners(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch owners", err);
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const filtered = owners.filter(o => 
    o.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.license_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60 gap-4">
        <h1 className="text-xl font-bold text-slate-800">Vehicle Owners</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search name or license..."
              className="w-full pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all shadow-sm text-sm"
              style={{ paddingLeft: "3.2rem" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link to="/owners/new" className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all whitespace-nowrap">
            + New Owner
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex justify-center items-center text-slate-500">
            {search ? `No owners found matching "${search}"` : "No owners registered yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filtered.map(owner => (
              <div key={owner.owner_id} className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg className="w-48 h-48 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                
                <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                      {owner.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight truncate max-w-[150px]">{owner.full_name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1 bg-slate-100/80 px-2 py-0.5 rounded inline-block border border-slate-200 shadow-sm">{owner.license_number}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-6 pt-5 border-t border-slate-100 relative z-10 w-full">
                  <div className="flex items-center text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="font-medium">{owner.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="font-medium truncate block max-w-full">{owner.email || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="absolute top-6 right-6 z-20">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm flex items-center gap-1.5 ${
                    owner.license_status === 'SUSPENDED' 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${owner.license_status === 'SUSPENDED' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    {owner.license_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Owners;
