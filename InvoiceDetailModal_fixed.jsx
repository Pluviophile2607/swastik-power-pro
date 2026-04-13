function InvoiceDetailModal({ invoice, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-700/5 shadow-sm';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-700/5 shadow-sm';
      case 'Approved': return 'bg-sky-50 text-sky-700 border-sky-100 shadow-sky-700/5 shadow-sm';
      default: return 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-700/5 shadow-sm';
    }
  };

  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-spp-navy/80 backdrop-blur-xl animate-in fade-in duration-700" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-[0_50px_120px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
        <div className="p-8 md:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                 <h3 className="text-2xl font-black text-spp-navy tracking-tighter italic leading-none">#{invoice.invoiceNumber.slice(-8)}</h3>
                 <div className="w-1.5 h-1.5 bg-spp-green rounded-full animate-ping"></div>
              </div>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 border-l-2 border-spp-green/30 pl-3 italic opacity-70">Financial Protocol Intelligence Unit</p>
            </div>
            <div className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-md transition-all ${getStatusColor(invoice.status)}`}>
               {invoice.status}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-[32px] bg-spp-navy shadow-2xl shadow-spp-navy/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-20 h-20 bg-spp-green opacity-10 blur-2xl translate-x-10 -translate-y-10"></div>
               <div className="relative z-10 space-y-1 text-center sm:text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic leading-none">Clearance Value</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter leading-none">₹{invoice.amount.toLocaleString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-4 shadow-inner">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">Deployment Channel</p>
                  <div className="space-y-2">
                     <h4 className="text-lg font-black text-spp-navy tracking-tight italic leading-tight truncate">{invoice.projectId?.consumerInfo?.name || 'Protocol Offline'}</h4>
                     <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                           <MapPin size={10} className="text-spp-green"/> {invoice.projectId?.propertyDetails?.city || 'HQ'}
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                           <Zap size={10} className="text-spp-green"/> {invoice.projectId?.energyProfile?.desiredCapacity}kW
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between shadow-inner">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-none">Sync Date</p>
                    <p className="text-[10px] font-black text-spp-navy uppercase tracking-widest">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-200">
                    <Activity size={18} />
                  </div>
               </div>
            </div>

            {invoice.status === 'Paid' && (
              <div className="p-6 rounded-[24px] bg-emerald-50/40 border border-emerald-100 space-y-4">
                 <div className="flex justify-between items-center text-[8px] font-black text-emerald-800 uppercase tracking-[0.4em] italic border-b border-emerald-100 pb-2">
                    <span>Disbursement Telemetry</span>
                    <CheckCircle size={10} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">UTR Ref</p>
                       <p className="text-[10px] font-black text-spp-navy truncate">{invoice.transactionRef || 'AXIS_S_9921'}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Method</p>
                       <p className="text-[10px] font-black text-spp-navy uppercase">{invoice.paymentMode}</p>
                    </div>
                 </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
               <button 
                  onClick={() => window.open(getFullUrl(invoice.fileUrl), '_blank')}
                  className="flex-grow flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-spp-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all shadow-lg active:scale-95 group"
               >
                  <FileText size={16} className="group-hover:rotate-6 transition-transform" /> View Protocol Document
               </button>
               <button 
                 onClick={onClose}
                 className="px-8 py-4 rounded-2xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all active:scale-95 italic border border-slate-100"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
