import React, { useState } from 'react';
import api from '../services/api';
import { 
  User, 
  MapPin, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  ClipboardCheck,
  Trash2
} from 'lucide-react';

function SolarInstallationForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [projectQueue, setProjectQueue] = useState([]);
  const [formData, setFormData] = useState({
    consumerInfo: { name: '', contactNumber: '', email: '' },
    propertyDetails: { address: '', city: '', roofType: '', availableSpace: '' },
    energyProfile: { monthlyBill: '', desiredCapacity: '' }
  });

  const resetForm = () => {
    setFormData({
      consumerInfo: { name: '', contactNumber: '', email: '' },
      propertyDetails: { address: '', city: '', roofType: '', availableSpace: '' },
      energyProfile: { monthlyBill: '', desiredCapacity: '' }
    });
    setStep(1);
  };

  const addToQueue = () => {
    // Basic validation before adding
    if (!formData.consumerInfo.name || !formData.propertyDetails.address) return alert("Incomplete parameters detected.");
    setProjectQueue([...projectQueue, formData]);
    resetForm();
  };

  const removeFromQueue = (index) => {
    const newQueue = [...projectQueue];
    newQueue.splice(index, 1);
    setProjectQueue(newQueue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });
    
    try {
      const token = localStorage.getItem('token');
      // Submit the entire queue plus the current form if not empty
      const submissions = [...projectQueue];
      if (formData.consumerInfo.name) submissions.push(formData);

      if (submissions.length === 0) return alert("Protocol Error: No consumer data in queue.");

      const response = await api.post('/projects/submit-batch', { projects: submissions });
      
      if (response.data.success) {
        setStatus({ type: 'success', message: `${submissions.length} project protocols synchronized. Global installation cycle initialized.` });
        setTimeout(() => { 
          if (onComplete) onComplete();
          else window.location.href = '/dashboard'; 
        }, 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Synchronization failure. Field request rejected.';
      setStatus({ type: 'error', message: errorMsg });
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-16 relative">
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0"></div>
      {[
        { s: 1, label: 'Identity', icon: <User size={12}/> },
        { s: 2, label: 'Site', icon: <MapPin size={12}/> },
        { s: 3, label: 'Energy', icon: <Zap size={12}/> },
        { s: 4, label: 'Review', icon: <ClipboardCheck size={12}/> }
      ].map((item) => (
        <div key={item.s} className="relative z-10 flex flex-col items-center gap-3">
          <div 
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
              step === item.s ? 'bg-spp-green border-spp-green text-spp-navy shadow-lg shadow-spp-green/30 scale-110' : 
              step > item.s ? 'bg-spp-navy border-spp-navy text-white shadow-md' : 'bg-white border-slate-100 text-slate-300'
            }`}
          >
            {item.icon}
          </div>
          <span className={`text-[8px] font-black uppercase tracking-widest ${step >= item.s ? 'text-spp-navy' : 'text-slate-300'}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-4 md:py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-white rounded-[40px] shadow-2xl shadow-spp-navy/5 border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        
        {/* Navigation Header */}
        <div className="p-8 md:p-14 border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-spp-green/10 border border-spp-green/20 rounded-full text-[9px] font-black text-spp-green uppercase tracking-[0.2em]">
                  Industrial Protocol: v2.6.4
               </div>
               <h2 className="text-3xl md:text-4xl font-extra-black text-spp-navy tracking-tighter leading-tight italic">
                  Initiate <span className="text-spp-green underline underline-offset-8 decoration-2">Installation</span>
               </h2>
               <p className="text-slate-400 text-xs max-w-sm font-bold uppercase tracking-widest leading-relaxed opacity-70">
                  Capturing field diagnostics for regional solar synchronization.
               </p>
            </div>
          </div>
        </div>

        {/* Global Alert System */}
        {status.type && (
          <div className={`mx-6 md:mx-14 mt-10 p-6 rounded-3xl flex items-center gap-5 animate-in zoom-in-95 duration-300 shadow-sm ${
            status.type === 'success' ? 'bg-green-50 border border-green-100 text-green-700' : 'bg-red-50 border border-red-100 text-red-700'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
               {status.type === 'success' ? <CheckCircle2 size={20}/> : <ShieldAlert size={20}/>}
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em]">{status.type === 'success' ? 'Protocol Synchronized' : 'Diagnostic Failure'}</p>
               <p className="text-xs font-bold opacity-80 mt-1">{status.message}</p>
            </div>
          </div>
        )}

        <div className="px-6 md:px-14 pt-10">
           {renderStepIndicator()}
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-14 pt-0">
          {step === 1 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
              <SectionHeading icon={<User size={20}/>} title="Identity Diagnostics" subtitle="Verification of consumer credentials" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormInput label="Account Holder" name="consumerInfo.name" value={formData.consumerInfo.name} onChange={handleChange} placeholder="e.g. Johnathan Miller" required />
                <FormInput label="Primary contact" name="consumerInfo.contactNumber" value={formData.consumerInfo.contactNumber} onChange={handleChange} placeholder="+91 00000 00000" required />
              </div>
              <FormInput label="Network Email" name="consumerInfo.email" value={formData.consumerInfo.email} onChange={handleChange} type="email" placeholder="consumer@industrial.access" />
              <div className="pt-6">
                 <StepButton onClick={() => setStep(2)} label="Analyze Site Parameters" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
              <SectionHeading icon={<MapPin size={20}/>} title="Site Parameters" subtitle="Geospatial and structural diagnostics" />
              <div className="grid grid-cols-1 gap-10">
                 <FormInput label="Site Address (Full Line)" name="propertyDetails.address" value={formData.propertyDetails.address} onChange={handleChange} placeholder="Industrial Zone, Building 4-B, Mumbai" required />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <FormSelect 
                      label="Regional Base" 
                      name="propertyDetails.city" 
                      value={formData.propertyDetails.city} 
                      onChange={handleChange}
                      required
                      options={[
                        { value: 'Mumbai', label: 'Mumbai Industrial Area' },
                        { value: 'Pune', label: 'Pune Tech Corridor' },
                        { value: 'Delhi', label: 'Delhi NCR Region' },
                        { value: 'Bangalore', label: 'Bangalore Energy Hub' }
                      ]}
                    />
                    <FormSelect 
                      label="Structure Category" 
                      name="propertyDetails.roofType" 
                      value={formData.propertyDetails.roofType} 
                      onChange={handleChange}
                      required
                      options={[
                        { value: 'RCC', label: 'RCC Concrete Support' },
                        { value: 'Sheet', label: 'Industrial Metal Framing' },
                        { value: 'Open', label: 'Reinforced Ground Plot' }
                      ]}
                    />
                 </div>
                 <FormInput label="Net Effective Area (Square Feet)" name="propertyDetails.availableSpace" value={formData.propertyDetails.availableSpace} onChange={handleChange} type="number" placeholder="Primary shadow-free zone" />
              </div>
              <NavigationButtons onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Load Profile Analysis" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
              <SectionHeading icon={<Zap size={20}/>} title="Load Profile" subtitle="Power consumption and requirements" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormInput label="Avg Monthly Yield Cost (₹)" name="energyProfile.monthlyBill" value={formData.energyProfile.monthlyBill} onChange={handleChange} type="number" placeholder="Average Billing" />
                <FormInput label="Target Solar Load (kW)" name="energyProfile.desiredCapacity" value={formData.energyProfile.desiredCapacity} onChange={handleChange} type="number" placeholder="Calculated Demand" />
              </div>
              
              <div className="p-6 md:p-10 rounded-[32px] bg-spp-navy text-white flex flex-col md:flex-row gap-8 group hover:bg-spp-navy/95 transition-all duration-500">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-spp-green animate-pulse shrink-0">
                   <ShieldCheck size={28}/>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-spp-green">Verification Compliance</p>
                   <p className="text-sm font-medium text-slate-300 leading-relaxed italic">
                    By proceeding, you verify that a certified field engineer has validated these metrics at the site coordinate designated above.
                   </p>
                </div>
              </div>
              <NavigationButtons onBack={() => setStep(2)} onNext={() => setStep(4)} nextLabel="Final Protocol Review" />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                <SectionHeading icon={<ClipboardCheck size={20}/>} title="Protocol Summary" subtitle="Final validation before cloud transmission" />
                
                {/* Project Queue Visualization */}
                {projectQueue.length > 0 && (
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-spp-green uppercase tracking-[0.4em]">Active Project Queue ({projectQueue.length})</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectQueue.map((p, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-spp-navy text-white flex justify-between items-center shadow-lg shadow-spp-navy/10 animate-in slide-in-from-left-4 duration-300">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-[10px] text-spp-green">#{idx + 1}</div>
                                <div>
                                   <p className="text-xs font-black truncate max-w-[120px]">{p.consumerInfo.name}</p>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.energyProfile.desiredCapacity}kW Installation</p>
                                 </div>
                             </div>
                             <button type="button" onClick={() => removeFromQueue(idx)} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                <div className="p-6 md:p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-[9px] font-black text-spp-navy uppercase tracking-[0.4em]">Current Consumer Diagnostics</p>
                    <button type="button" onClick={addToQueue} className="px-4 py-2 bg-spp-navy text-spp-green rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Add to Batch Queue</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReviewCard title="Identity" icon={<User size={14}/>} items={[
                        { label: 'Holder', value: formData.consumerInfo.name },
                        { label: 'Contact', value: formData.consumerInfo.contactNumber }
                    ]} onEdit={() => setStep(1)} />

                    <ReviewCard title="Location" icon={<MapPin size={14}/>} items={[
                        { label: 'Regional', value: formData.propertyDetails.city },
                        { label: 'Base', value: formData.propertyDetails.address }
                    ]} onEdit={() => setStep(2)} />

                    <ReviewCard title="Structure" icon={<Building2 size={14}/>} items={[
                        { label: 'Category', value: formData.propertyDetails.roofType },
                        { label: 'Capacity', value: `${formData.propertyDetails.availableSpace} sq ft` }
                    ]} onEdit={() => setStep(2)} />

                    <ReviewCard title="Energy" icon={<Zap size={14}/>} items={[
                        { label: 'Load Cycle', value: `₹${formData.energyProfile.monthlyBill}` },
                        { label: 'Output', value: `${formData.energyProfile.desiredCapacity} kW` }
                    ]} onEdit={() => setStep(3)} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6 items-center">
                  <button type="button" className="w-full sm:w-auto px-8 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-spp-navy transition-all border border-transparent hover:border-slate-100 rounded-2xl" onClick={() => setStep(1)}>Reset Form</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-grow w-full sm:w-auto bg-spp-navy text-white rounded-[24px] py-6 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-spp-navy/30 hover:bg-spp-green hover:text-spp-navy transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Initializing {projectQueue.length + (formData.consumerInfo.name ? 1 : 0)} Protocols...
                      </>
                    ) : (
                      <>Execute Batch Transmission ({projectQueue.length + (formData.consumerInfo.name ? 1 : 0)}) <ChevronRight size={18}/></>
                    )}
                  </button>
                </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-spp-navy border border-slate-100 shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-black text-spp-navy tracking-tight leading-none italic">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic flex items-center gap-2">
           <span className="w-1 h-1 bg-spp-green rounded-full"></span> {subtitle}
        </p>
      </div>
    </div>
  );
}

function FormInput({ label, ...props }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-spp-navy/5 focus:border-spp-navy focus:bg-white transition-all font-bold text-sm text-spp-navy placeholder:text-slate-300 shadow-sm"
        {...props} 
      />
    </div>
  );
}

function FormSelect({ label, options, ...props }) {
  return (
     <div className="space-y-3">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        <select 
          className="w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-slate-100 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-spp-navy/5 focus:border-spp-navy focus:bg-white transition-all font-bold text-sm text-spp-navy appearance-none shadow-sm cursor-pointer"
          {...props}
        >
          <option value="">Selection Protocol...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
           <ChevronRight size={16} className="rotate-90" />
        </div>
      </div>
    </div>
  )
}

function StepButton({ onClick, label }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="w-full bg-spp-navy text-white py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-spp-navy/20 flex items-center justify-center gap-4 group transition-all hover:bg-spp-green hover:text-spp-navy"
    >
      {label} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function NavigationButtons({ onBack, onNext, nextLabel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-10">
      <button type="button" onClick={onBack} className="flex-1 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-spp-navy transition-all flex items-center justify-center gap-3 border-2 border-slate-50 rounded-2xl hover:bg-slate-50">
        <ChevronLeft size={18}/> Re-Calibrate
      </button>
      <button type="button" onClick={onNext} className="sm:flex-[3] bg-spp-navy text-white rounded-[24px] py-5 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-spp-navy/20 hover:bg-spp-green hover:text-spp-navy transition-all flex items-center justify-center gap-4 group">
        {nextLabel} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function ReviewCard({ title, items, icon, onEdit }) {
  return (
    <div className="p-6 md:p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-6 hover:shadow-xl hover:shadow-spp-navy/5 transition-all duration-500 group">
      <div className="flex justify-between items-center">
         <div className="flex items-center gap-3">
            <div className="text-spp-green group-hover:scale-110 transition-transform">{icon}</div>
            <h4 className="text-[10px] font-black text-spp-navy uppercase tracking-widest">{title} Protocol</h4>
         </div>
         <button type="button" onClick={onEdit} className="text-[9px] font-black text-spp-navy uppercase tracking-widest bg-white border border-slate-100 px-3 py-1.5 rounded-xl hover:bg-spp-navy hover:text-white transition-all shadow-sm">Scale</button>
      </div>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.label} className="flex justify-between items-center border-b border-slate-200/40 pb-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{i.label}</span>
            <span className="text-xs font-black text-spp-navy truncate max-w-[120px] sm:max-w-[150px] italic">{i.value || 'NULL'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SolarInstallationForm;
