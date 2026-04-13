import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Search,
  User,
  LayoutDashboard, 
  FilePlus, 
  Users, 
  CheckCircle, 
  ChevronRight,
  LogOut,
  MapPin,
  Zap,
  CheckCheck,
  Clock,
  BellOff,
  Activity,
  FileText,
  ShieldCheck,
  Wallet,
  IndianRupee,
  Calendar,
  Building2,
  Phone,
  ExternalLink,
  RefreshCcw,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectTimeline from './ProjectTimeline';

const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    }).join(','))
  ];
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export function NavItem({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        active 
          ? 'bg-slate-50 text-spp-green' 
          : 'text-slate-500 hover:text-spp-navy hover:bg-slate-50/50'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-spp-green rounded-r-full" />}
      <span className={`transition-transform duration-300 ${active ? 'scale-105' : 'group-hover:scale-105 text-slate-400'}`}>{icon}</span>
      <span className={`text-[12px] font-bold tracking-tight uppercase whitespace-nowrap transition-colors ${active ? 'text-spp-navy' : 'group-hover:text-spp-navy'}`}>{label}</span>
    </button>
  );
}

export function OverviewCard({ title, value, icon, subtitle, color }) {
  const colors = {
    red: 'text-[#FF5252] bg-[#FFF5F5]',
    green: 'text-[#01A862] bg-[#EBFDF5]',
    blue: 'text-[#3E4AD8] bg-[#EEF0FF]'
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
        {subtitle && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${colors[color]}`}>
            {subtitle}
          </span>
        )}
      </div>
      <div>
        <p className="text-4xl font-bold text-spp-navy tracking-tight">{value}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-spp-navy transition-colors">{title}</p>
      </div>
    </div>
  );
}

export function OverviewTab({ user, projects, searchQuery = '', pendingVendors, invoices = [], allProjects = [], allVendors = [], stats }) {
  const isAdmin = user.role === 'Admin' || user.role === 'Manager';
  
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-spp-navy tracking-tight">Project Overview</h2>
          <p className="text-slate-400 text-sm font-medium">Real-time solar installation metrics and request tracking.</p>
        </div>
        <button className="bg-spp-navy text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-spp-navy/90 transition-all shadow-lg flex items-center gap-3">
          <FilePlus size={18} /> + New Solar Request
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <OverviewCard 
          title={isAdmin ? "Pending Vendors" : "Awaiting Clearance"} 
          value={isAdmin ? pendingVendors.length : invoices.filter(i => i.status === 'Uploaded').length} 
          icon={<Clock size={24}/>} 
          subtitle={isAdmin ? "Account Validation" : "Pending Invoices"}
          color="red"
        />
        <OverviewCard 
          title="Active Installations" 
          value={isAdmin ? allProjects.length : stats.activeSites} 
          icon={<Zap size={24}/>} 
          subtitle="Real-time Tracking"
          color="green"
        />
        <OverviewCard 
          title="Completed Portfolio" 
          value={isAdmin ? allProjects.filter(p => p.statusTimeline?.currentStage === 'Completed').length : (projects || []).filter(p => p.statusTimeline?.currentStage === 'Completed').length} 
          icon={<CheckCircle size={24}/>} 
          subtitle="Verified Output"
          color="blue"
        />
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-spp-navy">Recent Requests</h3>
          <button className="text-spp-green text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
           <div className="overflow-x-auto custom-scrollbar">
             <ProjectsList projects={projects || []} searchQuery={searchQuery} onDetail={() => {}} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-spp-navy p-10 rounded-[32px] text-white flex justify-between items-center relative overflow-hidden group shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-spp-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="space-y-6 relative z-10 w-2/3">
             <h4 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">Need Technical Support?</h4>
             <p className="text-slate-400 text-sm leading-relaxed">Our engineering team is available 24/7 for field assistance and technical solar queries.</p>
             <button className="bg-[#01A862] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#018a51] transition-all">Contact Expert</button>
           </div>
           <div className="hidden sm:flex w-32 h-32 bg-white/5 rounded-full items-center justify-center relative z-10 border border-white/10 group-hover:scale-110 transition-transform">
              <Users size={48} className="text-[#01A862]" />
           </div>
        </div>

        <div className="lg:col-span-2 bg-[#F1F5F9] p-10 rounded-[32px] flex items-center gap-8 shadow-sm">
           <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
              <Zap size={32} className="text-[#01A862] fill-[#01A862]" />
           </div>
           <div className="space-y-2">
              <h4 className="text-lg font-bold text-spp-navy tracking-tight leading-none">Energy Saved This Month</h4>
              <p className="text-3xl font-black text-spp-navy italic tracking-tighter leading-none mb-2">1.2 GWh</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Across all active installations in your region.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsList({ projects, searchQuery = '', onDetail }) {
  const getStatusStyle = (stage) => {
    switch (stage) {
      case 'Completed': return 'bg-[#EBFDF5] text-[#01140D] border-[#01A862]/20';
      case 'In-Progress': return 'bg-[#FFFBEB] text-[#141101] border-[#F59E0B]/20';
      case 'Pending': return 'bg-[#FFF1F2] text-[#140101] border-[#FF5252]/20';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.consumerInfo?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p._id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.propertyDetails?.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consumer Name</th>
            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</th>
            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Desired KW</th>
            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filteredProjects.map((p) => (
            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => onDetail(p)}>
              <td className="px-8 py-6">
                <div className="space-y-1">
                  <p className="font-bold text-spp-navy text-sm">{p.consumerInfo.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">ID: #{p._id.slice(-6)}</p>
                </div>
              </td>
              <td className="px-8 py-6">
                <p className="text-xs font-semibold text-slate-600">{p.propertyDetails.city}, {p.propertyDetails.state || 'MH'}</p>
              </td>
              <td className="px-8 py-6">
                <p className="text-xs font-bold text-spp-navy">{p.energyProfile.desiredCapacity} kW</p>
              </td>
              <td className="px-8 py-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border ${getStatusStyle(p.statusTimeline.currentStage)}`}>
                  {p.statusTimeline.currentStage}
                </span>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all text-slate-400 hover:text-spp-navy">
                      <ChevronRight size={18} />
                   </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProjects.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center gap-6 text-center">
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
              <LayoutDashboard size={32} />
           </div>
           <div className="space-y-1">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No requests detected</p>
              <p className="text-slate-300 text-[11px] max-w-xs leading-relaxed">Currently no active installation protocols detected in your immediate sector.</p>
           </div>
        </div>
      )}
    </div>
  );
}

