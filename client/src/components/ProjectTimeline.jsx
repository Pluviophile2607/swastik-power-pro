import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  User, 
  Clock, 
  Search, 
  FileCheck, 
  PencilRuler, 
  Zap, 
  CheckCheck, 
  FileText,
  Share2,
  Phone,
  BarChart3,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Building2,
  Activity,
  IndianRupee,
  Truck,
  ExternalLink,
  RefreshCcw,
  Eye,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  { name: 'Form Submitted', desc: 'Initial project application and documentation submitted for review by the technical team.' },
  { name: 'Under Review', desc: 'Engineering verification of site aesthetics and load metrics.' },
  { name: 'Approved', desc: 'Administrative clearance for installation execution.' },
  { name: 'Site Survey Scheduled', desc: 'Technical inspection of the installation site scheduled.' },
  { name: 'Site Survey Completed', desc: 'Roof structural integrity and solar orientation verified.' },
  { name: 'Design Prepared', desc: '3D layout and structural blueprints generated for the site.' },
  { name: 'Quotation Generated', desc: 'Financial modeling and commercial proposal issuance.' },
  { name: 'Purchase Order Issued', desc: 'Official procurement authorization and contract synchronization.' },
  { name: 'Materials Procured', desc: 'Logistics synchronization of PV modules and inverters.' },
  { name: 'Installation In Progress', desc: 'Mechanical mounting and electrical integration active on-site.' },
  { name: 'Installation Completed', desc: 'Hardware implementation finalized. Syncing with local grid protocols.' },
  { name: 'Inspection & Commissioning', desc: 'Final safety clearance and government grid connectivity.' },
  { name: 'Completed', desc: 'Project synchronized. Clean energy generation is now fully active.' }
];

