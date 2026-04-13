import React, { useState } from 'react';
import { 
  Search, 
  FilePlus, 
  RotateCw, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';

export default function InvoicesDashboard({ invoices = [], searchQuery = '', onDetail, onRefresh, onUpload, user }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);

  const stats = {
    outstanding: invoices
      .filter(i => ['Uploaded', 'Reviewing', 'Approved'].includes(i.status))
      .reduce((sum, i) => sum + i.amount, 0),
    paidCount: invoices.filter(i => i.status === 'Paid').length,
    pendingCount: invoices.filter(i => i.status === 'Uploaded').length
  };

  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = 
      (i.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.projectId?.consumerInfo?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSync = async () => {
    setIsSyncing(true);
    await onRefresh();
    setTimeout(() => setIsSyncing(false), 1000);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-stitch-secondary-container text-stitch-on-secondary-container border-stitch-secondary/20';
      case 'Approved': return 'bg-blue-50 text-stitch-primary border-stitch-primary/20';
      case 'Uploaded': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-stitch-error-container text-stitch-error border-stitch-error/20';
      case 'Reviewing': return 'bg-stitch-surface-low text-stitch-on-surface-variant border-stitch-outline-variant/30';
      default: return 'bg-stitch-surface-low text-stitch-on-surface-variant border-stitch-outline-variant/20';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stitch-primary tracking-tight font-headline uppercase leading-none italic">Financial <span className="text-stitch-secondary">Center</span></h2>
          <p className="text-stitch-on-surface-variant max-w-md text-xs font-medium">
            Manage your industrial billing, track outstanding payments, and generate compliance-ready tax invoices.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden group relative">
             {/* Redundant search removed - using Navbar search */}
          </div>
          {user.role === 'Vendor' && (
            <button 
              onClick={onUpload}
              className="bg-stitch-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg shadow-stitch-primary/10 text-xs uppercase tracking-widest font-headline"
            >
              <FilePlus size={18} />
              Create New Invoice
            </button>
          )}
          <button 
            onClick={handleSync}
            className={`p-3 rounded-xl bg-white border border-stitch-outline-variant/30 text-stitch-on-surface-variant hover:text-stitch-secondary transition-all ${isSyncing ? 'animate-spin' : ''}`}
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-stitch-surface-lowest p-6 rounded-xl border border-stitch-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-red-50 text-stitch-error rounded-lg">
              <Wallet size={24} />
            </div>
            <span className="text-[10px] font-bold text-stitch-error bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-widest">+12% vs last month</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-[0.2em] italic">Total Outstanding</p>
            <h3 className="text-3xl font-extra-black text-stitch-primary mt-1 font-headline italic tracking-tighter">₹{stats.outstanding.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-stitch-surface-lowest p-6 rounded-xl border border-stitch-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-stitch-secondary-container text-stitch-on-secondary-container rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-[10px] font-bold text-stitch-secondary bg-stitch-secondary-container/30 px-2.5 py-1 rounded-full uppercase tracking-widest">Target met</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-[0.2em] italic">Paid Invoices</p>
            <h3 className="text-3xl font-extra-black text-stitch-primary mt-1 font-headline italic tracking-tighter">{stats.paidCount}</h3>
          </div>
        </div>

        <div className="bg-stitch-surface-lowest p-6 rounded-xl border border-stitch-outline-variant/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-stitch-primary rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-[0.2em] italic">Pending Review</p>
            <h3 className="text-3xl font-extra-black text-stitch-primary mt-1 font-headline italic tracking-tighter">{stats.pendingCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-stitch-surface-low p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4 border border-stitch-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-stitch-on-surface-variant uppercase ml-2 tracking-widest">Filters:</span>
        </div>
        <select 
          className="bg-stitch-surface-lowest border-none text-[10px] rounded-lg px-4 py-2 focus:ring-1 ring-stitch-secondary w-40 font-bold text-stitch-on-surface uppercase tracking-wider cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Status: All</option>
          <option value="Paid">Status: Paid</option>
          <option value="Uploaded">Status: Pending</option>
          <option value="Rejected">Status: Overdue</option>
        </select>
        <select className="bg-stitch-surface-lowest border-none text-[10px] rounded-lg px-4 py-2 focus:ring-1 ring-stitch-secondary w-48 font-bold text-stitch-on-surface uppercase tracking-wider cursor-pointer">
          <option>Date Range: Last 30 Days</option>
          <option>Last Quarter</option>
          <option>Fiscal Year 2024</option>
        </select>
        <select className="bg-stitch-surface-lowest border-none text-[10px] rounded-lg px-4 py-2 focus:ring-1 ring-stitch-secondary w-44 font-bold text-stitch-on-surface uppercase tracking-wider cursor-pointer">
          <option>Project Type: All</option>
          <option>Residential Solar</option>
          <option>Commercial Grid</option>
          <option>Industrial Plant</option>
        </select>

        <button 
          onClick={() => { setStatusFilter('All'); }}
          className="ml-auto text-[10px] font-bold text-stitch-primary hover:underline flex items-center gap-1 uppercase tracking-widest"
        >
          <RotateCw size={14} />
          Reset Filters
        </button>
      </div>

      <div className="bg-stitch-surface-lowest rounded-2xl overflow-hidden border border-stitch-outline-variant/20 shadow-sm relative z-10">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-stitch-surface-low/50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">Invoice ID</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">Project Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stitch-surface-low font-headline">
            {filteredInvoices.map((i) => (
              <tr key={i._id} className="hover:bg-stitch-surface-low transition-colors group cursor-pointer" onClick={() => onDetail(i)}>
                <td className="px-6 py-5 font-bold text-stitch-primary text-[11px] uppercase tracking-wider">#{i.invoiceNumber.slice(-8)}</td>
                <td className="px-6 py-5">
                  <p className="font-bold text-stitch-on-surface text-sm tracking-tight">{i.projectId?.consumerInfo?.name || 'Unknown Project'}</p>
                  <p className="text-[9px] text-stitch-on-surface-variant uppercase tracking-[0.2em] mt-0.5 opacity-60">Ref: {i.invoiceNumber}</p>
                </td>
                <td className="px-6 py-5 text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">{new Date(i.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-5 font-extra-black text-stitch-primary text-sm italic tracking-tighter">₹{i.amount.toLocaleString()}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${getStatusStyle(i.status)}`}>
                    {i.status === 'Uploaded' ? 'Awaiting' : i.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-stitch-surface-low rounded-lg text-stitch-primary transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="6" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-30">
                    <Search size={48} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] italic">No matching protocols detected</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
        
        <div className="px-6 py-4 bg-stitch-surface-low flex justify-between items-center border-t border-stitch-outline-variant/10">
          <p className="text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-widest">
            Showing {filteredInvoices.length} of {invoices.length} results
          </p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-stitch-outline-variant/30 hover:bg-stitch-surface-lowest transition-colors opacity-30 cursor-not-allowed">
              <ChevronDown size={18} className="rotate-90" />
            </button>
            <button className="px-3.5 py-1 rounded-lg bg-stitch-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-stitch-primary/10">1</button>
            <button className="p-2 rounded-lg border border-stitch-outline-variant/30 hover:bg-stitch-surface-lowest transition-colors opacity-30 cursor-not-allowed">
              <ChevronDown size={18} className="-rotate-90" />
            </button>
          </div>

        </div>
      </div>
      
      <div className="flex items-center justify-center pt-16 mt-10 border-t border-stitch-outline-variant/10 opacity-30">
        <p className="text-[10px] font-bold text-stitch-on-surface-variant uppercase tracking-[0.8em] italic">End of Financial Retrieval Session — Industrial Protocol Secured</p>
      </div>
    </div>
  );
}