export function AdminApprovals({ vendors, onApprove }) {
  const approveVendor = async (id) => {
    await api.put(`/admin/approve/${id}`);
    onApprove();
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-spp-navy">Field Verifications</h3>
        <p className="text-sm text-slate-400">Authorization protocols for pending hardware partners</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {vendors.map(v => (
          <div 
            key={v._id} 
            className="p-8 rounded-3xl bg-white border border-slate-100 flex flex-col lg:flex-row items-center justify-between hover:shadow-md transition-all group gap-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-spp-navy flex items-center justify-center font-bold text-white text-2xl shadow-lg group-hover:bg-spp-green group-hover:text-spp-navy transition-all duration-500">{v.name[0]}</div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-spp-navy">{v.vendorProfile?.companyName}</h4>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                   <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-widest">GSTIN: {v.vendorProfile?.gstNumber}</div>
                   <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.email}</div>
                </div>
              </div>
            </div>
            <button 
              className="w-full lg:w-auto bg-spp-navy text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all shadow-md active:scale-95" 
              onClick={() => approveVendor(v._id)}
            >
              Issue Industrial License
            </button>
          </div>
        ))}
        {vendors.length === 0 && (
          <div className="p-20 rounded-[48px] bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-spp-green/20"><CheckCircle size={48} /></div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Protocols Synchronized</p>
              <p className="text-slate-300 text-[11px] max-w-xs leading-relaxed">All pending partner verifications have been processed for this cycle.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminVendorDirectory({ vendors, searchQuery = '' }) {
  const filteredVendors = vendors.filter(v => 
    (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.vendorProfile?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.vendorProfile?.registrationLicenseId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = vendors.map(v => ({
      Company: v.vendorProfile?.companyName || v.name,
      License: v.vendorProfile?.registrationLicenseId || 'N/A',
      Status: v.vendorProfile?.onboardingStatus,
      GST: v.vendorProfile?.gstNumber,
      Email: v.email
    }));
    exportToCSV(exportData, 'Vendor_Directory_Export');
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-spp-navy">Partner Intelligence</h3>
          <p className="text-sm text-slate-400">Verified industrial partner force directory</p>
        </div>
        <button onClick={handleExport} className="px-8 py-3 bg-spp-navy text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-spp-navy/90 transition-all shadow-md">Export Global Directory</button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map(v => (
          <div 
            key={v._id} 
            className="p-8 rounded-3xl bg-white border border-slate-100 flex flex-col gap-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative"
          >
            <div className="flex justify-between items-start">
               <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-spp-navy text-xl shadow-inner group-hover:bg-spp-navy group-hover:text-white transition-all duration-500">{v.name[0]}</div>
               <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${v.vendorProfile?.onboardingStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                  {v.vendorProfile?.onboardingStatus}
               </div>
            </div>
            <div className="space-y-1">
               <h4 className="font-bold text-xl text-spp-navy truncate">{v.vendorProfile?.companyName || v.name}</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-60">License: {v.vendorProfile?.registrationLicenseId || 'UNAUTHORIZED'}</p>
            </div>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm">
                       {i}
                    </div>
                 ))}
               </div>
               <button className="text-[10px] font-bold uppercase tracking-widest text-spp-navy hover:text-spp-green transition-all hover:translate-x-1">Terminal Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProjectOverview({ projects, searchQuery = '', onDetail }) {
  const filteredProjects = projects.filter(p => 
    (p.consumerInfo?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.vendorId?.vendorProfile?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.propertyDetails?.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.statusTimeline?.currentStage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = projects.map(p => ({
      Consumer: p.consumerInfo.name,
      Vendor: p.vendorId?.vendorProfile?.companyName || 'N/A',
      City: p.propertyDetails.city,
      Capacity: p.energyProfile.desiredCapacity,
      Stage: p.statusTimeline.currentStage
    }));
    exportToCSV(exportData, 'Global_Projects_Export');
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h3 className="text-3xl font-black text-spp-navy tracking-tighter italic">Global <span className="text-spp-green">Installations</span></h3>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-l-2 border-spp-green/30 pl-4">Industrial protocol monitoring across active sites</p>
        </div>
        <button onClick={handleExport} className="px-8 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-spp-navy hover:text-white transition-all">Export Protocol Logs</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map(p => (
          <motion.div 
            key={p._id} 
            whileHover={{ x: 10 }}
            onClick={() => onDetail(p)}
            className="p-10 rounded-[56px] glass-card flex flex-col lg:flex-row items-center justify-between hover:shadow-2xl transition-all group cursor-pointer border border-white/60 gap-8"
          >
            <div className="flex gap-10 items-center">
               <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-4xl shadow-inner group-hover:bg-spp-navy transition-all duration-700">
                 {p.statusTimeline.currentStage === 'Completed' ? '✅' : '⚡'}
               </div>
               <div className="space-y-3">
                 <h4 className="font-black text-2xl text-spp-navy tracking-tighter italic leading-none">{p.consumerInfo.name}</h4>
                 <div className="flex flex-wrap items-center gap-6">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-spp-green"/> {p.propertyDetails.city}</p>
                   <span className="text-slate-100 text-xs font-light">|</span>
                   <p className="text-[10px] font-black text-spp-green uppercase tracking-widest border-b border-spp-green/20 pb-0.5">Operator: {p.vendorId?.vendorProfile?.companyName || 'Verified Partner'}</p>
                 </div>
               </div>
            </div>
            <div className="text-right space-y-3 lg:border-l lg:border-slate-100 lg:pl-12">
               <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] italic">Current Protocol</p>
               <div className="px-8 py-3 rounded-2xl bg-spp-navy text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-spp-navy/10 group-hover:bg-spp-green group-hover:text-spp-navy transition-all">
                  {p.statusTimeline.currentStage}
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailModal({ project, user, onClose, onUpdate }) {
  const [stage, setStage] = useState(project.statusTimeline.currentStage);
  const [note, setNote] = useState('');
  const [dynamicFields, setDynamicFields] = useState({
    engineerName: project.statusTimeline.surveyDetails?.engineerName || '',
    surveyDate: project.statusTimeline.surveyDetails?.date?.split('T')[0] || '',
    surveyTime: project.statusTimeline.surveyDetails?.time || '',
    quotationAmount: project.statusTimeline.financialMetrics?.quotationAmount || '',
    poNumber: project.statusTimeline.financialMetrics?.poNumber || ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedDesignFile, setSelectedDesignFile] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const STAGES_LIST = [
    'Form Submitted', 'Under Review', 'Approved', 'Site Survey Scheduled', 
    'Site Survey Completed', 'Design Prepared', 'Quotation Generated', 
    'Purchase Order Issued', 'Materials Procured', 'Installation In Progress', 
    'Installation Completed', 'Inspection & Commissioning', 'Completed'
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (stage === 'Design Prepared' && selectedDesignFile) {
        await api.post(`/projects/${project._id}/upload-design`, designData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      const payload = {
        currentStage: stage,
        note,
        surveyDetails: (stage === 'Site Survey Scheduled') ? {
          engineerName: dynamicFields.engineerName,
          date: dynamicFields.surveyDate,
          time: dynamicFields.surveyTime
        } : undefined,
        financialMetrics: (stage === 'Quotation Generated' || stage === 'Purchase Order Issued') ? {
          quotationAmount: dynamicFields.quotationAmount,
          poNumber: dynamicFields.poNumber
        } : undefined
      };

      await api.patch(`/projects/${project._id}/status`, payload);
      onUpdate();
      onClose();
    } catch (err) {
      alert("Status synchronisation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const isAdminOrManager = user.role === 'Admin' || user.role === 'Manager';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-spp-navy/80 backdrop-blur-2xl animate-in fade-in duration-700" onClick={onClose}></div>
      <div className="relative w-full max-w-[95vw] lg:max-w-7xl h-auto max-h-[95vh] bg-[#fdfdfd] rounded-[24px] md:rounded-[48px] shadow-[0_40px_120px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 border border-white/20">
        
        <div className="flex-grow overflow-y-auto p-6 md:p-14 space-y-10 bg-white">
          <div className="flex justify-between items-start">
             <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-spp-navy text-white text-[9px] font-black uppercase tracking-widest rounded-lg">#SPP-{project._id.slice(-6).toUpperCase()}</div>
                      <p className="text-[10px] font-black text-spp-green uppercase tracking-[0.4em] italic hidden sm:block">Technical Specification</p>
                   </div>
                   <button onClick={onClose} className="lg:hidden p-3 rounded-xl bg-slate-50 text-slate-300">
                      <LogOut size={18} />
                   </button>
                </div>
                
                <h3 className="text-2xl md:text-4xl font-extra-black text-spp-navy italic tracking-tighter leading-none">{project.consumerInfo.name}</h3>
                
                {/* Technical Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                   <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 group hover:bg-spp-navy hover:text-white transition-all duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-spp-green shadow-inner group-hover:bg-white/10">
                         <Zap size={20} />
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40 italic">System Rating</p>
                      <p className="text-lg font-black italic">{project.energyProfile.desiredCapacity} <span className="text-[8px] uppercase">kW Load</span></p>
                   </div>
                   <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 group hover:bg-spp-navy hover:text-white transition-all duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-spp-green shadow-inner group-hover:bg-white/10">
                         <MapPin size={20} />
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40 italic">Deployment Area</p>
                      <p className="text-lg font-black italic">{project.propertyDetails.availableSpace || '---'} <span className="text-[8px] uppercase">SQ FT</span></p>
                   </div>
                   <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 group hover:bg-spp-navy hover:text-white transition-all duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-spp-green shadow-inner group-hover:bg-white/10">
                         <Activity size={20} />
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40 italic">Roof Context</p>
                      <p className="text-lg font-black italic">{project.propertyDetails.roofType || 'Standard'}</p>
                   </div>
                   <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 group hover:bg-spp-navy hover:text-white transition-all duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-spp-green shadow-inner group-hover:bg-white/10">
                         <IndianRupee size={20} />
                      </div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/40 italic">Economic Base</p>
                      <p className="text-lg font-black italic">₹{project.energyProfile.monthlyBill || '---'} <span className="text-[8px] uppercase">/ MO</span></p>
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="hidden md:flex p-4 rounded-2xl bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm active:scale-90">
                <LogOut size={20} />
             </button>
          </div>

          <div className="pt-6 border-t border-slate-50">
             <ProjectTimeline project={project} isModalView={true} onRefresh={onUpdate} />
          </div>
        </div>

        <div className="w-full lg:w-[420px] bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col relative overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 md:p-12 space-y-12 pb-12 custom-scrollbar">
            
            {isAdminOrManager ? (
               <div className="space-y-10 relative z-10">
                  <div>
                     <h4 className="text-2xl font-black text-spp-navy tracking-tight italic leading-none">Protocol <span className="text-spp-green underline decoration-4 underline-offset-4">Override</span></h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Administrative Command Unit</p>
                  </div>

                  <form onSubmit={handleUpdate} className="space-y-6">
                     <div className="space-y-2.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-60">Advance to Stage</label>
                       <select 
                         className="w-full bg-white border border-slate-200 px-5 py-4 rounded-2xl text-[11px] font-black text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-sm"
                         value={stage}
                         onChange={(e) => setStage(e.target.value)}
                       >
                         {STAGES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                     </div>

                     {stage === 'Site Survey Scheduled' && (
                       <div className="space-y-4 p-6 rounded-[32px] bg-white border border-slate-200 animate-in zoom-in-95 duration-500 shadow-xl shadow-spp-navy/5">
                          <p className="text-[8px] font-black text-spp-green uppercase tracking-[0.2em] italic">Survey Parameters</p>
                          <div className="space-y-3">
                             <input 
                               type="text" 
                               placeholder="Engineer Name" 
                               className="w-full bg-slate-50 px-5 py-3 rounded-xl text-[10px] font-bold border border-slate-100 focus:bg-white transition-colors" 
                               value={dynamicFields.engineerName}
                               onChange={(e) => setDynamicFields({...dynamicFields, engineerName: e.target.value})}
                             />
                             <div className="grid grid-cols-2 gap-3">
                                <input 
                                  type="date" 
                                  className="bg-slate-50 px-5 py-3 rounded-xl text-[10px] font-bold border border-slate-100" 
                                  value={dynamicFields.surveyDate}
                                  onChange={(e) => setDynamicFields({...dynamicFields, surveyDate: e.target.value})}
                                />
                                <input 
                                  type="time" 
                                  className="bg-slate-50 px-5 py-3 rounded-xl text-[10px] font-bold border border-slate-100" 
                                  value={dynamicFields.surveyTime}
                                  onChange={(e) => setDynamicFields({...dynamicFields, surveyTime: e.target.value})}
                                />
                             </div>
                          </div>
                       </div>
                     )}

                     {stage === 'Quotation Generated' && (
                       <div className="space-y-4 p-6 rounded-[32px] bg-white border border-slate-200 animate-in zoom-in-95 duration-500 shadow-xl shadow-spp-navy/5">
                          <p className="text-[8px] font-black text-spp-green uppercase tracking-[0.2em] italic">Financial Parameters</p>
                          <div className="relative">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">₹</span>
                             <input 
                               type="number" 
                               placeholder="Quote Amount" 
                               className="w-full bg-slate-50 pl-10 pr-5 py-3 rounded-xl text-[10px] font-bold border border-slate-100 focus:bg-white transition-colors" 
                               value={dynamicFields.quotationAmount}
                               onChange={(e) => setDynamicFields({...dynamicFields, quotationAmount: e.target.value})}
                             />
                          </div>
                       </div>
                     )}

                     {stage === 'Purchase Order Issued' && (
                       <div className="space-y-4 p-6 rounded-[32px] bg-white border border-slate-200 animate-in zoom-in-95 duration-500 shadow-xl shadow-spp-navy/5">
                          <p className="text-[8px] font-black text-spp-green uppercase tracking-[0.2em] italic">Procurement Reference</p>
                          <input 
                            type="text" 
                            placeholder="PO Number Reference" 
                            className="w-full bg-slate-50 px-5 py-3 rounded-xl text-[10px] font-bold border border-slate-100 focus:bg-white transition-colors" 
                            value={dynamicFields.poNumber}
                            onChange={(e) => setDynamicFields({...dynamicFields, poNumber: e.target.value})}
                          />
                       </div>
                     )}

                     {stage === 'Design Prepared' && (
                        <div className="space-y-4 p-6 rounded-[32px] bg-white border border-slate-200 animate-in zoom-in-95 duration-500 shadow-xl shadow-spp-navy/5">
                           <p className="text-[8px] font-black text-spp-green uppercase tracking-[0.2em] italic">Engineering Blueprint</p>
                           <label className="block w-full cursor-pointer hover:bg-slate-50 transition-colors group">
                              <div className="w-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center group-hover:border-spp-green/40">
                                 <p className="text-[11px] font-black text-spp-navy uppercase tracking-widest">{selectedDesignFile ? selectedDesignFile.name : 'Select Technical PDF/CAD Blueprint'}</p>
                                 <p className="text-[9px] font-bold text-slate-400 mt-2 italic uppercase">System ready for industrial specification upload</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.dwg,.jpg,.jpeg,.png"
                                onChange={(e) => setSelectedDesignFile(e.target.files[0])}
                              />
                           </label>
                        </div>
                     )}

                     <div className="space-y-2.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic opacity-60">Protocol Note (Internal)</label>
                       <textarea 
                         rows="4"
                         placeholder="Enter industrial status update context..."
                         className="w-full bg-white border border-slate-200 px-6 py-4 rounded-2xl text-[11px] font-bold text-spp-navy focus:outline-none focus:ring-4 focus:ring-spp-navy/5 transition-all resize-none shadow-sm"
                         value={note}
                         onChange={(e) => setNote(e.target.value)}
                       ></textarea>
                     </div>

                     <button 
                       type="submit"
                       disabled={loading}
                       className="w-full bg-spp-navy text-white h-16 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-spp-green hover:text-spp-navy transition-all shadow-xl shadow-spp-navy/20 disabled:opacity-50 active:scale-95 group"
                     >
                       {loading ? (
                         <RefreshCcw size={18} className="animate-spin mx-auto" />
                       ) : (
                         <span className="flex items-center justify-center gap-3 italic">
                           Initialize Sync <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                         </span>
                       )}
                     </button>
                  </form>
               </div>
            ) : (
               <div className="space-y-8">
                  <div className="p-8 rounded-[48px] bg-white border border-slate-100 flex flex-col items-center text-center gap-8 shadow-sm group">
                     <div className="w-24 h-24 bg-spp-navy rounded-[32px] flex items-center justify-center text-5xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-spp-green/10 animate-pulse"></div>
                        <Zap size={40} className="relative z-10 text-spp-green fill-spp-green" />
                     </div>
                     <div className="space-y-3">
                        <h5 className="font-black text-2xl text-spp-navy uppercase tracking-tighter italic">Secured <span className="text-spp-green">Sync</span></h5>
                        <div className="px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">{project.statusTimeline.currentStage}</div>
                     </div>
                     <div className="w-full pt-8 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 italic leading-relaxed uppercase tracking-widest">Project identified as active node. All technical protocols are currently synchronized with central HQ.</p>
                     </div>
                  </div>
               </div>
            )}

            {/* Technical Unit Section (Unified) */}
            <div className="space-y-8 pt-10 border-t border-slate-100/50">
               <div className="flex justify-between items-center">
                  <h5 className="text-xl font-black text-spp-navy tracking-tight italic">Technical <span className="text-spp-green">Unit</span></h5>
                  <button className="text-slate-300 hover:text-spp-navy transition-all"><ExternalLink size={18} /></button>
               </div>
               
               <div className="space-y-5">
                  {[
                     { name: project.statusTimeline?.surveyDetails?.engineerName || 'Unit Commander', role: 'Protocol Lead' },
                     { name: 'Sandeep Singh', role: 'Integration Expert' }
                  ].map((member, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-100/50 shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-spp-navy">
                              <User size={20} />
                           </div>
                           <div>
                              <p className="text-[11px] font-black text-spp-navy leading-none mb-1.5 uppercase">{member.name}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{member.role}</p>
                           </div>
                        </div>
                        <button className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 hover:bg-spp-navy hover:text-white transition-all">
                           <Phone size={12} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Site Parameters (Unified) */}
            <div className="space-y-6 pt-10 border-t border-slate-100/50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-spp-navy flex items-center justify-center text-white shadow-lg">
                     <MapPin size={18} />
                  </div>
                  <h5 className="text-lg font-black text-spp-navy tracking-tight italic">Installation <span className="text-spp-green">Site</span></h5>
               </div>
               
               <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Site Coordinates</p>
                     <p className="text-[11px] font-bold text-spp-navy leading-relaxed italic">{project.propertyDetails.address}, {project.propertyDetails.city}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">Deployment Matrix</p>
                        <p className="text-lg font-black text-spp-green tracking-tighter italic">{project.propertyDetails.availableSpace || '---'} <span className="text-[8px] uppercase">SQ FT</span></p>
                     </div>
                     <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                        <Activity size={18} />
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Protocol Security Bar (Now in flow) */}
            <div className="pt-10">
               <div className="px-6 py-4 bg-spp-navy text-white/50 rounded-3xl text-[8px] font-black uppercase text-center border border-white/10 flex items-center justify-center gap-3 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-spp-green/5 animate-pulse"></div>
                  <ShieldCheck size={14} className="text-spp-green relative z-10" /> 
                  <span className="relative z-10">Protocol Synchronized under Swastik Security Alpha</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommunicationCenter() {
  const [recipient, setRecipient] = useState('All');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notifications/broadcast', {
        title,
        message,
        recipientType: recipient
      });
      alert("Broadcast successful!");
      setTitle('');
      setMessage('');
    } catch (err) {
      alert("Broadcast failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="space-y-3">
        <h3 className="text-4xl font-extra-black text-spp-navy tracking-tight italic">Industrial <span className="text-spp-green underline">Broadcast</span></h3>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Transmit global directives to verified partner networks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="p-12 md:p-16 rounded-[56px] bg-white border border-slate-100 shadow-2xl shadow-spp-navy/5 space-y-12">
          <form onSubmit={handleBroadcast} className="space-y-10">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Sector</label>
               <div className="flex gap-4">
                  {['All', 'Active'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecipient(r)}
                      className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${recipient === r ? 'bg-spp-navy text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      {r === 'All' ? 'All Vendors' : 'Verified Only'}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transmission Header</label>
               <input 
                 type="text" 
                 placeholder="Enter directive title..." 
                 className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[24px] text-sm font-black text-spp-navy focus:outline-none focus:ring-2 focus:ring-spp-navy/10 transition-all italic"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 required
               />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Payload (Message)</label>
               <textarea 
                 rows="6"
                 placeholder="Describe the operational directive..." 
                 className="w-full bg-slate-50 border border-slate-100 px-8 py-5 rounded-[24px] text-sm font-bold text-spp-navy focus:outline-none focus:ring-2 focus:ring-spp-navy/10 transition-all resize-none italic leading-relaxed"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 required
               ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-spp-navy text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:bg-spp-green hover:text-spp-navy transition-all shadow-2xl shadow-spp-navy/20 active:scale-95 italic"
            >
              {loading ? 'Transmitting...' : 'Initiate Global Broadcast'}
            </button>
          </form>
        </div>

        <div className="space-y-8">
           <div className="p-12 rounded-[56px] bg-spp-navy text-white shadow-3xl shadow-spp-navy/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-spp-green/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-spp-green/20 transition-all duration-1000"></div>
              <div className="relative z-10 space-y-10">
                 <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center"><Zap size={32} className="text-spp-green" /></div>
                 <div className="space-y-4">
                    <h4 className="text-3xl font-extra-black italic leading-none">Broadcast <br />Command</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic border-l-2 border-spp-green/40 pl-6 leading-relaxed">Ensure all directives align with Swastik Industrial Protocol v3.4. Transmission is permanent across all verified terminals.</p>
                 </div>
              </div>
           </div>

           <div className="p-12 rounded-[56px] border-2 border-dashed border-slate-200 bg-white/50 space-y-6">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic mb-4">Transmission Guidelines</p>
              <ul className="space-y-4">
                 {[
                   "Maintain professional industrial tone.",
                   "Specify clear action protocols for partners.",
                   "Double-verify critical metrics before broadcast.",
                   "Directive logs are archived for 24 months."
                 ].map((t, i) => (
                   <li key={i} className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                     <div className="w-1.5 h-1.5 bg-spp-green rounded-full shadow-[0_0_8px_rgba(1,168,98,0.5)]"></div>
                     {t}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationsTab({ notifications, onMarkRead, onMarkAllRead, onDetail }) {
  const [filter, setFilter] = useState('All');
  
  const filteredNotifications = (notifications || []).filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return !n.isRead;
    return n.type === filter.toLowerCase();
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
          <h3 className="text-4xl font-extra-black text-spp-navy tracking-tight italic">Protocol <span className="text-spp-green underline">Intelligence</span></h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Comprehensive synchronization history & diagnostic alerts</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={onMarkAllRead}
             className="px-8 py-4 bg-spp-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all shadow-xl shadow-spp-navy/20 flex items-center gap-3"
           >
             <CheckCheck size={16} /> Synchronize All
           </button>
        </div>
      </div>

      <div className="flex gap-4 p-2 bg-slate-100/50 rounded-[28px] w-fit border border-slate-100 shadow-inner">
        {['All', 'Unread', 'Project', 'Invoice', 'General'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-spp-navy shadow-lg border border-slate-100' : 'text-slate-400 hover:text-spp-navy'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((n, i) => (
            <NotificationItem key={n._id} notification={n} onMarkRead={onMarkRead} onDetail={onDetail} index={i} />
          ))}
        </AnimatePresence>
        
        {filteredNotifications.length === 0 && (
          <div className="p-32 rounded-[64px] bg-white border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-8 text-center bg-[radial-gradient(circle_at_center,rgba(1,168,98,0.02)_0%,transparent_100%)]">
            <div className="w-32 h-32 bg-slate-50 rounded-[48px] flex items-center justify-center shadow-xl border border-slate-50"><BellOff size={64} className="text-slate-100" /></div>
            <div className="space-y-2">
              <p className="text-slate-400 font-black text-[12px] uppercase tracking-[0.4em] italic">Intelligence Buffer Clear</p>
              <p className="text-slate-300 font-medium text-xs max-w-xs leading-relaxed italic uppercase tracking-widest">No active protocols match your current filter criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function NotificationsPanel({ notifications, onMarkRead, onMarkAllRead, onDetail, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute top-16 right-0 w-[95vw] sm:w-[480px] bg-white rounded-[24px] sm:rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[200] backdrop-blur-3xl"
    >
      <div className="p-10 bg-spp-navy flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-spp-green opacity-5 blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="relative z-10">
          <h4 className="text-2xl font-black text-white italic tracking-tighter italic">Intel <span className="text-spp-green">Channel</span></h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2 italic leading-none opacity-60">Real-time protocol updates</p>
        </div>
        <div className="flex gap-4 relative z-10">
           <button 
             onClick={onMarkAllRead}
             className="w-12 h-12 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-spp-green hover:text-spp-navy transition-all active:scale-90"
             title="Synchronize All"
           >
             <CheckCheck size={20} />
           </button>
           <button 
             onClick={onClose}
             className="w-12 h-12 rounded-[20px] bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
           >
             <ChevronRight size={22} className="rotate-90 md:rotate-0" />
           </button>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto p-6 space-y-4 bg-slate-50/30 custom-scrollbar">
        <AnimatePresence>
          {(notifications || []).map((n, i) => (
            <NotificationItem key={n._id} notification={n} onMarkRead={onMarkRead} onDetail={onDetail} index={i} />
          ))}
        </AnimatePresence>
        {(notifications || []).length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center gap-8 text-center bg-white rounded-[40px] border border-dashed border-slate-100 mx-2">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center shadow-inner">
              <BellOff size={40} className="text-slate-100" />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-none">Intelligence Buffer Empty</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">All diagnostic protocols are current</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-50">
        <button className="w-full py-5 rounded-[24px] bg-slate-50 hover:bg-spp-navy hover:text-white text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] transition-all active:scale-95">
          Access Cloud Archives
        </button>
      </div>
    </motion.div>
  );
}

export function NotificationItem({ notification, onMarkRead, onDetail, index }) {
  const getTypeIcon = () => {
    switch(notification.type) {
      case 'project': return <Zap size={20} />;
      case 'invoice': return <Wallet size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  const getRelativeTime = (date) => {
    const diff = new Date() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return 'Synchronizing...';
    if (mins < 60) return `${mins}m epoch`;
    if (hours < 24) return `${hours}h epoch`;
    return `${days}d epoch`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onDetail?.(notification)}
      className={`group p-8 rounded-[32px] border transition-all duration-500 flex gap-6 relative overflow-hidden cursor-pointer ${
        notification.isRead ? 'bg-transparent border-transparent grayscale brightness-90 hover:grayscale-0 hover:brightness-100 hover:bg-white hover:border-slate-50' : 'bg-white border-slate-100 shadow-xl shadow-spp-navy/5 border-l-4 border-l-spp-green'
      }`}
    >
      <div className={`w-14 h-14 rounded-[20px] flex-shrink-0 flex items-center justify-center transition-all duration-500 ${
        notification.isRead ? 'bg-slate-50 text-slate-300 group-hover:bg-spp-navy group-hover:text-white' : 'bg-spp-navy text-spp-green shadow-lg shadow-spp-navy/10'
      }`}>
        {getTypeIcon()}
      </div>
      <div className="flex-grow space-y-2">
        <div className="flex justify-between items-start">
           <h5 className={`text-sm font-black tracking-tight italic ${notification.isRead ? 'text-slate-400' : 'text-spp-navy'}`}>{notification.title}</h5>
           {!notification.isRead && (
             <button 
                onClick={(e) => { e.stopPropagation(); onMarkRead(notification._id); }}
                className="p-2 bg-slate-50 rounded-xl hover:bg-spp-navy hover:text-white transition-all active:scale-90"
             >
               <CheckCircle size={16} />
             </button>
           )}
        </div>
        <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">{notification.message}</p>
        <div className="flex items-center gap-3 pt-2">
           <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:bg-spp-navy group-hover:text-slate-500 transition-all">
              <Clock size={12} className="text-spp-green" /> {getRelativeTime(notification.createdAt)}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationDetailModal({ notification, onClose, onMarkRead }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const getTypeStyle = () => {
    switch(notification.type) {
      case 'project': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'invoice': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-spp-navy/80 backdrop-blur-2xl" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative w-full max-w-xl bg-white rounded-[56px] shadow-[0_40px_120px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
      >
        <div className="h-32 bg-spp-navy relative overflow-hidden flex items-center px-12">
           <div className="absolute top-0 right-0 w-64 h-64 bg-spp-green/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 space-y-1">
              <p className="text-[10px] font-black text-spp-green uppercase tracking-[0.4em] italic mb-1">Incoming Signal</p>
              <h4 className="text-2xl font-extra-black text-white italic tracking-tighter uppercase">Protocol <span className="text-spp-green">Alert</span></h4>
           </div>
           <button 
             onClick={onClose}
             className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90"
           >
             <LogOut size={20} />
           </button>
        </div>

        <div className="p-16 space-y-10">
           <div className="space-y-6">
              <div className={`px-5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest inline-block ${getTypeStyle()}`}>
                 {notification.type || 'General'} Directive
              </div>
              <h3 className="text-4xl font-extra-black text-spp-navy italic tracking-tighter leading-none uppercase">{notification.title}</h3>
              <p className="text-lg font-bold text-slate-500 leading-relaxed italic border-l-4 border-slate-100 pl-8">{notification.message}</p>
           </div>

           <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock size={20} />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Signal Epoch</p>
                    <p className="text-xs font-black text-spp-navy italic">{new Date(notification.createdAt).toLocaleString()}</p>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 {!notification.isRead && (
                   <button 
                     onClick={() => { onMarkRead(notification._id); onClose(); }}
                     className="px-8 py-4 bg-spp-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all shadow-xl shadow-spp-navy/20 active:scale-95 italic"
                   >
                     Synchronize Signal
                   </button>
                 )}
                 <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 italic"
                 >
                    Dismiss Console
                 </button>
              </div>
           </div>
        </div>

        <div className="h-4 bg-spp-green/30 w-full animate-pulse"></div>
      </motion.div>
    </div>
  );
}

export function VendorRegistrationModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-spp-navy/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden p-12 space-y-8 animate-in zoom-in-95 duration-500">
         <div className="space-y-4 text-center">
            <h3 className="text-3xl font-black text-spp-navy italic">Partner <span className="text-spp-green">Onboarding</span></h3>
            <p className="text-sm text-slate-400">Join the industrial power grid network as a verified installation partner.</p>
         </div>
         <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
            <p className="text-xs font-bold text-slate-500 leading-relaxed text-center italic">Please complete the formal registration protocol on our primary gateway to initialize your industrial partnership status.</p>
            <button 
              onClick={() => window.location.href = '/register'}
              className="w-full bg-spp-navy text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all shadow-xl"
            >
              Initiate Gateway Protocol
            </button>
         </div>
         <button onClick={onClose} className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-colors italic">Abort Session</button>
      </div>
    </div>
  );
}

export function InquiryDetailModal({ inquiry, onClose, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!inquiry) return null;

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.patch(`/inquiries/${inquiry._id}`, { status });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Clean Professional Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-spp-navy flex items-center justify-center text-white">
                 <FileText size={16} />
              </div>
              <h3 className="text-sm font-bold text-spp-navy uppercase tracking-widest">Inquiry Details</h3>
           </div>
           <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
             inquiry.status === 'New' ? 'bg-spp-green/10 text-spp-green border border-spp-green/20' :
             inquiry.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
             'bg-slate-50 text-slate-500 border border-slate-200'
           }`}>
             {inquiry.status}
           </span>
        </div>

        {/* Content Matrix */}
        <div className="p-8 space-y-8">
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Consumer Name</p>
                 <p className="text-sm font-semibold text-spp-navy">{inquiry.name}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sector</p>
                 <p className="text-sm font-semibold text-spp-navy">{inquiry.type}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                 <p className="text-sm font-semibold text-spp-navy">{inquiry.mobile || '---'}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</p>
                 <p className="text-sm font-semibold text-spp-navy truncate">{inquiry.email}</p>
              </div>
           </div>

           <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Transmission Message</p>
              <div className="p-5 bg-slate-50 rounded-2xl text-xs text-slate-600 leading-relaxed border border-slate-100 italic">
                 "{inquiry.message || 'No message provided.'}"
              </div>
           </div>

           {/* Action Section */}
           <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
              {inquiry.status === 'New' && (
                <button 
                  onClick={() => handleUpdateStatus('Contacted')} 
                  disabled={updating}
                  className="w-full bg-spp-navy text-white h-12 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-spp-green hover:text-spp-navy transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {updating ? <RefreshCcw size={14} className="animate-spin" /> : <>Mark Contacted <ChevronRight size={14} /></>}
                </button>
              )}
              {inquiry.status === 'Contacted' && (
                <button 
                  onClick={() => handleUpdateStatus('Resolved')} 
                  disabled={updating}
                  className="w-full bg-spp-green text-spp-navy h-12 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {updating ? <RefreshCcw size={14} className="animate-spin" /> : <>Resolve Protocol <CheckCheck size={14} /></>}
                </button>
              )}
              <button 
                onClick={onClose} 
                className="w-full h-12 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all"
              >
                Close Protocol
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

export function InquiriesTab({ inquiries, onUpdate }) {
  const [updating, setUpdating] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/inquiries/${id}`, { status });
      onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const openInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-spp-navy tracking-tight">Market Inquiries</h2>
          <p className="text-slate-400 text-sm font-medium">Capture and manage leads from the public operational terminal.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operator / Entity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocol Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <Search size={48} />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No Leads Synchronized</p>
                  </div>
                </td>
              </tr>
            ) : (
              inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-[11px] font-bold text-slate-400">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                    <p className="text-[10px] font-medium text-slate-300">{new Date(inquiry.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-spp-navy uppercase tracking-tight">{inquiry.name}</p>
                    <p className="text-[11px] font-bold text-spp-green lowercase tracking-wide">{inquiry.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {inquiry.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      inquiry.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      inquiry.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openInquiry(inquiry)}
                        className="h-8 px-3 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-slate-50 hover:text-spp-navy transition-all flex items-center gap-2"
                      >
                        <Eye size={12} /> View
                      </button>
                      {inquiry.status === 'New' && (
                        <button 
                          onClick={() => handleUpdateStatus(inquiry._id, 'Contacted')}
                          disabled={updating === inquiry._id}
                          className="h-8 px-3 bg-spp-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-spp-green hover:text-spp-navy transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          <Phone size={10} /> Contact
                        </button>
                      )}
                      {inquiry.status === 'Contacted' && (
                        <button 
                          onClick={() => handleUpdateStatus(inquiry._id, 'Resolved')}
                          disabled={updating === inquiry._id}
                          className="h-8 px-3 bg-spp-green/10 text-spp-green border border-spp-green/20 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-spp-green hover:text-spp-navy transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCheck size={12} /> Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

      {/* Redundant grid removed for a cleaner, professional table-only interface */}

      {showModal && (
        <InquiryDetailModal 
          inquiry={selectedInquiry} 
          onClose={() => setShowModal(false)} 
          onUpdate={onUpdate} 
        />
      )}
    </div>
  );
}

