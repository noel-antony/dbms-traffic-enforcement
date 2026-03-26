import { useState, useEffect } from "react";
import api from "../services/api";

const Payments = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const response = await api.get('/fines-extended');
        setFines(response.data);
      } catch (err) {
        console.error("Failed to load fines", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFines();
  }, []);

  const handleProcess = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await api.post('/payments', {
        fine_id: selectedFine.fine_id,
        amount_paid: selectedFine.amount,
        payment_method: "CARD"
      });
      // Optionally update fine status here if your backend doesn't handle it
      setFines(fines.filter(f => f.fine_id !== selectedFine.fine_id));
      setSelectedFine(null);
    } catch (err) {
      console.error("Failed to process payment", err);
      alert("Payment error: " + (err.response?.data?.error || "Unknown"));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-5 rounded-xl shadow-md border border-white/60">
        <h1 className="text-xl font-bold text-slate-800">Pending Fines & Collections</h1>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Receipt / Fine ID</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Amount Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fines.map(fine => (
                  <tr key={fine.fine_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </span>
                        <span className="font-mono text-sm font-semibold text-slate-700">#{fine.fine_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm">
                        {fine.registration_number || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 text-lg">${parseFloat(fine.amount).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold border bg-yellow-50 text-yellow-700 border-yellow-200">
                        PENDING
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedFine(fine)}
                        className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold rounded-lg shadow-sm transition-all active:scale-95"
                      >
                        Process Payment
                      </button>
                    </td>
                  </tr>
                ))}
                {fines.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-12 h-12 mb-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-medium text-slate-500">All fines have been settled.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedFine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-fade-in scale-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Clear Invoice</h3>
              <button onClick={() => setSelectedFine(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <span className="text-sm font-medium text-slate-500">Fine Amount</span>
                <span className="text-lg font-black text-slate-800">${parseFloat(selectedFine.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm text-slate-500">Vehicle</span>
                <span className="text-sm font-bold text-slate-700">{selectedFine.registration_number || 'Unknown'}</span>
              </div>
            </div>

            <form onSubmit={handleProcess}>
              <button 
                type="submit" 
                disabled={processing}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : "Confirm Remittance"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Payments;