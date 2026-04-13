import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Sun, 
  Wind, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  ArrowRight, 
  CheckCircle2,
  Cpu,
  Globe,
  HardHat
} from 'lucide-react';

const Solutions = ({ isLoggedIn }) => {
  const [showForm, setShowForm] = useState(false);
  const [showWaterForm, setShowWaterForm] = useState(false);

  const handleSolarSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/inquiries', {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        type: 'Solar Infrastructure Quote',
      });
      alert('Quote Request Sent! Our engineers will contact you shortly.');
      setShowForm(false);
    } catch (err) {
      alert('Failed to send request. Protocol Error.');
    }
  };

  const handleWaterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/inquiries', {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        type: 'Water Management Quote',
      });
      alert('Quote Request Sent! Our engineers will contact you shortly.');
      setShowWaterForm(false);
    } catch (err) {
      alert('Failed to send request. Protocol Error.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SOLUTIONS HERO */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-spp-navy text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-spp-navy/40 via-spp-navy/80 to-spp-navy z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1773624737992-6c7f16a39c9a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Renewable Energy Farm" 
            className="w-full h-full object-cover grayscale opacity-30" 
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-spp-green/10 text-spp-green text-xs font-bold tracking-[0.2em] mb-8 border border-spp-green/20 animate-in">
            <Cpu size={14} />
            ENGINEERING THE FUTURE
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight uppercase">
            Our Industrial <br />
            <span className="text-spp-green">Solutions</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Deploying high-performance renewable infrastructure and smart management systems for national development.
          </p>
        </div>
      </section>

      {/* DETAILED SERVICES GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SOLAR SOLUTION */}
          <div className="group bg-white p-8 md:p-12 rounded-[40px] border border-solar-border shadow-soft hover:border-spp-green transition-all duration-500 flex flex-col justify-between h-full overflow-hidden relative">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-spp-green/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div className="w-16 h-16 bg-spp-green/10 rounded-2xl flex items-center justify-center text-spp-green mb-8 group-hover:scale-110 transition-transform">
                <Sun size={32} />
              </div>
              <h2 className="text-3xl font-black text-spp-navy mb-6 tracking-tight uppercase">Solar Infrastructure</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium text-lg">
                Comprehensive EPC (Engineering, Procurement, and Construction) services for utility-scale solar farms and industrial energy parks.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-green" /> High-Efficiency Mono-PERC Systems
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-green" /> Industrial Grid Synchronization
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-green" /> Predictive Maintenance & Analytics
                </li>
              </ul>
            </div>
            {showForm ? (
              <form className="mt-4 space-y-4 animate-in fade-in zoom-in-95" onSubmit={handleSolarSubmit}>
                <input name="name" type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-green transition-colors" />
                <input name="email" type="email" placeholder="Work Email" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-green transition-colors" />
                <textarea name="message" placeholder="Project Requirements..." rows="3" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-green transition-colors resize-none"></textarea>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-spp-navy text-white font-black py-3 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-spp-green hover:text-white transition-all shadow-lg">Submit Request</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs uppercase hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowForm(true)} className="w-full bg-spp-navy text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-spp-green transition-all shadow-lg active:scale-95">Request Technical Quote</button>
            )}
          </div>

          {/* WATER SOLUTION */}
          <div className="group bg-white p-8 md:p-12 rounded-[40px] border border-solar-border shadow-soft hover:border-spp-green transition-all duration-500 flex flex-col justify-between h-full overflow-hidden relative">
             <div className="absolute -top-12 -right-12 w-64 h-64 bg-spp-navy/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div className="w-16 h-16 bg-spp-navy/5 rounded-2xl flex items-center justify-center text-spp-navy mb-8 group-hover:scale-110 transition-transform">
                <Droplets size={32} />
              </div>
              <h2 className="text-3xl font-black text-spp-navy mb-6 tracking-tight uppercase">Water Management</h2>
              <p className="text-slate-500 mb-10 leading-relaxed font-medium text-lg">
                Proud partners in the national Jal Jeevan Mission, designing and constructing robust elevated reservoirs and pump networks.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-navy" /> Structural Reservoir Engineering
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-navy" /> Automated Pumping Systems
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                  <CheckCircle2 size={20} className="text-spp-navy" /> Rural Supply Grid Network
                </li>
              </ul>
            </div>
            {showWaterForm ? (
              <form className="mt-4 space-y-4 animate-in fade-in zoom-in-95" onSubmit={handleWaterSubmit}>
                <input name="name" type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-navy transition-colors" />
                <input name="email" type="email" placeholder="Work Email" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-navy transition-colors" />
                <textarea name="message" placeholder="Project Requirements..." rows="3" required className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-spp-navy transition-colors resize-none"></textarea>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-spp-navy text-white font-black py-3 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg">Submit Request</button>
                  <button type="button" onClick={() => setShowWaterForm(false)} className="px-5 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-xs uppercase hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            ) : (
              <button onClick={() => setShowWaterForm(true)} className="w-full bg-spp-navy text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg active:scale-95">Request Technical Quote</button>
            )}
          </div>

        </div>

        {/* ADDITIONAL SERVICES SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pb-24">
          <SolutionServiceCard 
            icon={<Wind size={24} />} 
            title="Wind Energy" 
            desc="Strategic feasibility audits and high-altitude turbine site installations for industrial grids."
          />
          <SolutionServiceCard 
            icon={<BarChart3 size={24} />} 
            title="Energy Audits" 
            desc="In-depth analysis of power consumption patterns to optimize ROI on renewable investments."
          />
          <SolutionServiceCard 
            icon={<ShieldCheck size={24} />} 
            title="Govt. Compliance" 
            desc="Ensuring every installation meets the stringent standards for national utility projects."
          />
        </div>

        {/* TECH STACK / CAPABILITIES */}
        <section className="bg-slate-50 rounded-[50px] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none grayscale brightness-0">
             <Globe size={300} />
          </div>
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black text-spp-navy mb-8 tracking-tight leading-tight uppercase">Technical <br /><span className="text-spp-green">Capabilities</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 font-medium">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-spp-navy">Strategic Engineering</h4>
                <p className="text-slate-500 leading-relaxed text-sm">Every project is designed with a 25-plus-year lifecycle, using redundant systems and industrial-grade hardening to ensure grid stability and national infrastructure resilience.</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-spp-navy">Global Standards</h4>
                <p className="text-slate-500 leading-relaxed text-sm">Our engineering protocols follow international ASHRAE and IEEE benchmarks, adapted for India's diverse climatic zones from coastal regions to high-altitude deserts.</p>
              </div>
            </div>
            
            <div className="mt-16 flex flex-wrap gap-8 opacity-40 grayscale brightness-0">
               <Zap size={40} />
               <Settings size={40} />
               <Cpu size={40} />
               <HardHat size={40} />
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-spp-navy mb-8 tracking-tight uppercase">Ready to synchronize?</h2>
            <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">Our technical engineers are standby to help you model your energy requirements and transition to the green grid.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/#contact" className="px-10 py-5 bg-spp-green text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-premium hover:-translate-y-1 transition-all active:scale-95">Initiate Contact</Link>
              <Link to={isLoggedIn ? "/dashboard" : "/login"} className="px-10 py-5 border border-solar-border text-spp-navy rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-2">View Portfolio <ArrowRight size={18} /></Link>
            </div>
        </section>
      </div>
    </div>
  );
};

const SolutionServiceCard = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[32px] border border-solar-border shadow-soft hover:shadow-xl transition-all group h-full flex flex-col items-center text-center">
    <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-spp-navy mb-6 group-hover:bg-spp-navy group-hover:text-white transition-all">
      {icon}
    </div>
    <h4 className="text-xl font-bold text-spp-navy mb-4 tracking-tight uppercase">{title}</h4>
    <p className="text-slate-400 text-xs font-bold leading-relaxed tracking-wider uppercase">{desc}</p>
  </div>
);

export default Solutions;
