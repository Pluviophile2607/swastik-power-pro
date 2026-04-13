import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FilePlus, 
  ChevronDown 
} from 'lucide-react';

export default function UploadInvoiceModal({ projects, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    projectId: '',
    amount: '',
    invoiceNumber: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a valid digital protocol file.");
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('projectId', formData.projectId);
      data.append('amount', formData.amount);
      data.append('invoiceNumber', formData.invoiceNumber);
      data.append('invoiceFile', selectedFile);

      await api.post('/invoice/upload', data, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      onSuccess();
    } catch (err) {
      alert("Transmission Failure: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-spp-navy/80 backdrop-blur-xl animate-in fade-in duration-700" onClick={onClose}></div>
      <div className="relative w-full max-w-[480px] bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        <div className="p-10 md:p-12 space-y-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-spp-green rounded-full shadow-[0_0_10px_rgba(1,168,98,0.3)]"></div>
                <h3 className="text-3xl font-black text-spp-navy italic tracking-tighter leading-none">Clearance <span className="text-spp-green">Protocol</span></h3>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1 border-l-2 border-spp-green/20 pl-4 italic leading-relaxed opacity-70">Initiate settlement synchronization session</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 block italic opacity-50">Hardware Reference</label>
                <div className="relative group">
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-[20px] text-xs font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all appearance-none cursor-pointer shadow-inner pr-14 group-hover:bg-white"
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Select Project Protocol...</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id} className="font-bold">{p.consumerInfo.name} — {p.propertyDetails.city}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-spp-green">
                     <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 block italic opacity-50">Gross Value (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Enter valuation"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-[20px] text-sm font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all shadow-inner hover:bg-white"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 block italic opacity-50">Protocol ID</label>
                  <input 
                    type="text" 
                    required
                    placeholder="INV-2026-X"
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 rounded-[20px] text-sm font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all shadow-inner uppercase hover:bg-white"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 block italic opacity-50">Digital Audit Data</label>
                <div className="relative group/file">
                   <input 
                     type="file" 
                     required
                     className="absolute inset-0 opacity-0 cursor-pointer z-10"
                     onChange={(e) => setSelectedFile(e.target.files[0])}
                   />
                   <div className="w-full bg-slate-50 border-2 border-dashed border-slate-100 px-6 py-8 rounded-[28px] flex flex-col items-center justify-center gap-3 group-hover/file:border-spp-green group-hover/file:bg-white transition-all duration-300 shadow-inner">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg group-hover/file:scale-110 transition-all duration-500 border border-slate-50">
                        <FilePlus size={24} className="text-spp-green" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-spp-navy uppercase tracking-[0.2em] max-w-[200px] truncate">
                          {selectedFile ? selectedFile.name : 'Inject protocol document'}
                        </p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest opacity-60 mt-1">PDF, PNG, JPG (5MB Max)</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-[24px] bg-white border-2 border-slate-50 text-slate-300 font-black text-[10px] uppercase tracking-[0.3em] hover:border-red-50 hover:text-red-500 transition-all active:scale-95 italic"
              >
                Abort
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 rounded-[24px] bg-spp-navy text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-spp-navy/20 hover:bg-spp-green hover:text-spp-navy transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 italic"
              >
                {loading ? 'Transmitting...' : <>Finalize Settlement <div className="w-2 h-2 bg-spp-green rounded-full animate-ping"></div></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