const ProjectTimeline = ({ project, onBack, onRefresh, isModalView = false }) => {
  if (!project) return null;

  const currentStageName = project?.statusTimeline?.currentStage || 'Form Submitted';
  const currentStageIndex = STAGES.findIndex(s => s.name === currentStageName);
  
  // Real-time progress calculation based on stage index
  const progressPercent = Math.round(((currentStageIndex + 1) / STAGES.length) * 100);

  const getStageData = (stageName) => {
    return project.statusTimeline?.stages?.find(s => s.name === stageName) || {};
  };

  const formatDate = (date) => {
    if (!date) return '---';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Consumer Profile Header - Hidden in Modal */}
      {!isModalView && (
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-spp-green/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-spp-green/10"></div>
          
          <div className="flex items-center gap-6 md:gap-10 relative z-10 w-full md:w-auto">
            <button 
              onClick={onBack}
              className="absolute -left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 border border-slate-100 hidden md:flex items-center justify-center text-slate-400 hover:bg-spp-navy hover:text-white transition-all shadow-sm active:scale-90"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
          
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] md:rounded-[32px] bg-slate-50 border-4 border-white shadow-xl overflow-hidden shrink-0 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-500">
               <div className="w-full h-full rounded-[20px] md:rounded-[24px] bg-spp-navy flex items-center justify-center text-white text-2xl md:text-3xl font-black italic shadow-inner">
                  {project.consumerInfo?.name?.[0] || 'S'}
               </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-black text-spp-navy tracking-tighter leading-none italic">
                {project.consumerInfo?.name || 'Consumer Name'}
              </h3>
              <div className="flex items-center gap-3">
                 <MapPin size={16} className="text-spp-green" />
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                   {project.propertyDetails?.city || 'Unknown Location'}, {project.propertyDetails?.state || 'MH'}
                 </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-14 w-full md:w-auto bg-slate-50/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl md:rounded-none">
            <div className="space-y-1 min-w-[120px]">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Status integrity</p>
               <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-black uppercase border border-green-100 w-fit mt-1">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> 
                 Synchronized
               </div>
            </div>
            <div className="space-y-1 min-w-[120px]">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Project ID</p>
               <p className="text-lg font-black text-spp-navy tracking-tight italic">
                 #SPP-{new Date(project.createdAt).getFullYear()}-{project._id ? project._id.slice(-4).toUpperCase() : '0000'}
               </p>
            </div>
            <div className="space-y-1 min-w-[120px]">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Total Value</p>
               <p className="text-xl font-black text-spp-green tracking-tight italic flex items-center gap-1">
                 <IndianRupee size={16} />
                 {project.statusTimeline?.financialMetrics?.quotationAmount?.toLocaleString() || '---'}
               </p>
            </div>
            <div className="space-y-1 min-w-[120px]">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Power Unit</p>
               <p className="text-lg font-black text-spp-navy tracking-tight italic">
                 {project.energyProfile?.desiredCapacity || '---'} kWp
               </p>
            </div>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${!isModalView ? 'xl:grid-cols-3' : ''} gap-8 md:gap-10`}>
        {/* Project Timeline Tracker */}
        <div className={`${!isModalView ? 'xl:col-span-2' : ''} bg-white p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-10 h-fit relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-spp-green/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-50 pb-8 relative z-10 gap-6">
            <h4 className="text-xl md:text-2xl font-black text-spp-navy tracking-tighter italic leading-none">Project <span className="text-spp-green underline decoration-4 underline-offset-8">Lifecycle</span> Protocol</h4>
            <div className="w-full sm:w-auto text-left sm:text-right flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
               <p className="text-[10px] font-black text-spp-navy uppercase tracking-widest leading-none">Protocol Sync: {progressPercent}%</p>
               <button 
                 onClick={onRefresh}
                 className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-spp-navy hover:text-white transition-all active:rotate-180 duration-500 shadow-sm"
               >
                 <RefreshCcw size={16} />
               </button>
            </div>
          </div>

          <div className="relative space-y-0 pl-4 relative z-10">
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isActive = index === currentStageIndex;
              const isPending = index > currentStageIndex;
              const stageData = getStageData(stage.name);

              return (
                <div key={index} className="relative pb-10 last:pb-0 flex gap-6 md:gap-10 group/step">
                  {/* Vertical Line */}
                  {index < STAGES.length - 1 && (
                    <div className={`absolute left-5 top-10 w-1 h-[calc(100%-8px)] rounded-full transition-all duration-1000 ${isCompleted ? 'bg-spp-green shadow-[0_0_15px_rgba(1,168,98,0.1)]' : 'bg-slate-100'}`}>
                       {isCompleted && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 1.5, delay: index * 0.1 }}
                            className="bg-spp-green w-full rounded-full"
                          />
                       )}
                    </div>
                  )}

                  <div className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center relative z-10 shrink-0 transition-all duration-700 border-4 border-white shadow-xl
                    ${isCompleted ? 'bg-spp-green text-white scale-110' : 
                      isActive ? 'bg-spp-navy text-white scale-110 ring-4 ring-spp-navy/10' : 'bg-slate-50 text-slate-300 border-slate-100'}
                  `}>
                    {isCompleted ? <CheckCheck size={18} /> : isActive ? <Zap size={18} className="fill-spp-green text-spp-green" /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
                  </div>

                  <div className={`flex-grow space-y-4 ${isPending ? 'opacity-30 grayscale' : ''}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h5 className={`text-base md:text-lg font-black tracking-tight leading-none uppercase ${isActive ? 'text-spp-navy' : isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                          {stage.name}
                        </h5>
                        <p className={`text-[11px] md:text-xs font-bold leading-relaxed max-w-xl ${isPending ? 'text-slate-200' : 'text-slate-400'}`}>
                          {stage.desc}
                        </p>
                      </div>
                      
                      {stageData.updatedAt && (
                        <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest shrink-0 shadow-sm flex items-center gap-2 w-fit">
                           <Clock size={10} />
                           {formatDate(stageData.updatedAt)}
                        </div>
                      )}

                      {isActive && (
                        <div className="px-5 py-3 bg-spp-green text-spp-navy text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-spp-green/10 animate-pulse shrink-0 border-2 border-white w-fit">
                           Action Active
                        </div>
                      )}
                    </div>

                    {((isActive || (isCompleted && index === currentStageIndex)) && (
                      <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[24px] md:rounded-3xl space-y-6 animate-in slide-in-from-top-4 duration-700">
                         {/* Functional Sections */}
                         {stage.name === 'Site Survey Scheduled' && project.statusTimeline?.surveyDetails?.engineerName && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
                               <div className="space-y-2">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Protocol Engineer</p>
                                  <p className="text-sm font-black text-spp-navy">{project.statusTimeline.surveyDetails.engineerName}</p>
                               </div>
                               <div className="hidden sm:block w-px h-10 bg-slate-100"></div>
                               <div className="space-y-2">
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Scheduled Arrival</p>
                                  <p className="text-sm font-black text-spp-navy">
                                    {formatDate(project.statusTimeline.surveyDetails.date)} @ {project.statusTimeline.surveyDetails.time}
                                  </p>
                               </div>
                            </div>
                         )}

                         {stage.name === 'Design Prepared' && project.statusTimeline?.designProtocol?.fileUrl && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm gap-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-spp-navy shrink-0">
                                     <PencilRuler size={20} />
                                  </div>
                                  <p className="text-[11px] font-black text-spp-navy uppercase">Engineering Design Blueprints</p>
                               </div>
                               <button 
                                 onClick={() => window.open(project.statusTimeline.designProtocol.fileUrl, '_blank')}
                                 className="w-full sm:w-auto px-6 py-2 rounded-xl bg-spp-navy text-white text-[10px] font-black hover:bg-spp-green hover:text-spp-navy transition-all flex items-center justify-center gap-2"
                               >
                                 <Eye size={14} /> VIEW
                               </button>
                            </div>
                         )}

                         {stage.name === 'Quotation Generated' && project.statusTimeline?.financialMetrics?.quotationAmount && (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-spp-navy rounded-2xl text-white shadow-2xl shadow-spp-navy/20 relative overflow-hidden gap-6">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-spp-green/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                               <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
                                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-spp-green shrink-0">
                                     <IndianRupee size={24} />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Protocol Quotation</p>
                                     <p className="text-xl font-black italic mt-1">₹{project.statusTimeline.financialMetrics.quotationAmount.toLocaleString()}</p>
                                  </div>
                               </div>
                               <button className="w-full md:w-auto px-6 py-3 rounded-xl bg-spp-green text-spp-navy text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all relative z-10 shadow-lg">Accept Offer</button>
                            </div>
                         )}

                         {stage.name === 'Purchase Order Issued' && project.statusTimeline?.financialMetrics?.poNumber && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                               <div className="flex items-center gap-4">
                                  <FileText className="text-spp-green" size={20} />
                                  <div>
                                     <p className="text-[10px] font-black text-slate-300 uppercase leading-none">PO Reference</p>
                                     <p className="text-sm font-black text-spp-navy mt-1">{project.statusTimeline.financialMetrics.poNumber}</p>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <ShieldCheck className="text-spp-navy" size={20} />
                                  <div>
                                     <p className="text-[10px] font-black text-slate-300 uppercase leading-none">Verified</p>
                                     <p className="text-sm font-black text-spp-navy mt-1">Contract Active</p>
                                  </div>
                               </div>
                             </div>
                         )}

                         {stageData.note && (
                            <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-spp-navy flex items-start gap-4">
                               <Activity size={16} className="text-spp-navy mt-0.5 shrink-0" />
                               <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">Note: {stageData.note}</p>
                            </div>
                         )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Column - Only visible when NOT in Modal view */}
        {!isModalView && (
          <div className="space-y-8 md:space-y-10 h-fit xl:sticky xl:top-32">
            <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm group">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-spp-green shadow-inner">
                       <MapPin size={24} />
                    </div>
                    <h5 className="text-xl font-black text-spp-navy tracking-tight italic leading-none">Installation <span className="text-spp-green">Site</span></h5>
                 </div>
                 
                 <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Site Parameters</p>
                      <p className="text-sm font-black text-spp-navy leading-relaxed italic mt-1">
                        {project.propertyDetails?.address || 'Site Address'}, {project.propertyDetails?.city || 'Location'}
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Effective Area</p>
                        <p className="text-lg font-black text-spp-green tracking-tighter italic mt-1">
                          {project.propertyDetails?.availableSpace || '---'} <span className="text-[10px] uppercase ml-1">SQ FT</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200">
                        <Activity size={20} />
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Technical Team Card */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center pb-2">
                 <h5 className="text-xl font-black text-spp-navy tracking-tight italic">Technical <span className="text-spp-green">Unit</span></h5>
                 <button className="text-slate-300 hover:text-spp-navy transition-all"><ExternalLink size={18} /></button>
              </div>

              <div className="space-y-6">
                {[
                  { name: project.statusTimeline?.surveyDetails?.engineerName || 'Unit Commander', role: 'Protocol Lead', icon: <Building2 /> },
                  { name: 'Sandeep Singh', role: 'Integration Expert', icon: <Zap /> }
                ].map((member, i) => (
                   <div key={i} className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-5 w-full">
                       <div className="w-12 md:w-14 h-12 md:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-spp-navy shadow-inner shrink-0">
                          <User size={24} />
                       </div>
                       <div>
                         <p className="text-sm font-black text-spp-navy leading-none mb-1.5">{member.name}</p>
                         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{member.role}</p>
                       </div>
                    </div>
                    <button className="w-full sm:w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-spp-navy hover:text-white transition-all shadow-sm flex items-center justify-center">
                      <Phone size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <button className="w-full py-5 rounded-[24px] bg-spp-navy text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-spp-navy/90 hover:shadow-2xl hover:shadow-spp-navy/20 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                    <RefreshCcw size={16} className="text-spp-green" />
                    Sync Unit Data 
                 </button>
              </div>
            </div>

            <div className="p-8 rounded-[32px] md:rounded-[40px] bg-spp-navy relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-spp-green/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               <p className="text-[9px] font-black text-spp-green uppercase tracking-[0.4em] mb-4 relative z-10 italic">Industrial Shield</p>
               <div className="flex items-start gap-4 relative z-10">
                  <ShieldCheck size={24} className="text-spp-green shrink-0 mt-1" />
                  <p className="text-[11px] font-bold text-white/50 leading-relaxed italic">Synchronized installation protocol active. All safety metrics verified against regional solar standards.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
