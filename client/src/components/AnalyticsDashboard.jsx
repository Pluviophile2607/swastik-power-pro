import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Activity
} from 'lucide-react';

function AnalyticsDashboard({ projects, vendors, invoices }) {
  // Memoized Stat Calculations
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.statusTimeline.currentStage === 'Completed').length;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    
    const pendingLiabilities = invoices
      .filter(i => i.status === 'Approved' || i.status === 'Uploaded')
      .reduce((sum, i) => sum + i.amount, 0);
    
    const totalDisbursed = invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0);

    return {
      totalProjects,
      completedProjects,
      completionRate,
      pendingLiabilities,
      totalDisbursed,
      activeVendors: vendors.length
    };
  }, [projects, vendors, invoices]);

  // Mock Timeline Efficiency (Average days spent in major blocks)
  const timelineData = [
    { label: 'Site Survey', value: 85, color: '#01A862' },
    { label: 'Procurement', value: 65, color: '#0F172A' },
    { label: 'Installation', value: 92, color: '#01A862' },
    { label: 'Commissioning', value: 45, color: '#0F172A' }
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      {/* Header Intelligence */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h3 className="text-4xl font-extra-black text-spp-navy tracking-tight italic">Industrial <span className="text-spp-green underline">Intelligence</span></h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Real-time performance diagnostics & throughput metrics</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-spp-navy text-spp-green rounded-xl border border-spp-navy shadow-lg shadow-spp-navy/20">
          <Activity size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Protocol: Live Stream Engaged</span>
        </div>
      </div>

      {/* KPI Command Center */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPIBox 
          label="Total Installations" 
          value={stats.totalProjects} 
          sub="+12% from last cycle"
          icon={<TrendingUp size={20} />} 
          trend="up"
        />
        <KPIBox 
          label="Completion Throughput" 
          value={`${stats.completionRate}%`} 
          sub={`${stats.completedProjects} units finalized`}
          icon={<Clock size={20} />} 
          trend="up"
        />
        <KPIBox 
          label="Pending Liabilities" 
          value={`₹${(stats.pendingLiabilities / 100000).toFixed(1)}L`} 
          sub="Locked in approval cycle"
          icon={<AlertCircle size={20} />} 
          trend="down"
        />
        <KPIBox 
          label="Capital Disbursed" 
          value={`₹${(stats.totalDisbursed / 100000).toFixed(1)}L`} 
          sub="Industrial settlement total"
          icon={<IndianRupee size={20} />} 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Efficiency Bar Chart */}
        <div className="lg:col-span-2 p-6 md:p-14 bg-white rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h4 className="text-2xl font-black text-spp-navy italic tracking-tight">Timeline <span className="text-spp-green">Efficiency</span></h4>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 font-mono">Stage Throughput Efficiency Rating (%)</p>
            </div>
            <BarChart3 className="text-slate-100" size={40} />
          </div>

          <div className="space-y-8">
            {timelineData.map((stage, idx) => (
              <div key={idx} className="space-y-3">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-spp-navy uppercase tracking-widest leading-none">{stage.label}</span>
                    <span className="text-xs font-extra-black text-spp-navy">{stage.value}%</span>
                 </div>
                 <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(1,168,98,0.2)]" 
                      style={{ 
                        width: `${stage.value}%`, 
                        backgroundColor: stage.color,
                        transitionDelay: `${idx * 150}ms`
                      }}
                    ></div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Stats Intelligence */}
        <div className="space-y-8">
           <div className="p-8 md:p-10 bg-spp-navy rounded-[32px] md:rounded-[40px] text-white shadow-2xl shadow-spp-navy/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-spp-green/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-spp-green/20 transition-all duration-1000"></div>
              <h4 className="text-[9px] font-black text-spp-green uppercase tracking-[0.4em] mb-8">Force Multiplication</h4>
              <div className="flex items-center gap-6">
                 <div className="text-6xl font-extra-black italic">{stats.activeVendors}</div>
                 <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-slate-400">Verified</p>
                    <p className="text-xs font-black uppercase text-white">Technicians</p>
                 </div>
              </div>
              <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                 <Users size={16} className="text-spp-green" />
                 <p className="text-[9px] font-bold text-slate-300 italic">Network operational across 12 sectors.</p>
              </div>
           </div>

           <div className="p-8 md:p-10 bg-white rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Protocol Alert</h4>
              <div className="space-y-6">
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0 border border-red-100"><AlertCircle size={18} className="text-red-500"/></div>
                    <div>
                       <p className="text-[10px] font-black text-spp-navy uppercase">Block Bottleneck</p>
                       <p className="text-[9px] font-bold text-slate-400 leading-relaxed mt-1 italic">3 projects stagnated in Stage 9 (Procurement Pipeline).</p>
                    </div>
                 </div>
                 <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 border border-green-100"><BarChart3 size={18} className="text-spp-green"/></div>
                    <div>
                       <p className="text-[10px] font-black text-spp-navy uppercase">Peak Performance</p>
                       <p className="text-[9px] font-bold text-slate-400 leading-relaxed mt-1 italic">Highest efficiency recorded in "Mechanical Mounting" (Stage 10).</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function KPIBox({ label, value, sub, icon, trend }) {
  return (
    <div className="p-8 md:p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-spp-navy group-hover:text-white transition-all duration-500">
           {icon}
        </div>
        <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-spp-green' : 'text-red-500'}`}>
           {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
           <span className="text-[10px] font-black uppercase">Sync</span>
        </div>
      </div>
      <div>
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-3xl font-extra-black text-spp-navy italic tracking-tighter">{value}</h4>
         <p className="text-[9px] font-bold text-slate-400 mt-2 italic">{sub}</p>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
