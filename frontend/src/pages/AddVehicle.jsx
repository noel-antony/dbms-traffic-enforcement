import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    registration_number: "",
    owner_id: "",
    vehicle_type: "Car",
    model: "",
    color: "",
    is_blacklisted: false
  });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get('/owners');
        setOwners(response.data);
      } catch (err) {
        console.error("Failed to load owners", err);
      }
    };
    fetchOwners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/vehicles', formData);
      navigate('/vehicles');
    } catch (err) {
      console.error("Failed to add vehicle", err);
      alert("Error: " + (err.response?.data?.error || "Failed to add vehicle"));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
            <div>
                <h1 className="text-xl font-bold text-slate-800">Register New Vehicle</h1>
                <p className="text-sm text-slate-500 mt-1">Add a vehicle to the registry</p>
            </div>
            <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Registration Number</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g., AB-12-CD-3456"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-mono uppercase"
                            value={formData.registration_number}
                            onChange={(e) => setFormData({...formData, registration_number: e.target.value.toUpperCase()})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Owner</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700"
                            value={formData.owner_id}
                            onChange={(e) => setFormData({...formData, owner_id: parseInt(e.target.value, 10)})}
                        >
                            <option value="" disabled>Select owner...</option>
                            {owners.map(o => (
                              <option key={o.owner_id} value={o.owner_id}>{o.full_name} ({o.license_number})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Vehicle Type</label>
                        <select 
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-slate-700"
                            value={formData.vehicle_type}
                            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                        >
                            <option value="Car">Car</option>
                            <option value="Motorcycle">Motorcycle</option>
                            <option value="Truck">Truck</option>
                            <option value="Bus">Bus</option>
                            <option value="Van">Van</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Model</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g., Honda Civic"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            value={formData.model}
                            onChange={(e) => setFormData({...formData, model: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Color</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g., Red"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            value={formData.color}
                            onChange={(e) => setFormData({...formData, color: e.target.value})}
                        />
                    </div>
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
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : 'Register Vehicle'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};
export default AddVehicle;