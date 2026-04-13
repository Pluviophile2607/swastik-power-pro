import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../services/api';
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  Share2, 
  Maximize2, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Wallet,
  Zap,
  Activity,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getFullUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}/${url.replace(/\\/g, "/")}`;
};

function ProtocolViewer() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoice/my-invoices`);
        // Simplification: In a production app, we'd have a specific GET /api/invoice/:id endpoint.
        // For now, finding in the list.
        const found = res.data.invoices.find(inv => inv._id === invoiceId);
        if (found) {
          setInvoice(found);
        } else {
          // Try fetching from pending list if not found in 'my-invoices' (for Admin/Finance)
          const adminRes = await api.get(`/invoice/pending-invoices?status=Uploaded,Approved,Paid,Rejected`);
          const adminFound = adminRes.data.invoices.find(inv => inv._id === invoiceId);
          if (adminFound) {
            setInvoice(adminFound);
          } else {
            setError("Protocol record not found in central ledger.");
          }
        }
      } catch (err) {
        setError("Failed to synchronize with industrial database.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return (
    <div className="min-h-screen bg-[#0A0C10] flex flex-col items-center justify-center gap-8">
      <div className="relative">
         <div className="w-24 h-24 border-4 border-spp-green/10 border-t-spp-green rounded-full animate-spin"></div>
         <Activity size={40} className="absolute inset-0 m-auto text-spp-green animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.6em] text-spp-green animate-pulse">Decrypting Protocol Evidence</p>
    </div>
  );

  if (error || !invoice) return (
    <div className="min-h-screen bg-[#0A0C10] flex flex-col items-center justify-center gap-8 p-12 text-center">
      <div className="w-20 h-20 bg-red-500/10 rounded-[32px] flex items-center justify-center border border-red-500/20 text-red-500">
         <ShieldCheck size={40} />
      </div>
      <div className="space-y-4">
         <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Security Breach</h2>
         <p className="text-slate-500 text-xs font-bold tracking-widest uppercase max-w-md mx-auto leading-relaxed">{error || "Access Denied: Protocol record signature mismatch."}</p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
      >
        Return to Command
      </button>
    </div>
  );

  const fileUrl = getFullUrl(invoice.fileUrl);
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(fileUrl || '');

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E0E0E0] font-sans selection:bg-spp-green/30">
      {/* Top Protocol Bar */}
      <header className="h-20 bg-black/40 border-b border-white/5 backdrop-blur-xl fixed top-0 w-full z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-8">
           <button 
             onClick={() => navigate(-1)}
             className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all group active:scale-90"
           >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
           </button>
           <div className="h-8 w-px bg-white/10"></div>
           <div className="flex flex-col">
              <div className="flex items-center gap-3">
                 <h1 className="text-lg font-black text-white italic tracking-tight uppercase leading-none truncate max-w-[300px]">INV-{(invoice.invoiceNumber || 'UNKNOWN').slice(-12)}</h1>
                 <span className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${invoice.status === 'Paid' ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' : 'border-amber-500/30 bg-amber-500/5 text-amber-500'}`}>
                    {invoice.status}
                 </span>
              </div>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Verification Stream: {invoice.projectId?.consumerInfo?.name || 'Protocol Hub'}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-white/5 rounded-2xl border border-white/10 mr-4">
              <div className="flex flex-col items-end">
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Authorization Value</span>
                 <span className="text-sm font-black text-spp-green italic leading-none truncate">₹{(invoice.amount || 0).toLocaleString()}</span>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex flex-col items-end">
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Uplinked Date</span>
                 <span className="text-sm font-black text-white italic leading-none truncate">{new Date(invoice.createdAt).toLocaleDateString()}</span>
              </div>
           </div>

           <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-lg active:scale-95"
                title="Zoom In"
              >
                +
              </button>
              <button 
                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-lg active:scale-95"
                title="Zoom Out"
              >
                -
              </button>
           </div>

           <div className="h-8 w-px bg-white/10 mx-2"></div>

           <button 
             onClick={() => window.open(fileUrl, '_blank')}
             className="px-6 py-3 bg-spp-green text-spp-navy rounded-[14px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-spp-green/20"
           >
              <Download size={14} /> Official Protocol
           </button>
        </div>
      </header>

      {/* Main View Port */}
      <main className="pt-24 pb-12 px-10 h-screen flex gap-10">
        {/* Document Area */}
        <section className="flex-grow bg-[#12141C] border border-white/5 rounded-[40px] overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 overflow-auto flex items-start justify-center p-12 scrollbar-none">
              <motion.div 
                style={{ scale: zoom }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="bg-white rounded-xl shadow-2xl relative"
              >
                {isImage ? (
                  <img 
                    src={fileUrl} 
                    alt="Protocol Document" 
                    className="max-w-none w-auto h-auto min-w-[600px] pointer-events-none select-none rounded-xl" 
                  />
                ) : (
                  <iframe 
                    src={`${fileUrl}#toolbar=0`} 
                    className="w-[850px] h-[1100px] border-none rounded-xl"
                    title="PDF Protocol"
                  />
                )}
                
                {/* Security Overlay */}
                <div className="absolute inset-0 flex flex-col pointer-events-none items-center justify-center gap-4 opacity-[0.03] select-none scale-150 rotate-[-45deg]">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="text-spp-navy font-black text-6xl uppercase tracking-[0.5em] whitespace-nowrap">
                        SWASTIK POWER PRO SECURITY PROTOCOL — {invoice.invoiceNumber || 'LEAK PROTECTION'}
                     </div>
                   ))}
                </div>
              </motion.div>
           </div>

           {/* Floating Info Overlay */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-5 bg-black/60 border border-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl z-20">
              <div className="flex items-center gap-6 pr-6 border-r border-white/10">
                 <div className="w-10 h-10 rounded-xl bg-spp-green/20 flex items-center justify-center text-spp-green animate-pulse">
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Encrypted evidence ID</p>
                    <p className="text-xs font-black text-white italic tracking-tight">{invoice._id.toUpperCase()}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                 <button className="hover:text-white transition-colors"><Maximize2 size={18}/></button>
                 <button className="hover:text-white transition-colors"><Printer size={18}/></button>
                 <button className="hover:text-white transition-colors"><Share2 size={18}/></button>
              </div>
           </div>
        </section>

        {/* Sidebar Intelligence */}
        <aside className="w-96 flex flex-col gap-6">
           {/* Project Card */}
           <div className="p-8 rounded-[40px] bg-white border border-slate-100 space-y-6 shadow-sm">
              <div className="flex justify-between items-start">
                 <div className="w-14 h-14 rounded-[22px] bg-spp-navy flex items-center justify-center shadow-lg">
                    <Zap size={24} className="text-spp-green fill-spp-green" />
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-1 font-sans">License Verified</span>
                    <span className="text-[10px] font-black text-spp-green uppercase tracking-widest">{invoice.projectId?.vendorId?.vendorProfile?.registrationLicenseId || 'SPP-LEAD-2026'}</span>
                 </div>
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-spp-navy italic tracking-tighter leading-tight truncate">{invoice.projectId?.consumerInfo?.name || 'Protocol Offline'}</h3>
                 <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <MapPin size={12} className="text-spp-navy/40"/> {invoice.projectId?.propertyDetails?.city || 'MH'}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <Wallet size={12} className="text-spp-navy/40"/> ₹{(invoice.amount || 0).toLocaleString()}
                    </div>
                 </div>
              </div>
              <div className="h-px bg-slate-50 w-full"></div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Vendor Entity</p>
                    <p className="text-[10px] font-black text-spp-navy truncate">{invoice.projectId?.vendorId?.vendorProfile?.companyName || 'Industrial Partner'}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Status Protocol</p>
                    <p className="text-[10px] font-black text-spp-green uppercase">{invoice.status}</p>
                 </div>
              </div>
           </div>

           {/* Metadata Timeline */}
           <div className="flex-grow p-8 rounded-[40px] bg-[#12141C] border border-white/5 space-y-8 shadow-inner overflow-y-auto">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-6">Synchronization Trail</h4>
              <div className="space-y-8 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/5"></div>
                 <TimelineItem 
                   icon={<FileText size={10} />} 
                   title="Protocol Submission" 
                   time="Inbound: Secure"
                   active 
                 />
                 <TimelineItem 
                   icon={<Clock size={10} />} 
                   title="Data Mining" 
                   time="Extraction: Pending" 
                 />
                 <TimelineItem 
                   icon={<Activity size={10} />} 
                   title="Verification Check" 
                   time="Awaiting Clearance" 
                 />
                 <TimelineItem 
                   icon={<ShieldCheck size={10} />} 
                   title="Industrial Approval" 
                   time="Awaiting Signature" 
                 />
              </div>
              
              <div className="pt-10 border-t border-white/5 mt-auto">
                 <button 
                   onClick={() => window.open(fileUrl, '_blank')}
                   className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all group"
                 >
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Open External Node</span>
                    <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                 </button>
              </div>
           </div>
        </aside>
      </main>
    </div>
  );
}

function TimelineItem({ icon, title, time, active }) {
  return (
    <div className="flex gap-6 relative z-10">
       <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'bg-spp-green border-spp-green text-spp-navy shadow-lg shadow-spp-green/50' : 'bg-[#12141C] border-white/10 text-slate-700'}`}>
          {icon}
       </div>
       <div className="space-y-1">
          <h5 className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-600'}`}>{title}</h5>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{time}</p>
       </div>
    </div>
  );
}

export default ProtocolViewer;
