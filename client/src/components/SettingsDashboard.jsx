import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  BellRing, 
  Database,
  Save,
  Key,
  RefreshCw,
  Users,
  UserPlus,
  XCircle,
  Trash2
} from 'lucide-react';

export default function SettingsDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('security');
  
  // Mock settings state for UI demonstration
  const [settings, setSettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: '30',
    emailAlerts: true,
    smsAlerts: false,
    systemMaintenanceMode: false,
    defaultTaxRate: '18',
  });

  const [managers, setManagers] = useState([]);
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [newManagerData, setNewManagerData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data } = await api.get('/admin/managers');
      if (data.success) {
        setManagers(data.managers);
      }
    } catch (err) {
      console.error('Failed to fetch managers:', err);
    }
  };

  const handleManagerPermissionToggle = async (managerId, permKey) => {
    const managerToUpdate = managers.find(m => m._id === managerId);
    if (!managerToUpdate) return;
    
    // Safely fallback if managerPermissions is undefined
    const currentPerms = managerToUpdate.managerPermissions || {};
    const currentStatus = currentPerms[permKey] || false;
    
    // Optimistic UI update
    setManagers(managers.map(m => m._id === managerId ? { ...m, managerPermissions: { ...currentPerms, [permKey]: !currentStatus } } : m));

    try {
       await api.patch(`/admin/managers/${managerId}/permissions`, 
         { permissions: { [permKey]: !currentStatus } }
       );
    } catch (err) {
       console.error('Failed to update permission:', err);
       // Revert UI on failure
       setManagers(managers.map(m => m._id === managerId ? { ...m, managerPermissions: { ...currentPerms, [permKey]: currentStatus } } : m));
    }
  };

  const handleAddManager = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
       const { data } = await api.post('/admin/managers', newManagerData);
       if(data.success) {
         setManagers([...managers, data.manager]);
         setIsAddManagerModalOpen(false);
         setNewManagerData({ name: '', email: '', password: '' });
       }
    } catch(err) {
       console.error('Failed to add manager:', err);
       alert(err.response?.data?.message || 'Error adding manager');
    } finally {
       setLoading(false);
    }
  };

  const handleDeleteManager = async (managerId) => {
    if(!window.confirm('Are you sure you want to completely revoke access for this manager?')) return;
    try {
       await api.delete(`/admin/managers/${managerId}`);
       setManagers(managers.filter(m => m._id !== managerId));
    } catch(err) {
       console.error('Failed to delete manager:', err);
    }
  };

  const handleToggle = (key) => setSettings({ ...settings, [key]: !settings[key] });
  const handleChange = (e) => setSettings({ ...settings, [e.target.name]: e.target.value });

  return (
    <div className="w-full flex">
      {/* Settings Navigation */}
      <div className="w-48 lg:w-56 border-r border-slate-100 min-h-[calc(100vh-5rem)] p-5 lg:p-6 flex-shrink-0">
        <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-6">Configuration</h3>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-spp-navy text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ShieldCheck size={18} className="flex-shrink-0" />
            <span className="text-sm font-bold whitespace-nowrap">Security</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'preferences' ? 'bg-spp-navy text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BellRing size={18} className="flex-shrink-0" />
            <span className="text-sm font-bold whitespace-nowrap">Notifications</span>
          </button>
          
          {user?.role === 'Admin' && (
            <>
              <button 
                onClick={() => setActiveTab('platform')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'platform' ? 'bg-spp-navy text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <SettingsIcon size={18} className="flex-shrink-0" />
                <span className="text-sm font-bold whitespace-nowrap">Platform</span>
              </button>

              <button 
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'team' ? 'bg-spp-navy text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Users size={18} className="flex-shrink-0" />
                <span className="text-sm font-bold whitespace-nowrap">Team Access</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('system')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'system' ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Database size={18} className="flex-shrink-0" />
                <span className="text-sm font-bold whitespace-nowrap">System</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 min-w-0 p-6 lg:p-10 max-w-[1600px] overflow-hidden">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-start lg:items-end gap-6 mb-10 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-spp-navy tracking-tight">{
              activeTab === 'security' ? 'Security & Access' :
              activeTab === 'preferences' ? 'Notification Directives' :
              activeTab === 'platform' ? 'Platform Parameters' :
              activeTab === 'team' ? 'Access & Team Control' :
              'System Operations'
            }</h2>
            <p className="text-sm text-slate-500 mt-1">Manage infrastructure configurations and preferences.</p>
          </div>
          <button className="bg-spp-green text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* Dynamic Forms */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-spp-navy flex items-center gap-2 mb-6"><Key size={18} className="text-slate-400" /> Multi-Factor Authentication</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Require 2FA for this account</p>
                  <p className="text-xs text-slate-400 mt-1">Adds an additional layer of security during sign-in.</p>
                </div>
                <button 
                  onClick={() => handleToggle('twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-spp-green' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold text-spp-navy mb-6">Session Management</h4>
               <div className="max-w-xs">
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Idle Timeout (Minutes)</label>
                 <select 
                   name="sessionTimeout" 
                   value={settings.sessionTimeout} 
                   onChange={handleChange}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-spp-navy focus:border-spp-green outline-none"
                 >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="120">2 Hours</option>
                 </select>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold text-spp-navy mb-6">Broadcast Channels</h4>
               
               <div className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-slate-600 font-medium">Email Alerts</p>
                     <p className="text-xs text-slate-400 mt-1">Receive system clearances and updates via registered email.</p>
                   </div>
                   <button 
                     onClick={() => handleToggle('emailAlerts')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailAlerts ? 'bg-spp-green' : 'bg-slate-200'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                 </div>

                 <div className="h-px w-full bg-slate-100"></div>

                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm text-slate-600 font-medium">SMS Verification</p>
                     <p className="text-xs text-slate-400 mt-1">Receive urgent security notifications via mobile device.</p>
                   </div>
                   <button 
                     onClick={() => handleToggle('smsAlerts')}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.smsAlerts ? 'bg-spp-green' : 'bg-slate-200'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.smsAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'platform' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
               <h4 className="text-sm font-bold text-spp-navy mb-6">Financial Configuration</h4>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Default Input GST (%)</label>
                   <input 
                     type="number" 
                     name="defaultTaxRate" 
                     value={settings.defaultTaxRate} 
                     onChange={handleChange}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-spp-navy focus:border-spp-green outline-none"
                   />
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
              <h4 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">Critical Infrastructure</h4>
              <p className="text-xs text-red-600/80 mb-6">These operations affect the entire network. Proceed with caution.</p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Maintenance Mode</p>
                      <p className="text-xs text-slate-500 mt-1">Suspend vendor access during database synchronization.</p>
                    </div>
                    <button 
                      onClick={() => handleToggle('systemMaintenanceMode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.systemMaintenanceMode ? 'bg-red-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.systemMaintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                    <div>
                      <p className="text-sm font-bold text-slate-700">Refresh Service Caches</p>
                      <p className="text-xs text-slate-500 mt-1">Force a re-sync of global project trackers and invoices.</p>
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                       <RefreshCw size={14} /> Re-Sync
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-bold text-spp-navy flex items-center gap-2"><ShieldCheck size={18} className="text-spp-green" /> Delegated Management</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">Assign admin capabilities to up to 5 team members. Core functions remain restricted.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                  <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 whitespace-nowrap">
                    <span className="text-xs font-black tracking-widest text-slate-500 uppercase">{managers.length} / 5 Slots</span>
                  </div>
                  <button 
                    disabled={managers.length >= 5}
                    onClick={() => setIsAddManagerModalOpen(true)}
                    className={`flex items-center gap-2 px-4 py-2 flex-shrink-0 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${managers.length >= 5 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-spp-navy text-white hover:bg-spp-navy/90 shadow-md'}`}
                  >
                    <UserPlus size={14} /> Add Manager
                  </button>
                </div>
              </div>

              <div className="space-y-6 mt-8">
                {managers.map(manager => {
                  const perms = manager.managerPermissions || {};
                  return (
                  <div key={manager._id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all bg-white w-full">
                    
                    {/* Header: User Info & Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <h5 className="text-lg font-black text-spp-navy tracking-tight">{manager.name}</h5>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-spp-navy/5 text-spp-navy uppercase tracking-widest border border-spp-navy/10">Manager</span>
                        </div>
                        <span className="text-sm text-slate-500 font-medium mt-0.5">{manager.email}</span>
                      </div>
                      
                      <button onClick={() => handleDeleteManager(manager._id)} className="text-red-600 bg-red-50 hover:bg-red-500 hover:text-white transition-all px-4 py-2 border border-red-100 hover:border-red-500 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-sm whitespace-nowrap" title="Revoke Manager Access">
                        <Trash2 size={16} /> Revoke Access
                      </button>
                    </div>

                    {/* Body: Permissions Grid */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Functional Privileges</p>
                      
                      <div className="flex flex-wrap gap-4">
                        {/* Project Permission */}
                        <div className="flex items-center justify-between gap-6 bg-white px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors min-w-[150px] flex-1 sm:flex-none">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Projects</span>
                          <button onClick={() => handleManagerPermissionToggle(manager._id, 'projects')} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${perms.projects ? 'bg-spp-green' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${perms.projects ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        {/* Approvals Permission */}
                        <div className="flex items-center justify-between gap-6 bg-white px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors min-w-[150px] flex-1 sm:flex-none">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Approvals</span>
                          <button onClick={() => handleManagerPermissionToggle(manager._id, 'approvals')} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${perms.approvals ? 'bg-spp-green' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${perms.approvals ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        {/* Analytics Permission */}
                        <div className="flex items-center justify-between gap-6 bg-white px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors min-w-[150px] flex-1 sm:flex-none">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Analytics</span>
                          <button onClick={() => handleManagerPermissionToggle(manager._id, 'analytics')} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${perms.analytics ? 'bg-spp-green' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${perms.analytics ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        {/* Finance Permission */}
                        <div className="flex items-center justify-between gap-6 bg-white px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors min-w-[150px] flex-1 sm:flex-none">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Finance</span>
                          <button onClick={() => handleManagerPermissionToggle(manager._id, 'finance')} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${perms.finance ? 'bg-spp-green' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${perms.finance ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>

                        {/* Settings Permission */}
                        <div className="flex items-center justify-between gap-6 bg-white px-4 py-3.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors min-w-[150px] flex-1 sm:flex-none">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Settings</span>
                          <button onClick={() => handleManagerPermissionToggle(manager._id, 'settings')} className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${perms.settings ? 'bg-spp-green' : 'bg-slate-200'}`}>
                            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${perms.settings ? 'translate-x-5' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )})}

                {managers.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm font-medium border-2 border-dashed border-slate-100 rounded-xl">
                    No delegates assigned. You are the sole administrator.
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <ShieldCheck size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong>System Note:</strong> Managers cannot process financial settlements, alter platform parameters, or trigger system maintenance. These functions are permanently restricted to Super Administrators.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* Add Manager Modal */}
      {isAddManagerModalOpen && (
        <div className="fixed inset-0 bg-spp-navy/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAddManagerModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-spp-navy/5 flex items-center justify-center">
                <UserPlus size={20} className="text-spp-navy" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-spp-navy tracking-tight">Onboard Manager</h3>
                 <p className="text-xs text-slate-400 font-medium mt-0.5">Generate a new delegation profile</p>
              </div>
            </div>
            
            <form onSubmit={handleAddManager} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={newManagerData.name}
                  onChange={(e) => setNewManagerData({...newManagerData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-spp-navy focus:border-spp-green outline-none"
                  placeholder="e.g. Aditi Rao"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
                <input 
                  type="email" 
                  required 
                  value={newManagerData.email}
                  onChange={(e) => setNewManagerData({...newManagerData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-spp-navy focus:border-spp-green outline-none"
                   placeholder="swastikpowerpro369@gmail.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initial Password</label>
                <input 
                  type="password" 
                  required 
                  value={newManagerData.password}
                  onChange={(e) => setNewManagerData({...newManagerData, password: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-spp-navy focus:border-spp-green outline-none"
                   placeholder="••••••••"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                   type="button" 
                   onClick={() => setIsAddManagerModalOpen(false)}
                   className="flex-1 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                   Cancel
                </button>
                <button 
                   type="submit" 
                   disabled={loading}
                   className="flex-1 py-3 bg-spp-navy text-white rounded-xl text-sm font-bold shadow-md hover:bg-spp-navy/90 hover:shadow-lg transition-all disabled:opacity-50"
                >
                   {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
