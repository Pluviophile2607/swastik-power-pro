import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  Bell, 
  MapPin,
  Zap,
  Layers,
  Search,
  User,
  Users,
  CheckCircle,
  Wallet,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Specialized Modules
import SolarInstallationForm from './SolarInstallationForm';
import ProjectTimeline from './ProjectTimeline';
import AnalyticsDashboard from './AnalyticsDashboard';
import SettingsDashboard from './SettingsDashboard';

// Modularized Finance Components
import InvoicesDashboard from './Finance/InvoicesDashboard';
import FinancePortal from './Finance/FinancePortal';
import UploadInvoiceModal from './Finance/UploadInvoiceModal';
import InvoiceDetailModal from './Finance/InvoiceDetailModal';

// Modularized Dashboard Components
import { 
  NavItem, 
  OverviewTab, 
  ProjectsList, 
  AdminApprovals, 
  AdminVendorDirectory, 
  AdminProjectOverview,
  ProjectDetailModal,
  NotificationsTab,
  NotificationsPanel,
  CommunicationCenter,
  NotificationDetailModal,
  InquiriesTab
} from './DashboardComponents';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [myInvoices, setMyInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [globalResults, setGlobalResults] = useState({ projects: [], vendors: [], invoices: [] });
  const [inquiries, setInquiries] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Derived state with safe guards
  const isAdmin = user ? (user.role === 'Admin') : false;
  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  const dashboardStats = {
    activeSites: (projects || []).filter(p => p.statusTimeline?.currentStage && p.statusTimeline.currentStage !== 'Completed').length,
    efficiency: (projects || []).length > 0 ? Math.round(((projects || []).filter(p => p.statusTimeline?.currentStage === 'Completed').length / projects.length) * 100) : 98,
    clearanceRate: (myInvoices || []).length > 0 ? Math.round(((myInvoices || []).filter(i => i.status === 'Paid').length / myInvoices.length) * 100) : 100,
    totalMWh: (projects || []).reduce((sum, p) => sum + (parseFloat(p.energyProfile?.desiredCapacity) || 0), 0).toFixed(1)
  };

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(fetchNotifications, 60000); // Polling every 60s
    return () => clearInterval(interval);
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      fetchNotifications();
      if (res.data.user.role === 'Vendor') {
        fetchProjects();
        fetchMyInvoices();
      }
      if (res.data.user.role === 'Admin') {
        fetchPendingVendors();
        fetchAllVendors();
        fetchAllProjects();
        fetchPendingInvoices('Uploaded');
        fetchInquiries();
      }
      if (res.data.user.role === 'Manager') {
        fetchPendingVendors();
        fetchAllProjects();
      }
      if (res.data.user.role === 'Finance') fetchPendingInvoices('Uploaded');
    } catch (err) {
      window.location.href = '/login';
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to sync notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {});
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch(`/notifications/read-all`, {});
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/my-projects');
      setProjects(res.data.projects || []);
    } catch (err) { console.error('fetchProjects error', err); }
  };

  const fetchMyInvoices = async () => {
    try {
      const res = await api.get('/invoice/my-invoices');
      setMyInvoices(res.data.invoices || []);
    } catch (err) { console.error('fetchMyInvoices error', err); }
  };

  const fetchPendingVendors = async () => {
    try {
      const res = await api.get('/admin/pending-vendors');
      setPendingVendors(res.data.vendors || []);
    } catch (err) { console.error('fetchPendingVendors error', err); }
  };

  const fetchAllVendors = async () => {
    try {
      const res = await api.get('/admin/all-vendors');
      setAllVendors(res.data.vendors || []);
    } catch (err) { console.error('fetchAllVendors error', err); }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await api.get('/admin/all-projects');
      setAllProjects(res.data.projects || []);
    } catch (err) { console.error('fetchAllProjects error', err); }
  };

  const fetchPendingInvoices = async (status = 'Uploaded,Approved,Paid,Rejected') => {
    try {
      const res = await api.get(`/invoice/pending-invoices?status=${status}`);
      setInvoices(res.data.invoices || []);
    } catch (err) { console.error('fetchPendingInvoices error', err); }
  };

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      setInquiries(res.data.inquiries || []);
    } catch (err) { console.error('fetchInquiries error', err); }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const lowerQuery = searchQuery.toLowerCase();
      
      const filteredProjects = (isAdmin ? allProjects : projects).filter(p => 
        (p.consumerInfo?.name || '').toLowerCase().includes(lowerQuery) ||
        (p._id || '').toLowerCase().includes(lowerQuery) ||
        (p.propertyDetails?.city || '').toLowerCase().includes(lowerQuery)
      );

      const filteredVendors = isAdmin ? allVendors.filter(v => 
        (v.name || '').toLowerCase().includes(lowerQuery) ||
        (v.vendorProfile?.companyName || '').toLowerCase().includes(lowerQuery) ||
        (v.email || '').toLowerCase().includes(lowerQuery)
      ) : [];

      const filteredInvoices = (isAdmin || user.role === 'Finance' ? invoices : myInvoices).filter(inv => 
        (inv.invoiceNumber || '').toLowerCase().includes(lowerQuery) ||
        (inv.projectId?.consumerInfo?.name || '').toLowerCase().includes(lowerQuery)
      );

      setGlobalResults({
        projects: filteredProjects.slice(0, 5),
        vendors: filteredVendors.slice(0, 5),
        invoices: filteredInvoices.slice(0, 5)
      });
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery, projects, allProjects, allVendors, invoices, myInvoices]);

  const handleResultClick = (type, item) => {
    setSearchQuery('');
    setShowSearchResults(false);
    
    if (type === 'project') {
      setSelectedProject(item);
      if (isAdmin) {
        setActiveTab('all-projects');
        setShowProjectModal(true);
      } else {
        setActiveTab('projects');
      }
    } else if (type === 'vendor') {
      setActiveTab('all-vendors');
    } else if (type === 'invoice') {
      setSelectedInvoice(item);
      setShowDetailModal(true);
      if (isAdmin || user.role === 'Finance') {
        setActiveTab('payments');
      } else {
        setActiveTab('invoices');
      }
    }
  };

  const handleInvoiceAction = async (id, status) => {
    try {
      await api.put(`/invoice/review/${id}`, { status });
      fetchPendingInvoices();
    } catch (err) { console.error('handleInvoiceAction error', err); }
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
      <div className="w-16 h-16 border-4 border-spp-navy/10 border-t-spp-green rounded-full animate-spin"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/40 animate-pulse">Synchronizing Terminal</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50 font-sans">
      {/* Premium Glass Sidebar */}
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 bg-white border-r border-slate-100 flex-col z-30 fixed left-0 top-0 bottom-0 overflow-hidden">
        {/* Top Header Section */}
        <div className="p-8 flex-shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer">
             <img src="https://cdn.designfast.io/image/2026-04-13/480a1bd7-afbd-467c-9b31-3c3672fca814.png" alt="Company Logo" className="h-10 w-auto object-contain" />
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <nav 
          className="flex-grow overflow-y-auto px-6 space-y-1 mb-4 custom-scrollbar" 
          data-lenis-prevent
          style={{ overscrollBehavior: 'contain' }}
        >
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          
          {user.role === 'Vendor' && (
            <>
              <NavItem active={activeTab === 'new-project'} onClick={() => setActiveTab('new-project')} icon={<FilePlus size={18}/>} label="Submit Request" />
              <NavItem active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<MapPin size={18}/>} label="Project Tracker" />
              <NavItem active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} icon={<FileText size={18}/>} label="Invoices" />
            </>
          )}

          {(isAdmin || user.role === 'Finance' || user.role === 'Manager') && (
            <>
              {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.projects)) && (
                <>
                  <NavItem active={activeTab === 'all-projects'} onClick={() => setActiveTab('all-projects')} icon={<MapPin size={18}/>} label="Global Projects" />
                  <NavItem active={activeTab === 'all-vendors'} onClick={() => setActiveTab('all-vendors')} icon={<Users size={18}/>} label="Partner Directory" />
                </>
              )}
              
              {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.approvals)) && (
                  <NavItem active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} icon={<CheckCircle size={18}/>} label="Clearance Control" />
              )}

              {(isAdmin || user.role === 'Finance' || (user.role === 'Manager' && user.managerPermissions?.finance)) && (
                  <NavItem active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} icon={<Wallet size={18}/>} label={isAdmin ? "Settlement Portal" : "Settlement Queue"} />
              )}

              {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.analytics)) && (
                <>
                  <NavItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<LayoutDashboard size={18}/>} label="Analytics" />
                </>
              )}
              
              {isAdmin && (
                <>
                  <NavItem active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} icon={<Bell size={18}/>} label="Directives" />
                  <NavItem active={activeTab === 'inquiries'} onClick={() => setActiveTab('inquiries')} icon={<Search size={18}/>} label="Market Inquiries" />
                </>
              )}
            </>
          )}

          <NavItem active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<Bell size={18}/>} label={`Notifications (${unreadCount})`} />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Layers size={18}/>} label="Settings" />
        </nav>

        {/* Bottom Footer Section */}
        <div className="p-8 pt-0 flex-shrink-0 space-y-4 border-t border-slate-50 mt-auto bg-white">
           <button 
             onClick={() => setActiveTab('new-project')}
             className="w-full bg-spp-navy text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-spp-navy/90 transition-all shadow-lg mt-6"
           >
             <span className="text-lg leading-none">+</span> New Project
           </button>

           <div className="space-y-1">
              <NavItem active={activeTab === 'logout'} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} icon={<LogOut size={18}/>} label="Logout" />
           </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-spp-navy/40 backdrop-blur-sm z-[100]"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-[101] flex flex-col shadow-2xl border-r border-slate-100"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <img src="https://cdn.designfast.io/image/2026-04-13/480a1bd7-afbd-467c-9b31-3c3672fca814.png" alt="Company Logo" className="h-10 w-auto object-contain" />
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-spp-navy bg-slate-50 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-grow overflow-y-auto px-6 py-8 space-y-1 custom-scrollbar">
                <NavItem active={activeTab === 'overview'} onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
                
                {user.role === 'Vendor' && (
                  <>
                    <NavItem active={activeTab === 'new-project'} onClick={() => { setActiveTab('new-project'); setIsSidebarOpen(false); }} icon={<FilePlus size={18}/>} label="Submit Request" />
                    <NavItem active={activeTab === 'projects'} onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }} icon={<MapPin size={18}/>} label="Project Tracker" />
                    <NavItem active={activeTab === 'invoices'} onClick={() => { setActiveTab('invoices'); setIsSidebarOpen(false); }} icon={<FileText size={18}/>} label="Invoices" />
                  </>
                )}

                {(isAdmin || user.role === 'Finance' || user.role === 'Manager') && (
                  <>
                    {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.projects)) && (
                      <>
                        <NavItem active={activeTab === 'all-projects'} onClick={() => { setActiveTab('all-projects'); setIsSidebarOpen(false); }} icon={<MapPin size={18}/>} label="Global Projects" />
                        <NavItem active={activeTab === 'all-vendors'} onClick={() => { setActiveTab('all-vendors'); setIsSidebarOpen(false); }} icon={<Users size={18}/>} label="Partner Directory" />
                      </>
                    )}
                    
                    {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.approvals)) && (
                        <NavItem active={activeTab === 'approvals'} onClick={() => { setActiveTab('approvals'); setIsSidebarOpen(false); }} icon={<CheckCircle size={18}/>} label="Clearance Control" />
                    )}

                    {(isAdmin || user.role === 'Finance' || (user.role === 'Manager' && user.managerPermissions?.finance)) && (
                        <NavItem active={activeTab === 'payments'} onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} icon={<Wallet size={18}/>} label={isAdmin ? "Settlement Portal" : "Settlement Queue"} />
                    )}

                    {(isAdmin || (user.role === 'Manager' && user.managerPermissions?.analytics)) && (
                      <>
                        <NavItem active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} icon={<LayoutDashboard size={18}/>} label="Analytics" />
                      </>
                    )}
                    
                    {isAdmin && (
                      <>
                        <NavItem active={activeTab === 'broadcast'} onClick={() => { setActiveTab('broadcast'); setIsSidebarOpen(false); }} icon={<Bell size={18}/>} label="Directives" />
                        <NavItem active={activeTab === 'inquiries'} onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }} icon={<Search size={18}/>} label="Market Inquiries" />
                      </>
                    )}
                  </>
                )}

                <NavItem active={activeTab === 'notifications'} onClick={() => { setActiveTab('notifications'); setIsSidebarOpen(false); }} icon={<Bell size={18}/>} label={`Notifications (${unreadCount})`} />
                <NavItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} icon={<Layers size={18}/>} label="Settings" />
              </nav>

              <div className="p-8 border-t border-slate-50 bg-white">
                <button 
                  onClick={() => { setActiveTab('new-project'); setIsSidebarOpen(false); }}
                  className="w-full bg-spp-navy text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg"
                >
                  <span className="text-lg leading-none">+</span> New Project
                </button>
                <div className="mt-4">
                  <NavItem active={activeTab === 'logout'} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} icon={<LogOut size={18}/>} label="Logout" />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for Fixed Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Modern Corporate Header */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-lg border-b border-slate-100 flex items-center justify-between px-4 md:px-8 lg:px-12 z-20 sticky top-0">
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-spp-navy hover:bg-slate-50 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-base lg:text-xl font-bold text-spp-navy tracking-tight truncate max-w-[150px] sm:max-w-none">
              {activeTab === 'overview' ? (isAdmin ? 'Admin Dashboard' : 'Vendor Dashboard') : 
               activeTab === 'new-project' ? 'New Solar Request' : 
               activeTab === 'projects' ? (selectedProject ? 'Project Details' : 'Project Tracker') :
               activeTab === 'invoices' ? 'Financial Center' :
               activeTab === 'analytics' ? 'System Analytics' :
               activeTab === 'all-projects' ? 'Global Projects' : 
               activeTab === 'all-vendors' ? 'Partner Directory' :
               activeTab === 'payments' ? 'Settlement Portal' :
               activeTab === 'approvals' ? 'Clearance Control' :
               activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>

          <div className="hidden md:block flex-grow max-w-xl px-12">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-spp-green transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Terminal Search (Ctrl + K)" 
                 className="w-full bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white rounded-xl py-3 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => {
                    if (e.key === 'Escape') { setShowSearchResults(false); setSearchQuery(''); }
                 }}
               />
               
               {/* Search Results Dropdown Overlay */}
               <AnimatePresence>
                 {showSearchResults && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.98 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.98 }}
                     className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.15)] border border-slate-100/60 backdrop-blur-3xl overflow-hidden z-50 p-6 space-y-8"
                   >
                     {globalResults.projects.length === 0 && globalResults.vendors.length === 0 && globalResults.invoices.length === 0 ? (
                       <div className="py-12 text-center space-y-4">
                          <Search size={40} className="mx-auto text-slate-200" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">No Synchronization Found</p>
                       </div>
                     ) : (
                       <>
                         {globalResults.projects.length > 0 && (
                            <div className="space-y-4">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic px-4">Active Projects</p>
                               <div className="grid grid-cols-1 gap-2">
                                  {globalResults.projects.map(p => (
                                    <button 
                                      key={p._id}
                                      onClick={() => handleResultClick('project', p)}
                                      className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 flex items-center justify-between group transition-all"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-spp-navy/5 flex items-center justify-center text-spp-navy group-hover:bg-spp-navy group-hover:text-white transition-all">
                                             <Zap size={18} />
                                          </div>
                                          <div>
                                             <p className="text-sm font-bold text-spp-navy">{p.consumerInfo?.name}</p>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{p.propertyDetails?.city} • {p.statusTimeline?.currentStage}</p>
                                          </div>
                                       </div>
                                       <ChevronRight size={16} className="text-slate-200 group-hover:text-spp-green group-hover:translate-x-1 transition-all" />
                                    </button>
                                  ))}
                               </div>
                            </div>
                         )}

                         {globalResults.vendors.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic px-4">Verified Partners</p>
                               <div className="grid grid-cols-1 gap-2">
                                  {globalResults.vendors.map(v => (
                                    <button 
                                      key={v._id}
                                      onClick={() => handleResultClick('vendor', v)}
                                      className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 flex items-center justify-between group transition-all"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-spp-green/5 flex items-center justify-center text-spp-green group-hover:bg-spp-green group-hover:text-white transition-all">
                                             <Users size={18} />
                                          </div>
                                          <div>
                                             <p className="text-sm font-bold text-spp-navy">{v.vendorProfile?.companyName || v.name}</p>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{v.vendorProfile?.registrationLicenseId || 'Alpha Sync'}</p>
                                          </div>
                                       </div>
                                       <ChevronRight size={16} className="text-slate-200 group-hover:text-spp-green group-hover:translate-x-1 transition-all" />
                                    </button>
                                  ))}
                               </div>
                            </div>
                         )}

                         {globalResults.invoices.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic px-4">Financial Records</p>
                               <div className="grid grid-cols-1 gap-2">
                                  {globalResults.invoices.map(inv => (
                                    <button 
                                      key={inv._id}
                                      onClick={() => handleResultClick('invoice', inv)}
                                      className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 flex items-center justify-between group transition-all"
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                             <FileText size={18} />
                                          </div>
                                          <div>
                                             <p className="text-sm font-bold text-spp-navy italic">₹{inv.amount.toLocaleString()}</p>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Inv: {inv.invoiceNumber}</p>
                                          </div>
                                       </div>
                                       <ChevronRight size={16} className="text-slate-200 group-hover:text-spp-green group-hover:translate-x-1 transition-all" />
                                    </button>
                                  ))}
                               </div>
                            </div>
                         )}
                       </>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-spp-navy hover:bg-slate-50 transition-all relative group"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-spp-green border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <NotificationsPanel 
                    notifications={notifications} 
                    onMarkRead={markAsRead} 
                    onMarkAllRead={markAllAsRead} 
                    onDetail={(n) => { setSelectedNotification(n); setShowNotifications(false); }}
                    onClose={() => setShowNotifications(false)} 
                  />
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">License ID: {user.vendorProfile?.registrationLicenseId || 'SPP-2026-894'}</p>
                <p className="text-[10px] font-bold text-spp-navy uppercase tracking-widest mt-1">Verified Partner</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-spp-navy flex items-center justify-center text-white border-2 border-slate-50 overflow-hidden shadow-sm">
                 <User size={20} className="opacity-40" />
              </div>
            </div>

            <button 
               onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
               className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group flex items-center gap-3 active:scale-95"
               title="Professional Exit"
            >
               <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">Logout</span>
               <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="flex-grow">
          <div className="p-4 md:p-8 lg:p-16 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
            {activeTab !== 'overview' && (
              <button 
                onClick={() => {
                  if (activeTab === 'projects' && selectedProject) {
                    setSelectedProject(null);
                  } else {
                    setActiveTab('overview');
                  }
                }}
                className="mb-10 group flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-spp-navy hover:text-white hover:border-spp-navy transition-all duration-300 shadow-sm w-fit"
              >
                <ChevronRight size={16} className="rotate-180 transition-transform" />
                <div className="flex flex-col items-start translate-y-[-1px]">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">Return to</span>
                  <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">Dashboard Command</span>
                </div>
              </button>
            )}
            {activeTab === 'overview' && <OverviewTab user={user} projects={projects} searchQuery={searchQuery} pendingVendors={pendingVendors} invoices={invoices} allProjects={allProjects} allVendors={allVendors} stats={dashboardStats} />}
            {activeTab === 'new-project' && <SolarInstallationForm onComplete={() => { setActiveTab('projects'); fetchProjects(); }} />}
            {activeTab === 'all-projects' && <AdminProjectOverview projects={allProjects} searchQuery={searchQuery} onDetail={(p) => { setSelectedProject(p); setShowProjectModal(true); }} />}
            {activeTab === 'all-vendors' && <AdminVendorDirectory vendors={allVendors} searchQuery={searchQuery} />}
            {activeTab === 'projects' && (
              selectedProject ? (
                <ProjectTimeline 
                  project={selectedProject} 
                  onBack={() => setSelectedProject(null)} 
                  onRefresh={() => { fetchProjects(); setSelectedProject(projects.find(p => p._id === selectedProject._id)); }}
                />
              ) : (
                <ProjectsList projects={projects} searchQuery={searchQuery} onDetail={(p) => setSelectedProject(p)} />
              )
            )}
            {activeTab === 'payments' && <FinancePortal invoices={invoices} searchQuery={searchQuery} onReview={handleInvoiceAction} user={user} onDetail={(inv) => { setSelectedInvoice(inv); setShowDetailModal(true); }} onRefresh={() => fetchPendingInvoices('Uploaded')} />}
            {activeTab === 'invoices' && <InvoicesDashboard invoices={myInvoices} searchQuery={searchQuery} onUpload={() => setShowInvoiceModal(true)} onDetail={(inv) => { setSelectedInvoice(inv); setShowDetailModal(true); }} onRefresh={fetchMyInvoices} user={user} />}
            {activeTab === 'approvals' && <AdminApprovals vendors={pendingVendors} onApprove={fetchPendingVendors} />}
            {activeTab === 'analytics' && <AnalyticsDashboard projects={allProjects} vendors={allVendors} invoices={invoices} />}
            {activeTab === 'broadcast' && <CommunicationCenter />}
            {activeTab === 'inquiries' && <InquiriesTab inquiries={inquiries} onUpdate={fetchInquiries} />}
            {activeTab === 'notifications' && <NotificationsTab notifications={notifications} onMarkRead={markAsRead} onMarkAllRead={markAllAsRead} onDetail={(n) => setSelectedNotification(n)} />}
            {activeTab === 'settings' && <SettingsDashboard user={user} />}

            {/* Modals integrated from separate modules */}
            {showInvoiceModal && (
              <UploadInvoiceModal 
                projects={projects} 
                onClose={() => setShowInvoiceModal(false)} 
                onSuccess={() => { setShowInvoiceModal(false); fetchMyInvoices(); }} 
              />
            )}

            {selectedInvoice && showDetailModal && (
              <InvoiceDetailModal 
                invoice={selectedInvoice} 
                onClose={() => { setShowDetailModal(false); setSelectedInvoice(null); }} 
                onReview={handleInvoiceAction}
                user={user}
              />
            )}

            {selectedNotification && (
              <NotificationDetailModal 
                 notification={selectedNotification} 
                 onClose={() => setSelectedNotification(null)} 
                 onMarkRead={markAsRead}
              />
            )}

            {showProjectModal && selectedProject && (
              <ProjectDetailModal 
                project={selectedProject} 
                user={user}
                onClose={() => setShowProjectModal(false)} 
                onUpdate={() => { fetchAllProjects(); fetchProjects(); }}
              />
            )}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-20 px-4 md:px-12 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-center md:text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              <span>© 2026 Swastik Power Pro. All Rights Reserved. Govt. Authorized Solar Vendor.</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
              <Link to="/privacy" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-all">Privacy Policy</Link>
              <Link to="/privacy" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-all">Terms of Service</Link>
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-all">Support</button>
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-spp-navy transition-all">API Docs</button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  </div>
);
}

export default Dashboard;
