import React from 'react';
import { Shield, Lock, FileCheck, ChevronLeft, ArrowRight, Zap } from 'lucide-react';

export const LegalDocs = () => {
  const sections = [
    {
      title: "Vendor Agreement",
      id: "TERMS-001",
      content: "All vendors must agree to terms before accessing the platform. Vendors are independent contractors and responsible for compliance with all applicable laws."
    },
    {
      title: "Service Standards",
      id: "QUAL-002",
      content: "Vendors must maintain professional standards and complete work as per company specifications. Quality assurance checks are mandatory."
    },
    {
      title: "Payment Terms",
      id: "FIN-003",
      content: "Payments are processed within 30 days of invoice approval and project completion verification."
    },
    {
      title: "Confidentiality",
      id: "SEC-004",
      content: "Vendors must maintain confidentiality of consumer information and company processes."
    },
    {
      title: "Dispute Resolution",
      id: "LEGAL-005",
      content: "Any disputes will be resolved through company's dispute management process."
    },
    {
      title: "Compliance",
      id: "TAX-006",
      content: "Vendors must comply with GST, income tax, and all regulatory requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] font-sans selection:bg-spp-navy/10 selection:text-spp-navy">
      {/* Top Precision Bar */}
      <div className="h-2 bg-spp-navy w-full outline outline-1 outline-white/10"></div>
      
      <div className="max-w-6xl mx-auto px-8 pt-20 pb-32">
        {/* Editorial Header */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white shadow-sm border border-slate-100 rounded-lg">
               <div className="w-2 h-2 rounded-full bg-spp-navy animate-pulse"></div>
               <span className="text-[10px] font-black text-spp-navy uppercase tracking-[0.2em] font-manrope">Industrial Compliance Terminal v3.5.0</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-[#00113a] leading-[0.95] tracking-tight font-manrope">
              Legal <br />
              <span className="text-spp-green">Infrastructure</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl font-inter">
              Establishing the authoritative framework for vendor partnerships and data integrity within the Swastik renewable ecosystem.
            </p>
          </div>

          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-4 px-8 py-5 bg-[#00113a] text-white rounded-2xl shadow-2xl shadow-[#00113a]/20 hover:scale-[1.02] active:scale-95 transition-all font-manrope"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Return to Terminal</span>
          </button>
        </header>

        {/* Sectional Grid (No-Line Rule) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-200/50 rounded-[40px] overflow-hidden border-2 border-slate-100 shadow-sm">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="bg-white p-12 hover:bg-[#f2f4f7] transition-colors duration-500 flex flex-col gap-8 group"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-spp-navy group-hover:text-white transition-all">
                  <FileCheck size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-spp-navy transition-colors">{section.id}</span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-extrabold text-[#00113a] tracking-tight font-manrope leading-none uppercase">
                  {section.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium font-inter group-hover:text-slate-900 transition-colors">
                  {section.content}
                </p>
              </div>

              <div className="mt-auto pt-8 flex items-center gap-2">
                 <div className="h-[2px] w-8 bg-slate-100 group-hover:w-16 group-hover:bg-spp-green transition-all duration-700"></div>
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-spp-green">Acknowledged</span>
              </div>
            </div>
          ))}
        </div>

        {/* Acknowledgment & Standardized Footer */}
        <section className="mt-24 space-y-12">
          <div className="bg-[#00113a] rounded-[48px] p-20 relative overflow-hidden text-white shadow-2xl">
             <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
                <Zap size={240} />
             </div>
             
             <div className="relative z-10 max-w-2xl space-y-8">
               <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-spp-green/20 text-spp-green text-[10px] font-black uppercase tracking-widest">
                  Authentication Required
               </div>
               <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight font-manrope">
                 By accessing this hub, you synchronize with our operational protocols.
               </h2>
               <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest font-manrope">
                  <Lock size={12} /> Secure Transmission • Last Update April 2026
               </div>
             </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-100">
             <div className="flex flex-col gap-1 text-center md:text-left">
                <p className="text-[11px] font-extrabold text-[#00113a] uppercase tracking-[0.1em] font-manrope">
                  © 2026 Swastik Power Pro. All Rights Reserved.
                </p>
                <p className="text-[10px] font-bold text-spp-green uppercase tracking-[0.3em] font-manrope">
                  Govt. Authorized Solar Vendor.
                </p>
             </div>

             <div className="flex items-center gap-8">
                {['Privacy', 'Vendor Terms', 'Infrastructure Standards'].map(item => (
                  <button key={item} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-colors">{item}</button>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};
