import React, { useState } from 'react';
import { 
  Activity, 
  Wallet, 
  RotateCw, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Layers, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard, PaymentQueue, BatchPaymentModal } from './FinanceComponents';

// Removed hardcoded backendUrl to use relative paths and proxy configuration

export default function FinancePortal({ invoices, searchQuery = '', onReview, user, onDetail }) {
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showBatchModal, setShowBatchModal] = useState(false);

  const stats = {
    pending: invoices.filter(i => i.status === 'Uploaded').reduce((sum, i) => sum + i.amount, 0),
    queue: invoices.filter(i => i.status === 'Approved').reduce((sum, i) => sum + i.amount, 0),
    totalPaid: invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0)
  };

  const handleToggleSelect = (id) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const pendingInvoices = invoices.filter(i => i.status === 'Uploaded');
  const queueInvoices = invoices.filter(i => i.status === 'Approved');
  const historyInvoices = invoices.filter(i => i.status === 'Paid' || i.status === 'Rejected');

  const filteredHistory = historyInvoices.filter(i => 
    (i.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.vendorId?.vendorProfile?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-10 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-4">
              <div className="w-3 h-10 bg-spp-green rounded-full shadow-[0_0_20px_rgba(1,168,98,0.4)]"></div>
              <h2 className="text-3xl md:text-5xl font-black text-spp-navy italic tracking-tighter leading-none uppercase">Settlement <span className="text-spp-green">Command</span></h2>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mt-2 border-l-2 border-spp-green/30 pl-5 italic leading-relaxed opacity-60">
              Authorized Financial Protocol Enforcement & Asset Disbursement Control
           </p>
        </div>
        <div className="flex flex-wrap bg-white p-2 rounded-[28px] border border-slate-100 shadow-xl shadow-spp-navy/5">
          {['Pending', 'Queue', 'History'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 md:px-10 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 italic ${activeTab === tab ? 'bg-spp-navy text-white shadow-lg translate-y-[-1px]' : 'text-slate-300 hover:text-spp-navy'}`}
            >
              {tab === 'Pending' ? 'Clearance' : tab === 'Queue' ? 'Settlement' : 'Archive'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mb-20">
        <StatCard title="Pending Clearance" value={`₹${stats.pending.toLocaleString()}`} icon={<Activity />} trend="Awaiting Protocol" />
        <StatCard title="Settlement Queue" value={`₹${stats.queue.toLocaleString()}`} icon={<Wallet />} trend="Authorized for Sync" />
        <StatCard title="Clearance History" value={`₹${stats.totalPaid.toLocaleString()}`} icon={<CheckCircle />} trend="Session Verified" />
      </div>

      {activeTab === 'Pending' && (
        <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-spp-navy/5">
             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-3xl">
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Operator Identity</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Project Vector</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-center italic">Protocol Value</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right italic">Enforcement</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {pendingInvoices.map(i => (
                        <tr key={i._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => onDetail(i)}>
                           <td className="p-8">
                              <p className="text-spp-navy text-lg font-black tracking-tight italic leading-none">{i.vendorId?.vendorProfile?.companyName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 bg-slate-100 px-2 py-0.5 rounded-lg inline-block">ID: {i.invoiceNumber}</p>
                           </td>
                           <td className="p-8">
                              <p className="text-sm text-spp-navy font-bold leading-none">{i.projectId?.consumerInfo?.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{i.projectId?.propertyDetails?.city}</p>
                           </td>
                           <td className="p-8 text-center">
                              <span className="text-2xl font-black text-spp-navy italic tracking-tighter leading-none">₹{i.amount.toLocaleString()}</span>
                           </td>
                           <td className="p-8 text-right flex items-center justify-end gap-3 translate-y-3">
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onReview(i._id, 'Approved'); }}
                                 className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:rotate-6 active:scale-95"
                                 title="Authorize Clearance"
                              >
                                 <CheckCircle size={20} />
                              </button>
                              <button 
                                 onClick={(e) => { e.stopPropagation(); onReview(i._id, 'Rejected'); }}
                                 className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-rotate-6 active:scale-95"
                                 title="Abort Specification"
                              >
                                 <XCircle size={20} />
                              </button>
                           </td>
                        </tr>
                     ))}
                     {pendingInvoices.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-32 text-center">
                            <div className="flex flex-col items-center gap-8 opacity-20">
                               <RotateCw size={64} className="animate-spin-slow" />
                               <p className="text-[11px] font-black uppercase tracking-[0.8em] italic">Awaiting Incoming Protcols...</p>
                            </div>
                          </td>
                        </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Queue' && (
        <div className="animate-in slide-in-from-right-10 duration-700">
           <PaymentQueue 
              invoices={queueInvoices} 
              selected={selectedInvoices} 
              onSelect={handleToggleSelect}
              onInitiate={() => setShowBatchModal(true)} 
           />
        </div>
      )}

      {activeTab === 'History' && (
        <div className="space-y-10 animate-in slide-in-from-right-10 duration-700">
          <div className="flex justify-between items-center bg-white p-4 rounded-[28px] border border-slate-100 shadow-xl shadow-spp-navy/5">
             <div className="relative flex-grow max-w-md group opacity-40 grayscale pointer-events-none">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" 
                  className="w-full bg-slate-50/50 border border-transparent px-14 py-4 rounded-[20px] text-[11px] font-black text-spp-navy outline-none uppercase placeholder:normal-case shadow-inner"
                  placeholder="Use Navbar Search"
                  disabled
                />
             </div>
             <div className="flex items-center gap-4 pr-4">
                <button className="flex items-center gap-2 px-6 py-4 rounded-[20px] bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">
                   <Filter size={14} /> Refine Logs
                </button>
             </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-spp-navy/5">
             <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                     <tr className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-3xl">
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Clearance ID</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Partner Entity</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Value / Date</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Method</th>
                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right italic">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                     {filteredHistory.map(i => (
                        <tr key={i._id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => onDetail(i)}>
                           <td className="p-8">
                              <p className="text-spp-navy text-sm font-black tracking-tight leading-none">#{i.invoiceNumber.slice(-10)}</p>
                              <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1 italic">Synced Protocol</p>
                           </td>
                           <td className="p-8">
                              <p className="text-spp-navy text-sm font-black italic leading-none">{i.vendorId?.vendorProfile?.companyName}</p>
                           </td>
                           <td className="p-8">
                               <p className="text-lg font-black text-spp-navy italic tracking-tighter leading-none">₹{i.amount.toLocaleString()}</p>
                               <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest mt-1.5">{new Date(i.updatedAt).toLocaleDateString()}</p>
                           </td>
                           <td className="p-8">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                                     <Layers size={14} />
                                  </div>
                                  <p className="text-[10px] text-spp-navy font-black tracking-widest uppercase">{i.paymentMode || 'RTGS'}</p>
                               </div>
                           </td>
                           <td className="p-8 text-right flex items-center justify-end gap-3 translate-y-2">
                               <div className={`px-5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${i.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                  {i.status === 'Paid' ? 'Synchronized' : 'Aborted'}
                               </div>
                               <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-200 group-hover:text-spp-navy group-hover:bg-white group-hover:shadow-lg transition-all">
                                  <ChevronRight size={18} />
                               </button>
                           </td>
                        </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-32 text-center">
                            <div className="flex flex-col items-center gap-8 opacity-20">
                               <Activity size={64} className="opacity-40" />
                               <p className="text-[11px] font-black uppercase tracking-[0.8em] italic">Archive Cache Empty</p>
                            </div>
                          </td>
                        </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {showBatchModal && (
        <BatchPaymentModal
          selectedInvoices={queueInvoices.filter(i => selectedInvoices.includes(i._id))}
          onClose={() => setShowBatchModal(false)}
          onSuccess={() => {
            setShowBatchModal(false);
            setSelectedInvoices([]);
            onRefresh?.();
          }}
        />
      )}
    </div>
  );
}
