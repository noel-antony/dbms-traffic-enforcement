import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AddViolation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_id: "",
    officer_id: "",
    violation_type_id: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesResponse, vehiclesResponse, officersResponse] = await Promise.all([
          api.get('/violation-types'),
          api.get('/vehicles'),
          api.get('/officers')
        ]);
        setTypes(typesResponse.data);
        setVehicles(vehiclesResponse.data);
        setOfficers(officersResponse.data);
        
        // If logged in user is an officer, set the officer_id automatically
        if (user && user.role === 'OFFICER' && user.user_id) {
          setFormData(prev => ({...prev, officer_id: parseInt(user.user_id, 10)}));
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.officer_id) { alert('Please select an issuing officer.'); return; }
      setLoading(true);
    try {
      await api.post('/violations', {
        ...formData,
        // officer_id is securely extracted from the JWT token on the backend side
        status: 'UNPAID'
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to submit citation", err);
      alert("Error: " + (err.response?.data?.error || "Failed to submit citation"));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
            <div>
                <h1 className="text-xl font-bold text-slate-800">Issue Citation</h1>
                <p className="text-sm text-slate-500 mt-1">Record a new traffic violation</p>
            </div>
            <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Vehicle (Registration)</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700 font-mono uppercase"
                            value={formData.vehicle_id}
                            onChange={(e) => setFormData({...formData, vehicle_id: parseInt(e.target.value, 10)})}
                        >
                            <option value="" disabled>Select vehicle...</option>
                            {vehicles.map(v => (
                                <option key={v.vehicle_id} value={v.vehicle_id}>
                                    {v.registration_number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Violation Type</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700"
                            value={formData.violation_type_id}
                            onChange={(e) => setFormData({...formData, violation_type_id: e.target.value})}
                        >
                            <option value="" disabled>Select infraction...</option>
                            {types.map(t => (
                              <option key={t.violation_type_id} value={t.violation_type_id}>{t.violation_name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Location of Incident</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <input 
                                required
                                type="text" 
                                placeholder="Street name, Intersection, etc."
                                className="w-full pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                                style={{ paddingLeft: "3.2rem" }}
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Issuing Officer</label>
                          <select
                              required
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700"
                              value={formData.officer_id}
                              onChange={(e) => setFormData({...formData, officer_id: parseInt(e.target.value, 10)})}
                          >
                              <option value="" disabled>Select officer...</option>
                              {officers.map(o => (
                                <option key={o.officer_id} value={o.officer_id}>{o.name} ({o.badge_number})</option>
                              ))}
                          </select>
                      </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Officer Notes / Description</label>
                    <textarea 
                        rows="4"
                        placeholder="Provide details about the incident..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center min-w-[140px]"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : 'Submit Citation'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
export default AddViolation;