import React, { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../services/api';
import { 
  CheckCircle, 
  Wallet, 
  Eye, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};

export function StatCard({ title, value, icon, trend, variant = 'primary' }) {
  const getTheme = () => {
    switch (title.toLowerCase()) {
      case 'pending clearance': return { 
        glow: 'bg-amber-400/20', 
        accent: 'text-amber-500', 
        border: 'border-amber-100',
        bg: 'bg-amber-50/30'
      };
      case 'settlement queue': return { 
        glow: 'bg-emerald-400/20', 
        accent: 'text-emerald-500', 
        border: 'border-emerald-100',
        bg: 'bg-emerald-50/30'
      };
      case 'clearance history': return { 
        glow: 'bg-spp-navy/20', 
        accent: 'text-spp-navy', 
        border: 'border-slate-200',
        bg: 'bg-slate-50/30'
      };
      default: return { 
        glow: 'bg-spp-navy/10', 
        accent: 'text-spp-navy', 
        border: 'border-slate-100',
        bg: 'bg-white'
      };
    }
  };

  const theme = getTheme();

  return (
    <div 
      className={`group p-8 rounded-[32px] bg-white border ${theme.border} flex flex-col gap-10 transition-all duration-300 relative overflow-hidden shadow-sm`}
    >
      <div className="flex justify-start items-center gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.accent} shadow-sm transition-all duration-300`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className={`flex items-center gap-2 px-4 py-1.5 ${theme.bg} border ${theme.border} rounded-xl text-[9px] font-black tracking-widest uppercase transition-all`}>
          <div className={`w-1.5 h-1.5 ${theme.accent} rounded-full`}></div> 
          <span className="text-slate-500">{trend}</span>
        </div>
      </div>
 
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3 opacity-60">
           <div className={`w-3 h-[2px] ${theme.accent} rounded-full`}></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">{title}</span>
        </div>
        <h4 className="text-4xl font-extra-black text-spp-navy italic tracking-tighter leading-none">{value}</h4>
        <div className="pt-2">
           <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div className={`h-full ${theme.accent.replace('text', 'bg')} opacity-40 w-2/3`} />
           </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentQueue({ invoices, selected, onSelect, onInitiate }) {
  const totalAmount = invoices
    .filter(i => selected.includes(i._id))
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-spp-navy/5">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-3xl">
              <th className="p-6 w-20">
                <div className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white"></div>
              </th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Partner Protocol</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-center italic">Clearance Value</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Account Parameters</th>
              <th className="p-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right italic">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold">
            {invoices.map(i => (
              <tr key={i._id} className={`group hover:bg-slate-50/50 transition-all ${selected.includes(i._id) ? 'bg-emerald-50/30' : ''}`}>
                <td className="p-6">
                  <div 
                    onClick={() => onSelect(i._id)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${selected.includes(i._id) ? 'bg-spp-navy border-spp-navy text-white shadow-md' : 'border-slate-200 bg-white'}`}
                  >
                     {selected.includes(i._id) && <CheckCircle size={14} />}
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-spp-navy text-base font-black tracking-tight italic leading-none">{i.vendorId?.vendorProfile?.companyName}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1.5 bg-slate-100/50 inline-block px-2.5 py-0.5 rounded-lg">ID: {i.invoiceNumber}</p>
                </td>
                <td className="p-6 text-center">
                   <span className="text-xl font-black text-spp-navy italic tracking-tighter leading-none">₹{i.amount.toLocaleString()}</span>
                </td>
                <td className="p-6">
                   <p className="text-[10px] text-spp-navy font-black tracking-widest uppercase leading-none">{i.vendorId?.vendorProfile?.bankDetails?.accountNumber}</p>
                   <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] opacity-60 mt-0.5">IFSC: {i.vendorId?.vendorProfile?.bankDetails?.ifscCode}</p>
                </td>
                <td className="p-6 text-right flex items-center justify-end gap-2 translate-y-1">
                   <button 
                     onClick={() => {
                        if (i.vendorId?.vendorProfile?.documents?.length > 0) {
                          window.open(getFullUrl(i.vendorId.vendorProfile.documents[0]), '_blank');
                        } else {
                          alert("No verification media synchronization for this operator.");
                        }
                     }}
                     className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-300 hover:bg-spp-green hover:text-spp-navy transition-all group/vault"
                     title="Access Partner Media Vault"
                   >
                      <Layers size={16} className="group-hover/vault:rotate-12 transition-transform" />
                   </button>
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                      Authorized
                   </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-6 text-slate-200">
                    <CheckCircle size={48} className="opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Settlement protocols synchronized.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
     </div>

      {selected.length > 0 && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-8 p-6 md:p-8 rounded-[40px] bg-spp-navy shadow-[0_30px_80px_rgba(15,23,42,0.3)] flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10 backdrop-blur-xl"
        >
           <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[24px] bg-white/10 flex items-center justify-center text-spp-green shadow-inner">
                 <ShieldCheck size={32} />
              </div>
              <div className="space-y-1 text-center md:text-left">
                 <div className="flex items-baseline gap-3">
                    <p className="text-white text-3xl font-black italic tracking-tighter leading-none">₹{totalAmount.toLocaleString()}</p>
                    <div className="w-1.5 h-1.5 bg-spp-green rounded-full animate-pulse"></div>
                 </div>
                 <p className="text-[10px] font-black text-spp-green uppercase tracking-[0.4em] mt-0.5">{selected.length} Batch Settlement Protocols Selected</p>
              </div>
           </div>
           <button 
             onClick={onInitiate}
             className="w-full md:w-auto bg-spp-green text-spp-navy px-12 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-spp-green/30"
           >
             Initialize Disbursement Cycle
           </button>
        </motion.div>
      )}
    </div>
  );
}

export function BatchPaymentModal({ selectedInvoices, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    transactionRef: '',
    paymentMode: 'NEFT'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const totalAmount = selectedInvoices.reduce((sum, i) => sum + i.amount, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/invoice/batch-pay', {
        invoiceIds: selectedInvoices.map(i => i._id),
        ...formData
      });
      onSuccess();
    } catch (err) {
      alert("Terminal Fault: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 bg-spp-navy/80 backdrop-blur-2xl animate-in fade-in duration-700" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-700 border border-white/20">
        <div className="p-10 md:p-12 space-y-12">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-spp-navy italic tracking-tighter leading-none">Settlement <span className="text-spp-green">Protocol</span></h3>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1 border-l-2 border-spp-green/30 pl-4">Disbursement Verification & Final Execution</p>
            </div>
            <div className="text-right space-y-1">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Total Batch Value</p>
               <p className="text-2xl font-black text-spp-navy italic tracking-tighter leading-none">₹{totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">Execution Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[28px] text-[13px] font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all shadow-inner"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">Payment Mode</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[28px] text-[13px] font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all appearance-none cursor-pointer shadow-inner"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({...formData, paymentMode: e.target.value})}
                >
                  <option value="NEFT">NEFT (Standard Protocol)</option>
                  <option value="RTGS">RTGS (High Value Clearance)</option>
                  <option value="IMPS">IMPS (Immediate Transfer)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">Transaction Reference Number (UTR)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. AXIS_SYNC_99827"
                  className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[28px] text-[13px] font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all uppercase placeholder:normal-case shadow-inner"
                  value={formData.transactionRef}
                  onChange={(e) => setFormData({...formData, transactionRef: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 space-y-6 shadow-inner">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-2">Protocol Confirmation Inventory</p>
               <div className="flex flex-wrap gap-3">
                  {selectedInvoices.map(inv => (
                    <div key={inv._id} className="px-5 py-2.5 bg-white border border-slate-100 rounded-[18px] text-[10px] font-black text-spp-navy shadow-sm flex items-center gap-3">
                       <span className="opacity-40">#{inv.invoiceNumber.slice(-4)}</span>
                       <span className="text-spp-green font-black tracking-tight">₹{inv.amount.toLocaleString()}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex gap-6 pt-6">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-7 rounded-[28px] bg-white border-2 border-slate-100 text-slate-300 font-black text-[11px] uppercase tracking-widest hover:border-red-100 hover:text-red-500 transition-all active:scale-95"
              >
                Abort Protocol
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-7 rounded-[28px] bg-spp-navy text-white font-black text-[11px] uppercase tracking-widest shadow-[0_20px_60px_rgba(15,23,42,0.3)] hover:bg-spp-green hover:text-spp-navy transition-all disabled:opacity-50 flex items-center justify-center gap-4 active:scale-95"
              >
                {loading ? 'Transmitting Data...' : <>Finalize Disbursement <div className="w-2 h-2 bg-spp-green rounded-full animate-ping"></div></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
