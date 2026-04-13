import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from './services/api';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StickyCard002 } from './components/StickyCard002';

gsap.registerPlugin(ScrollTrigger);
import { 
  Menu, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  Mail, 
  Lock,
  MapPin, 
  Sun, 
  Wind, 
  Droplets, 
  Quote,
  Zap,
  Target,
  Compass,
  Star,
  Clock,
  ShieldCheck,
  Camera,
  Gauge,
  FileText,
  ClipboardCheck,
  Calendar,
  Hammer,
  BarChart,
  Settings,
  ChevronDown
} from 'lucide-react';

import VendorRegistration from './components/VendorRegistration';
import Dashboard from './components/Dashboard';
import ProtocolViewer from './components/ProtocolViewer';
import Solutions from './components/Solutions';
import { LegalDocs } from './components/LegalProtocol';
import ContactPage from './components/ContactPage';

/**
 * SWASTIK POWER PRO - CORE APPLICATION
 * Redesign: Modern Corporate / International Style
 */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname]);
  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <ScrollToTop />
      <AppContent 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        handleLogout={handleLogout} 
      />
    </Router>
  );
}

function MobileRestrictionOverlay() {
  return (
    <div className="md:hidden fixed inset-0 z-[9999] bg-spp-navy flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-neon-lime/10 rounded-3xl flex items-center justify-center mb-8 animate-pulse text-neon-lime">
        <Zap size={48} />
      </div>
      <h2 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Terminal Restricted</h2>
      <p className="text-white/60 font-medium leading-relaxed max-w-xs">
        System access is currently optimized for wide-screen terminal interfaces.
      </p>
      <div className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-neon-lime text-xs font-bold uppercase tracking-[0.2em]">
        Please Refer Desktop
      </div>
    </div>
  );
}

function AppContent({ isLoggedIn, setIsLoggedIn, isMenuOpen, setIsMenuOpen, handleLogout }) {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col selection:bg-neon-lime/30 font-sans">
      {/* MOBILE RESTRICTION OVERLAY DISABLED - System is now responsive */}

      {/* NAVIGATION - Hidden on Dashboard */}
      {!isDashboard && (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] md:w-max z-50 transition-all duration-300">
          <div className="bg-white/85 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl flex justify-between items-center px-4 h-12 md:h-14 gap-4 md:gap-8">
            <div className="flex items-center gap-1">
              <Link to="/" className="flex items-center no-underline group">
                <img src="https://cdn.designfast.io/image/2026-04-13/480a1bd7-afbd-467c-9b31-3c3672fca814.png" alt="Swastik Logo" className="h-10 md:h-12 w-auto object-contain" />
              </Link>
            </div>

            {/* NAVIGATION CLUSTER (Visible on Mobile) */}
            <div className="flex items-center gap-1">
              <nav className="flex items-center gap-0.5 font-bold tracking-tight text-[10px] md:text-[11px] uppercase">
                <Link to="/projects" className="px-2 md:px-3 py-2 rounded-xl text-spp-navy hover:bg-white/10 transition-all text-neon-lime">Projects</Link>
                <div className="hidden sm:block h-3 w-[1px] bg-slate-200 mx-1"></div>
                <Link to="/services" className="px-2 md:px-3 py-2 rounded-xl text-spp-navy hover:bg-white/10 transition-all">Services</Link>
              </nav>

              <div className="flex items-center gap-1 md:gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login" className="hidden xs:block text-spp-navy font-bold text-[10px] md:text-[11px] uppercase tracking-widest px-2 md:px-3 py-2 rounded-xl hover:bg-white/10 transition-all">Login</Link>
                    <Link to="/register" className="bg-neon-lime text-spp-navy px-3 md:px-5 py-2 md:py-2.5 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-xl shadow-neon-lime/20 whitespace-nowrap">
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-spp-navy font-bold text-[10px] md:text-[11px] uppercase tracking-widest px-2 md:px-3 py-2 rounded-xl hover:bg-white/10 transition-all">Dashboard</Link>
                    <button onClick={handleLogout} className="hidden xs:block bg-white/10 border border-spp-navy/10 text-spp-navy px-3 md:px-5 py-2 md:py-2.5 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-sm active:scale-95">
                        Logout
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <button className="hidden text-spp-navy p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* MOBILE OVERLAY */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-[calc(100%-48px)] bg-white/95 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-8 mt-4 flex flex-col gap-6 animate-in slide-in-from-top-10 duration-300 shadow-2xl z-[100]">
              <nav className="flex flex-col gap-6 text-[11px] font-black text-spp-navy uppercase tracking-widest">
                <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="hover:text-neon-lime text-neon-lime">Projects</Link>
                <Link to="/services" onClick={() => setIsMenuOpen(false)} className="hover:text-neon-lime">Services</Link>
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-neon-lime">Contact</a>
                {!isLoggedIn && <Link to="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-neon-lime">Login</Link>}
              </nav>
              <hr className="border-spp-navy/10" />
              <div className="flex flex-col gap-4">
                {!isLoggedIn ? (
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="bg-neon-lime text-spp-navy px-6 py-4 rounded-full font-black text-center text-[11px] uppercase tracking-widest shadow-xl shadow-neon-lime/20">Get Started</Link>
                ) : (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="bg-spp-navy text-white px-6 py-4 rounded-full font-black text-center text-[11px] uppercase tracking-widest">Dashboard</Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-red-500 text-white px-6 py-4 rounded-full font-black text-[11px] uppercase tracking-widest">Logout</button>
                  </>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/solutions" element={<Solutions isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<VendorRegistration />} />
          <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/protocol-viewer/:invoiceId" element={isLoggedIn ? <ProtocolViewer /> : <Navigate to="/login" />} />
          <Route path="/privacy" element={<LegalDocs />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/jal-jeevan-mission" element={<JalJeevanMission />} />
          <Route path="/green-energy-solar" element={<GreenEnergySolar />} />
          <Route path="/water-tanks" element={<WaterTanks />} />
          <Route path="/wind-power" element={<WindPower />} />
          <Route path="/initialize-connection/:serviceSlug" element={<InitializeConnectionPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<div className="pt-40 text-center text-spp-navy font-black uppercase tracking-widest bg-white min-h-screen">404: Terminal Interface Not Found</div>} />
        </Routes>
      </main>

      {/* FOOTER - Hidden on Dashboard, and we use the New Redesign Footer if on LandingPage */}
      {!isDashboard && <FooterRedesign />}
    </div>
  );
}

function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    type: 'Solar Installation',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries', formData);
      setStatus({ type: 'success', message: 'Inquiry transmitted successfully. Our engineers will synchronize shortly.' });
      setFormData({ name: '', email: '', mobile: '', type: 'Solar Installation', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Transmission interrupted. Please verify connection and retry.' });
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent">
      <HeroRedesign />
      <LogoMarquee />
      <QualityAssuranceSection />
      <JeevanMissionHighlight />
      <ProcessSteps />
      <ServicesHighlight />
      <LeadershipCouncil />
      <FooterCTA 
        formData={formData} 
        setFormData={setFormData} 
        handleSubmit={handleSubmit} 
        loading={loading} 
        status={status} 
      />
</div>
  );
}


// REDESIGN SUB-COMPONENTS

function HeroRedesign() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero.png" 
          className="w-full h-full object-cover grayscale-[0.2] opacity-80 brightness-100" 
          alt="Solar mountain" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-10 flex flex-col items-center text-center">
        <div className="relative w-full">
          <h1 className="text-[80px] md:text-[180px] lg:text-[240px] font-black text-spp-navy/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none tracking-tighter uppercase pointer-events-none select-none whitespace-nowrap">
            SOLAR POWER PRO
          </h1>
          <div className="relative space-y-10">
            <h2 className="text-5xl md:text-8xl font-black text-spp-navy leading-[1.05] tracking-tight">
              Next-Generation <br />
              Solar Energy <span className="italic">Solutions</span>
            </h2>
            <p className="text-lg md:text-xl text-spp-navy font-medium max-w-2xl mx-auto leading-relaxed">
              Swastik Power Pro is at the forefront of the renewable energy revolution, delivering high-performance infrastructure for a sustainable India.
            </p>
            <div className="flex items-center justify-center gap-6">
              <Link to="/solutions" className="bg-neon-lime text-spp-navy px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:brightness-105 transition-all shadow-2xl shadow-neon-lime/30 group">
                Explore solutions <div className="w-6 h-6 bg-spp-navy rounded-full flex items-center justify-center text-neon-lime group-hover:translate-x-1 transition-transform"><ArrowRight size={14} /></div>
              </Link>
            </div>
          </div>
        </div>

        {/* CORPORATE IDENTITY - MINIMALIST REDESIGN 3.0 */}
        <div className="mt-32 w-full max-w-6xl mx-auto pt-16">
           <div className="grid md:grid-cols-12 gap-16">
              {/* Commitment Column */}
              <div className="md:col-span-7 text-left space-y-10">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/30">Commitment Statement</span>
                    <h3 className="text-3xl md:text-4xl font-black text-spp-navy leading-tight tracking-tight">
                       Engineering National Development With <span className="italic">Integrity & Innovation</span>
                    </h3>
                 </div>
                 <p className="text-lg text-spp-navy/60 font-medium leading-relaxed border-l-[3px] border-neon-lime/30 pl-8">
                    Swastik Power Pro Private Limited is committed to delivering <span className="text-spp-navy font-black">sustainable infrastructure solutions</span> that <span className="text-spp-navy font-black">improve quality of life</span> and promote <span className="text-spp-navy font-black">economic development in India</span>. Through a combination of technical expertise, quality workmanship, and innovative project management, the company successfully executes complex infrastructure projects across multiple sectors.
                 </p>
              </div>

              {/* Vision & Mission Column */}
              <div className="md:col-span-5 text-left flex flex-col justify-between">
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/30">Our Vision</span>
                       <p className="text-sm font-bold text-spp-navy/40 leading-relaxed italic">
                          "To be a leading provider of <span className="text-spp-navy font-black not-italic underline underline-offset-4 decoration-neon-lime/30">sustainable water and energy solutions</span> that transform communities and promote <span className="text-spp-navy font-black not-italic">environmental stewardship</span>."
                       </p>
                    </div>
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/30">Our Mission</span>
                       <p className="text-sm font-bold text-spp-navy/40 leading-relaxed italic">
                          "To deliver high-quality infrastructure projects that provide <span className="text-spp-navy font-black not-italic">safe water supply</span>, <span className="text-spp-navy font-black not-italic">reliable energy</span>, and sustainable development to rural and urban communities across India."
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Values Strip */}
           <div className="mt-16 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 group">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/30">Core Values</span>
              <div className="flex flex-wrap justify-center gap-12">
                 {["Quality", "Integrity", "Safety", "Sustainability", "Community Development"].map((v, i) => (
                    <div key={v} className="flex items-center gap-4">
                       <span className="text-[9px] font-black text-spp-navy/60">0{i+1}</span>
                       <span className="text-[11px] font-black uppercase tracking-[0.2em] text-spp-navy">{v}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

function LogoMarquee() {
  const logos = [
    { name: "National Grid", sub: "Supply Command" },
    { name: "Solar Axis", sub: "Renewable Ops" },
    { name: "Water Tech", sub: "Hydro Systems" },
    { name: "Infra Pro", sub: "Structural Eng" },
    { name: "Green Volt", sub: "Power Gen" },
    { name: "Jeevan Hyd", sub: "Public Works" }
  ];

  return (
    <section className="py-10 bg-white overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white to-transparent z-10"></div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-24 px-12">
          {logos.concat(logos).map((l, i) => (
            <div key={i} className="flex items-center group cursor-default">
              <div className="flex flex-col">
                <span className="text-sm font-black text-spp-navy uppercase tracking-tighter italic leading-none">{l.name}</span>
                <span className="text-[8px] font-bold text-spp-navy/30 uppercase tracking-[0.2em]">{l.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JeevanMissionHighlight() {
  return (
    <section className="py-24 md:py-40 bg-spp-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 transition-all duration-1000 grayscale hover:grayscale-0">
        <img src="/assets/jeevan_mission.png" className="w-full h-full object-cover" alt="National Development" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-spp-navy via-spp-navy/80 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime">
            <Droplets size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Flagship Program Execution</span>
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
            Proud <br />
            Jeevan <br />
            Mission
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 font-medium">
            <div className="space-y-6">
              <h4 className="text-2xl font-black text-neon-lime uppercase tracking-tight">National Welfare</h4>
              <p className="text-white/60 leading-relaxed">
                Swastik Power Pro is at the forefront of the national Jal Jeevan Mission, bringing clean, piped water to thousands of households across India.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-2xl font-black text-white uppercase tracking-tight">2026 Target</h4>
              <p className="text-white/60 leading-relaxed">
                Our engineering team is deploying automated pump houses and high-altitude reservoirs to ensure 24/7 water security for rural development.
              </p>
            </div>
          </div>
          
          <div className="pt-10">
            <Link to="/jal-jeevan-mission" className="group flex items-center gap-6 text-white hover:text-neon-lime transition-all">
              <span className="text-[11px] font-black uppercase tracking-[0.3em]">Explore Project Phases</span>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-neon-lime group-hover:bg-neon-lime group-hover:text-spp-navy transition-all">
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// PROJECTS DIRECTORY PAGE
function ProjectsPage() {
  const projects = [
    {
      id: "PROJ-001",
      title: "Bhukha Bhagatsingh to Karna Rd",
      category: "Site Survey & Excavation",
      desc: "Date: 04.02.2025 | Coordinates: Lat 25.70315, Long 71.92809. Survey team measuring trench depth using measuring tape. Deep excavation showing soil profile for foundation preparation.",
      link: "/jal-jeevan-mission",
      image: "https://cdn.designfast.io/image/2026-04-12/ea264eb0-06cc-4727-8aee-1096c3a82e3f.jpeg",
      span: "md:col-span-2 md:row-span-2",
      icon: <Droplets size={32} />,
      status: "Active Deployment"
    },
    {
      id: "PROJ-002",
      title: "Barmer, Rajasthan",
      category: "Foundation & Concrete Work",
      desc: "Date: 04.05.2025 | Coordinates: Lat 25.79025, Long 72.25445. Interior trench inspection with measurement tools. Urban construction site with foundation preparation work visible.",
      link: "/green-energy-solar",
      image: "https://cdn.designfast.io/image/2026-04-12/5fc82d70-f473-42e6-a1b0-060f366faca8.png",
      span: "md:col-span-1 md:row-span-1",
      icon: <Sun size={24} />,
      status: "Operational"
    },
    {
      id: "PROJ-003",
      title: "Kundal, Rajasthan",
      category: "Structural Construction",
      desc: "Date: 14.05.2025 | Coordinates: Lat 25.513061, Long 72.327178. Multi-story elevated water tank structure with steel reinforcement framework. Yellow and red structural framing.",
      image: "https://cdn.designfast.io/image/2026-04-12/283c3c3d-5a3c-4419-b05b-7dee0c940992.png",
      span: "md:col-span-1 md:row-span-2",
      icon: <Hammer size={24} />,
      status: "Active Phase"
    },
    {
      id: "PROJ-004",
      title: "Dakhan, Rajasthan",
      category: "Excavation & Preparation",
      desc: "Date: 08.01.2025 | Coordinates: Lat 25.61488, Long 72.10353. Worker in safety helmet measuring trench depth. Active construction site with excavator visible in background.",
      image: "https://cdn.designfast.io/image/2026-04-12/d74dd618-cdf5-498a-94fa-908e3d115ea3.png",
      span: "md:col-span-1 md:row-span-1",
      icon: <Settings size={24} />,
      status: "Active Execution"
    },
    {
      id: "PROJ-005",
      title: "Project Site Installation",
      category: "Smart Metering Installation",
      desc: "Date: Completion Date | Coordinates: Site Specific. Genus brand advanced smart meter with digital display. Complete electrical connections and mounting hardware.",
      image: "https://cdn.designfast.io/image/2026-04-12/ebbd7019-aa69-4910-82b7-e9bab37b9f99.png",
      span: "md:col-span-2 md:row-span-1",
      icon: <Wind size={24} />,
      status: "Installed"
    },
    {
      id: "PROJ-006",
      title: "Rajasthan General Site",
      category: "Structural Assembly",
      desc: "Date: Construction Phase | Coordinates: Multiple Sites. Elevated tank with reinforced concrete base and steel framework. Structural frame showing proper assembly.",
      image: "https://cdn.designfast.io/image/2026-04-12/7bb98b8d-d04a-4822-b706-70a69d5959f2.png",
      span: "md:col-span-1 md:row-span-1",
      icon: <Hammer size={24} />,
      status: "In Progress"
    },
    {
      id: "PROJ-007",
      title: "Rajasthan Urban Area",
      category: "Worker Safety Briefing",
      desc: "Date: Training Date | Coordinates: Various Locations. Comprehensive worker training session with 20+ participants. All wearing hard hats and orange safety vests.",
      image: "https://cdn.designfast.io/image/2026-04-12/8a66d124-bdaf-4a5b-9af9-5c0fc4635bca.png",
      span: "md:col-span-2 md:row-span-1",
      icon: <CheckCircle2 size={24} />,
      status: "Safety Certified"
    },
    {
      id: "PROJ-008",
      title: "Project Control Center",
      category: "Electrical Setup",
      desc: "Date: Equipment Setup | Coordinates: Control Room Location. Complete control panel with electrical distribution equipment. Wiring connections and technical setup visible.",
      image: "https://cdn.designfast.io/image/2026-04-12/9104dbbb-29aa-41d3-8fdf-bd74253775aa.png",
      span: "md:col-span-1 md:row-span-1",
      icon: <Settings size={24} />,
      status: "System Validated"
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      {/* FULL WIDTH INTEGRATED HERO */}
      <div className="relative w-full min-h-[500px] md:min-h-[750px] overflow-hidden mb-12 flex flex-col justify-end isolate group">
         {/* Background Image - Now Full Width */}
         <img 
           src="/assets/projects_hero.png" 
           alt="Industrial Infrastructure" 
           className="absolute inset-0 w-full h-full object-cover z-[-2]"
         />
         {/* Sophisticated Overlays */}
         <div className="absolute inset-0 bg-gradient-to-t from-spp-navy via-spp-navy/40 to-transparent z-[-1]"></div>
         <div className="absolute inset-0 bg-spp-navy/10 backdrop-blur-[2px] z-[-1]"></div>

         {/* Content Aligned with Page Grid */}
         <div className="max-w-7xl mx-auto w-full px-6 pb-40">
            <div className="relative flex flex-col md:flex-row justify-between items-end gap-12">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl text-neon-lime border border-white/20 shadow-2xl">
                     <Compass size={18} />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em]">Infrastructure Portfolio v2.0</span>
                  </div>
                  <h1 className="text-7xl md:text-[11rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                     Industrial <br /> 
                     <span className="text-neon-lime">Projects</span>
                  </h1>
               </div>
               
               <div className="max-w-sm space-y-6">
                  <p className="text-xl text-white/80 font-medium leading-relaxed italic border-r-4 border-neon-lime pr-8">
                     A high-performance directory of our national engineering footprint and sustainable infrastructure deployments.
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* GSAP INTERACTIVE STACK */}
        <div className="py-8">
          <StickyCard002 cards={projects} />
        </div>
      </div>
    </div>
  );
}

function JalJeevanMission() {
  const phases = [
    {
      id: "PHASE 1",
      title: "Site Survey & Excavation",
      timeline: "February 2025 - March 2025",
      icon: <MapPin size={32} />,
      activities: [
        "Initial site assessment and layout planning",
        "GPS mapping and geotechnical surveys",
        "Depth measurements and soil analysis",
        "Trench excavation for pipeline foundation",
        "Photographic documentation of all sites"
      ],
      color: "bg-spp-navy",
      textColor: "text-white",
      span: "md:col-span-2",
      image: "/assets/survey_bento.png"
    },
    {
      id: "PHASE 2",
      title: "Foundation & Concrete Work",
      timeline: "March 2025 - May 2025",
      icon: <Hammer size={32} />,
      activities: [
        "Reinforced Cement Concrete (RCC) preparation",
        "Foundation base slab casting and curing",
        "Formwork and shuttering installation",
        "Quality testing and verification",
        "Progressive documentation with timestamps"
      ],
      color: "bg-slate-50",
      textColor: "text-spp-navy",
      span: "md:col-span-1"
    },
    {
      id: "PHASE 3",
      title: "Structural Construction",
      timeline: "May 2025 - August 2025",
      icon: <BarChart size={32} />,
      activities: [
        "Steel reinforcement framework assembly",
        "Elevated tank structure construction",
        "Brick masonry and concrete column work",
        "Structural integrity verification",
        "Safety training and worker briefings"
      ],
      color: "bg-spp-navy",
      textColor: "text-white",
      span: "md:col-span-1",
      image: "/assets/construction_bento.png"
    },
    {
      id: "PHASE 4",
      title: "Installation & Commissioning",
      timeline: "August 2025 - October 2025",
      icon: <Settings size={32} />,
      activities: [
        "Smart meter installation (Genus brand systems)",
        "Electrical control panel setup",
        "Distribution equipment installation",
        "System testing and calibration",
        "Final documentation and handover"
      ],
      color: "bg-neon-lime",
      textColor: "text-spp-navy",
      span: "md:col-span-2"
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-8">
             <Link to="/" className="inline-flex items-center gap-3 text-spp-navy/40 hover:text-spp-navy transition-colors font-bold text-[11px] uppercase tracking-widest px-4 py-2 border border-spp-navy/10 rounded-full">
                <ArrowRight size={14} className="rotate-180" /> Back to Home
             </Link>
             <div className="space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-neon-lime">National Infrastructure </p>
                <h1 className="text-6xl md:text-9xl font-black text-spp-navy leading-[0.9] tracking-tighter uppercase italic">
                   Jal Jeevan <br className="hidden md:block" /> Mission
                </h1>
             </div>
          </div>
          <p className="text-xl text-spp-navy/40 font-medium max-w-sm leading-relaxed text-right">
             A technical roadmap of our flagship water infrastructure project execution and delivery cycle.
          </p>
        </div>

        {/* BENTO TIMELINE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(400px,auto)]">
          {phases.map((phase, index) => (
            <div 
              key={index} 
              className={`p-8 md:p-12 rounded-[40px] md:rounded-[60px] flex flex-col justify-between shadow-2xl shadow-spp-navy/5 relative overflow-hidden group transition-all duration-700 hover:shadow-neon-lime/10 ${phase.span} ${phase.color} ${phase.textColor}`}
            >
              {/* Image Background for specific cards */}
              {phase.image && (
                <>
                  <div className="absolute inset-0 z-0 overflow-hidden transform group-hover:scale-110 transition-transform duration-1000 ease-out">
                    <img 
                      src={phase.image} 
                      className={`w-full h-full object-cover filter brightness-[0.7] grayscale-[0.3] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000`} 
                      alt={phase.title} 
                    />
                  </div>
                  {/* Atmospheric Overlays */}
                  <div className={`absolute inset-0 z-[1] bg-gradient-to-t ${phase.textColor === 'text-white' ? 'from-spp-navy/90 via-spp-navy/40 to-transparent' : 'from-white/90 via-white/40 to-transparent'}`}></div>
                </>
              )}

              {/* Standard Grid Pattern for non-image cards */}
              {!phase.image && (
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              )}
              
              <div className="relative z-10 space-y-8">
                {/* Top Meta Hub */}
                <div className="flex flex-col gap-6">
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl ${phase.id === "PHASE 4" ? 'bg-spp-navy text-neon-lime' : 'bg-neon-lime text-spp-navy shadow-neon-lime/20'}`}>
                    {phase.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime">{phase.id}</span>
                      <div className="h-px w-8 bg-neon-lime/30"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block">{phase.timeline}</span>
                  </div>
                </div>

                {/* Content Core */}
                <div className="space-y-4">
                  <h3 className={`text-3xl md:text-5xl font-black leading-[1] uppercase italic break-words tracking-tighter ${phase.image ? 'drop-shadow-2xl' : ''}`}>
                    {phase.title}
                  </h3>
                  <div className={`w-16 h-1.5 rounded-full ${phase.textColor === 'text-white' ? 'bg-neon-lime' : 'bg-spp-navy'}`}></div>
                </div>

                {/* Technical Listing */}
                <ul className="space-y-5 pt-4 max-w-xl">
                  {phase.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-neon-lime/10 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-neon-lime" />
                      </div>
                      <span className={`text-[13px] md:text-sm font-medium leading-relaxed ${phase.textColor === 'text-white' ? 'text-white/60' : 'text-spp-navy/60'}`}>
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secure Footer Spec */}
              <div className="relative z-10 pt-10 border-t border-current/10 mt-12">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="relative w-2.5 h-2.5">
                          <div className="absolute inset-0 rounded-full bg-neon-lime animate-ping opacity-75"></div>
                          <div className="relative rounded-full bg-neon-lime w-2.5 h-2.5"></div>
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Operational Protocol Active</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[9px] font-bold opacity-20 uppercase tracking-widest">v2.0.46</span>
                       <ShieldCheck size={14} className="opacity-20 text-neon-lime" />
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// GREEN ENERGY & SOLAR ENERGY PAGE
function GreenEnergySolar() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const projectSpecs = [
    { title: "Project Status", value: "Pre-Launch Phase", icon: <Clock size={20} />, active: true },
    { title: "Region Focus", value: "Rural Rajasthan, India", icon: <MapPin size={20} /> },
    { title: "Launch Window", value: "Q3 2025 - Initial Rollout", icon: <Calendar size={20} /> },
    { title: "Infrastructure", value: "Grid-Scale & Distributed", icon: <Zap size={20} /> }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
         <div className="absolute inset-0 z-0">
            <img 
               src="/assets/rajasthan_solar.png" 
               className="w-full h-full object-cover scale-105" 
               alt="Rajasthan Solar Project" 
            />
            {/* Coordinate Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 20}%` }}></div>
               ))}
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute h-full w-px bg-white" style={{ left: `${(i + 1) * 20}%` }}></div>
               ))}
               <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-[8px] text-white font-mono uppercase tracking-widest">
                  Lat: 26.9124° N // Long: 70.9126° E
               </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-spp-navy/95 via-spp-navy/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24">
            <div className="max-w-5xl space-y-12">
               <Link to="/" className="inline-flex items-center gap-3 text-white/60 hover:text-neon-lime transition-all font-bold text-[11px] uppercase tracking-widest px-6 py-2 border border-white/10 rounded-full backdrop-blur-md">
                  <ArrowRight size={14} className="rotate-180" /> Back to Terminal
               </Link>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-px bg-neon-lime/50"></div>
                     <span className="text-[11px] font-black uppercase tracking-[0.4em] text-neon-lime/80">Project Blueprint v2.04</span>
                  </div>
                  <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                     Solar <br /> Installation <br /> Project
                  </h1>
               </div>

               <div className="flex flex-wrap items-center gap-10">
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl group cursor-default shadow-2xl">
                     <div className="w-3 h-3 rounded-full bg-neon-lime animate-pulse shadow-[0_0_15px_rgba(182,255,0,0.5)]"></div>
                     <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">System Pre-Launch Active</span>
                  </div>
                  <div className="h-4 w-px bg-white/10 hidden md:block"></div>
               </div>
            </div>
         </div>
      </section>

      {/* BENTO HUB */}
      <section className="py-24 md:py-40 bg-white relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[320px]">
               
               {/* Vision Hero Card */}
               <div className="md:col-span-2 md:row-span-1 p-8 md:p-14 rounded-[40px] md:rounded-[60px] bg-spp-navy text-white relative overflow-hidden group shadow-2xl shadow-spp-navy/10 flex flex-col justify-center min-h-[300px] md:min-h-[auto]">
                  <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-px bg-neon-lime/30"></div>
                        <div className="flex items-center gap-3">
                           <Target size={16} className="text-neon-lime" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime">Strategic Objective</span>
                        </div>
                     </div>
                     <h2 className="text-2xl md:text-3xl lg:text-[2.6rem] font-black uppercase tracking-tighter italic leading-[1.1] max-w-4xl">
                        Powering high-performance <br className="hidden lg:block" /> energy across rural Rajasthan.
                     </h2>
                     <p className="text-white/40 font-medium text-xs md:text-sm max-w-2xl leading-relaxed italic">
                        Deploying mission-critical solar arrays to revolutionize residential electricity access and industrial pumping efficiency through sustainable generation modules.
                     </p>
                  </div>
               </div>

               {/* Status Sidebar */}
               <div className="md:col-span-1 md:row-span-2 p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-slate-50 border border-spp-navy/5 flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-lime/10 rounded-full blur-[80px] group-hover:bg-neon-lime/20 transition-all duration-700"></div>
                  <div className="space-y-10 relative z-10">
                     <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-spp-navy/20 py-4 border-b border-spp-navy/5">Project Metadata Hub</h5>
                     <div className="space-y-8">
                        {projectSpecs.map((spec, i) => (
                           <div key={i} className="flex items-center gap-6">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${spec.active ? 'bg-spp-navy text-neon-lime shadow-xl' : 'bg-white text-spp-navy/20'}`}>
                                 {spec.icon}
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-black uppercase tracking-widest text-spp-navy/20">{spec.title}</p>
                                 <p className="text-xs font-black text-spp-navy uppercase italic">{spec.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative z-10 pt-10 mt-auto">
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-spp-navy/20">Protocol Authorization v4.2</span>
                  </div>
               </div>

               {/* Technical Scope Card */}
               <div className="md:col-span-1 md:row-span-2 p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-[#F8FAF3] border border-neon-lime/20 flex flex-col justify-between group overflow-hidden relative">
                  <div className="space-y-10 relative z-10">
                     <div className="space-y-6">
                        <div className="w-14 h-14 rounded-3xl bg-spp-navy text-neon-lime flex items-center justify-center shadow-2xl relative overflow-hidden">
                           <ShieldCheck size={28} />
                        </div>
                        <h4 className="text-xl md:text-2xl font-black text-spp-navy uppercase italic tracking-tighter leading-tight">Scope Of <br /> Operational Work</h4>
                     </div>
                     <ul className="space-y-6">
                        {[
                           "Complete Solar Panel Array Setup",
                           "Electrical Integration & Interconnect",
                           "System Commissioning & Load Testing",
                           "Remote Performance Uplink Setup"
                        ].map((item, i) => (
                           <li key={i} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-neon-lime mt-1.5"></div>
                              <span className="text-[12px] font-black text-spp-navy/60 uppercase tracking-tight italic leading-snug">{item}</span>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="absolute bottom-0 right-0 p-8 opacity-5 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                     <Zap size={100} />
                  </div>
               </div>

               {/* Innovation Card (Image Background) */}
               <div className="md:col-span-1 md:row-span-1 p-8 md:p-10 rounded-[40px] md:rounded-[60px] relative overflow-hidden group shadow-2xl flex flex-col justify-end">
                  <img src="/assets/solar_precision.png" className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 transform group-hover:scale-110" alt="Innovation" />
                  <div className="absolute inset-0 bg-gradient-to-t from-spp-navy/90 via-spp-navy/40 to-transparent"></div>
                  <div className="relative z-10 space-y-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                     <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neon-lime">Core Innovation</span>
                     <h4 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none">Monocrystalline <br /> Module Precision</h4>
                  </div>
               </div>

               {/* Impact Card */}
               <div className="md:col-span-1 md:row-span-1 p-8 md:p-10 rounded-[40px] md:rounded-[60px] bg-white border border-spp-navy/5 flex flex-col justify-between group hover:border-neon-lime/30 transition-colors shadow-2xl shadow-slate-200/50">
                  <div className="space-y-4">
                     <div className="w-10 h-10 rounded-xl bg-neon-lime/10 text-spp-navy flex items-center justify-center group-hover:bg-neon-lime transition-colors">
                        <Wind size={20} />
                     </div>
                     <h4 className="text-lg md:text-xl font-black text-spp-navy uppercase italic">Sustainable <br /> Energy Impact</h4>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-bold text-spp-navy/40 uppercase leading-relaxed tracking-wider">
                     Supporting mission-critical water pumping modules and local grid independence.
                  </p>
               </div>

               {/* Partnership Inquiry Form */}
               <div className="md:col-span-2 md:row-span-1 p-8 md:p-12 rounded-[40px] md:rounded-[60px] bg-slate-50 relative overflow-hidden group flex flex-col justify-center border border-spp-navy/5 shadow-2xl">
                  <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center w-full">
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime">Partner Inquiries</h5>
                           <h3 className="text-3xl md:text-4xl font-black text-spp-navy uppercase italic tracking-tighter leading-none">Initialize <br /> Solar Uplink</h3>
                        </div>
                        <p className="text-[10px] font-bold text-spp-navy/40 uppercase tracking-widest max-w-xs leading-relaxed">
                           Strategic partnerships for residential and industrial rollout in Q3 2025.
                        </p>
                     </div>

                     <div className="relative">
                        {submitted ? (
                           <div className="bg-white p-8 rounded-[30px] shadow-2xl border border-neon-lime/20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                              <CheckCircle2 size={32} className="text-neon-lime mb-4" />
                              <p className="text-spp-navy text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                 Uplink Established. <br /> Our engineers are processing your identity.
                              </p>
                           </div>
                        ) : (
                           <form onSubmit={handleSubmit} className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                 <input 
                                    type="text" required placeholder="NAME" 
                                    className="w-full bg-white border border-spp-navy/5 rounded-2xl px-5 py-4 text-[10px] font-bold text-spp-navy focus:ring-2 ring-neon-lime outline-none placeholder:opacity-30" 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                 />
                                 <input 
                                    type="email" required placeholder="EMAIL" 
                                    className="w-full bg-white border border-spp-navy/5 rounded-2xl px-5 py-4 text-[10px] font-bold text-spp-navy focus:ring-2 ring-neon-lime outline-none placeholder:opacity-30" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                 />
                              </div>
                              <button type="submit" className="w-full bg-spp-navy text-white text-[9px] font-black uppercase tracking-[0.4em] py-5 rounded-2xl hover:bg-neon-lime hover:text-spp-navy transition-all shadow-xl shadow-spp-navy/10 active:scale-95 group/btn flex items-center justify-center gap-4">
                                 Initialize Protocol <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                              </button>
                           </form>
                        )}
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-spp-navy transform rotate-12 pointer-events-none">
                     <Sun size={150} />
                  </div>
               </div>

            </div>
         </div>
      </section>
    </div>
  );
}



function QualityAssuranceSection() {
  const points = [
    { 
      title: "GPS-Tagged Documentation", 
      desc: "All site photographs include precise GPS coordinates for accountability and location verification.", 
      icon: <MapPin size={28} />,
      span: "sm:col-span-2 lg:col-span-2",
      hero: true
    },
    { 
      title: "Professional Site Oversight", 
      desc: "Regular inspections and technical reviews ensure compliance with international standards and technical specifications.", 
      icon: <Target size={28} />,
      span: "sm:row-span-2 lg:row-span-2",
      hero: true
    },
    { 
      title: "Timestamped Records", 
      desc: "Every image contains accurate timestamp data (date, time, GMT offset) for temporal tracking.", 
      icon: <Clock size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    },
    { 
      title: "Worker Safety Protocols", 
      desc: "Mandatory use of personal protective equipment (hard hats, safety vests, gloves) at all sites.", 
      icon: <ShieldCheck size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    },
    { 
      title: "Structural Verification", 
      desc: "Independent testing and quality checks validate construction integrity and engineering compliance.", 
      icon: <CheckCircle2 size={28} />,
      span: "sm:col-span-2 lg:col-span-2",
      hero: true
    },
    { 
      title: "Advanced Metering", 
      desc: "Installation of smart meters enables real-time monitoring and performance verification.", 
      icon: <Gauge size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    },
    { 
      title: "Geotechnical Assessment", 
      desc: "Professional surveys and soil analysis ensure proper foundation design.", 
      icon: <Compass size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    },
    { 
      title: "Multi-Point Coverage", 
      desc: "Comprehensive photography from multiple angles documents each phase thoroughly.", 
      icon: <Camera size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    },
    { 
      title: "Progress Documentation", 
      desc: "Regular milestone documentation tracks project advancement and quality metrics.", 
      icon: <ClipboardCheck size={24} />,
      span: "sm:col-span-1 lg:col-span-1"
    }
  ];

  return (
    <section id="quality-assurance" className="pt-32 pb-24 md:pb-40 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12 mb-20">
          <div className="space-y-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neon-lime">Standard Protocol</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-spp-navy tracking-tight uppercase leading-[0.9]">
              Quality Assurance & <br /> Documentation
            </h2>
          </div>
          <p className="text-lg text-spp-navy/50 font-medium max-w-lg leading-relaxed">
            Swastik Power Pro maintains the highest standards of quality control through comprehensive project monitoring and verification processes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {points.map((point, i) => (
            <div 
              key={i} 
              className={`relative p-8 md:p-10 rounded-[40px] overflow-hidden flex flex-col justify-between shadow-sm
                ${point.span || ""} 
                ${point.hero ? 'bg-spp-navy text-white z-10' : 'bg-slate-50 text-spp-navy border border-spp-navy/5'}
                min-h-[320px]`}
            >
              {/* Subtle Grid Pattern for Hero Cards */}
              {point.hero && (
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4FF37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              )}
              
              <div className="relative z-10 space-y-8">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center 
                   ${point.hero ? 'bg-neon-lime text-spp-navy' : 'bg-white text-spp-navy shadow-sm'}`}>
                    {point.icon}
                 </div>
                 <div className="space-y-4">
                    <h4 className={`font-black uppercase tracking-tight leading-tight 
                      ${point.hero ? 'text-2xl md:text-3xl lg:text-4xl text-white' : 'text-xl text-spp-navy'}`}>
                       {point.title}
                    </h4>
                    <p className={`font-medium leading-relaxed 
                      ${point.hero ? 'text-white/40 text-sm md:text-base' : 'text-sm text-spp-navy/40'}`}>
                       {point.desc}
                    </p>
                 </div>
              </div>

              <div className="relative z-10 pt-8 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${point.hero ? 'text-neon-lime' : 'text-spp-navy/40'}`}>
                       Standard Verified
                    </span>
                    <CheckCircle2 size={14} className={point.hero ? 'text-neon-lime' : 'text-spp-navy/20'} />
                 </div>
                 {point.hero && <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neon-lime/40"><ArrowRight size={16} /></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSteps() {
  return (
    <section className="pt-24 md:pt-40 pb-12 md:pb-16 bg-[#F8FAF3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12 mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-spp-navy tracking-tight max-w-2xl leading-[1.1]">
            From Quote To Power-On In 4 Simple Steps
          </h2>
          <div className="flex flex-col items-start lg:items-end">
            <p className="text-lg text-spp-navy/50 font-medium max-w-sm text-left lg:text-right leading-relaxed">
              Whether you’re a homeowner, business owner, or developer, we found the perfect solar solution match for your needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard num="01" time="1-2 Days" title="Home Assessment" desc="Virtual or in-person site radiation. Customized solar system design." />
          <StepCard num="02" time="1-3 Days" title="Personalized Quote" desc="System specifications and PPA etc. Financing options explained." />
          <StepCard num="03" time="1-2 Days" title="Expert Installation" desc="Licensed solar experts. Minimal disruption to schedule." />
          <StepCard num="04" time="2-4 Weeks" title="System Activation" desc="Utility permission and testing. Monitoring app setup." />
        </div>
      </div>
    </section>
  );
}

function StepCard({ num, time, title, desc, active }) {
  return (
    <div className={`p-8 md:p-10 rounded-[40px] flex flex-col justify-between min-h-[380px] transition-all duration-500 cursor-default group 
      ${active ? 'bg-neon-lime shadow-2xl shadow-neon-lime/20' : 'bg-white shadow-xl hover:bg-neon-lime hover:shadow-2xl hover:shadow-neon-lime/20 border border-transparent hover:border-neon-lime/20'} 
      hover:-translate-y-2 hover:scale-[1.01]`}>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <span className={`text-6xl md:text-7xl font-black leading-none transition-colors duration-500 ${active ? 'text-spp-navy' : 'text-spp-navy/5 group-hover:text-spp-navy/20'}`}>{num}</span>
          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${active ? 'text-spp-navy/40' : 'text-spp-navy/20 group-hover:text-spp-navy/40'}`}>{time}</span>
        </div>
        <div className="space-y-4">
          <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none transition-colors duration-500 ${active ? 'text-spp-navy' : 'text-spp-navy group-hover:text-spp-navy'}`}>{title}</h3>
          <p className={`text-[13px] font-bold uppercase tracking-tight leading-relaxed transition-colors duration-500 ${active ? 'text-spp-navy/60' : 'text-spp-navy/40 group-hover:text-spp-navy/60'}`}>{desc}</p>
        </div>
      </div>
      
    </div>
  );
}

const SERVICES_DATA = [
  { slug: "jal-jeevan-mission", title: "Proud Jeevan Mission", desc: "Government welfare program execution bringing clean water to every household across India.", icon: <CheckCircle2 size={24} />, tag: "Welfare", link: "/jal-jeevan-mission" },
  { slug: "green-energy-solar", title: "Green Energy & Solar Energy", desc: "Advanced renewable energy solutions and grid-scale installations for a sustainable future.", icon: <Sun size={24} />, tag: "Core Energy", link: "/green-energy-solar" },
  { slug: "solar-installation", title: "Solar Installation", desc: "Specialized residential and industrial solar module setup, maintenance, and performance tuning.", icon: <Sun size={24} />, tag: "Installation" },
  { slug: "elevated-water-tanks", title: "Elevated Water Tanks", desc: "Precision-engineered water storage solutions for urban development and rural irrigation.", icon: <Droplets size={24} />, tag: "Infrastructure" },
  { slug: "ppms-building", title: "PPMS Building", desc: "Premium Project Management and Structural building services for mission-critical industrial scales.", icon: <Zap size={24} />, tag: "Construction" },
  { slug: "water-distribution-line", title: "Water Distribution Line", desc: "Comprehensive supply network engineering and maintenance infrastructure for municipalities.", icon: <Wind size={24} />, tag: "Utility" },
  { slug: "it-ht-work", title: "IT & HT Work", desc: "High-voltage electrical infrastructure management and industrial-grade mission-critical power systems.", icon: <Zap size={24} />, tag: "Electrical" },
  { slug: "wind-power", title: "Wind Power", desc: "Industrial-grade wind energy deployment and high-performance turbine optimization.", icon: <Wind size={24} />, tag: "Sustainable" },
  { slug: "water-tank-projects", title: "Water Tank Projects", desc: "Large-scale water storage and distribution infrastructure projects for national utility security.", icon: <Droplets size={24} />, tag: "Water Systems" },
  { slug: "chp-efficiency", title: "CHP (Combined Heat & Power)", desc: "High-efficiency Co-generation solutions for optimized industrial power and heat efficiency.", icon: <Zap size={24} />, tag: "Efficiency" },
  { slug: "pump-house", title: "Pump House", desc: "Advanced pumping station engineering and automated water circulation and supply systems.", icon: <Droplets size={24} />, tag: "Engineering" }
];

function ServicesHighlight() {
  return (
    <section id="services-highlight" className="pt-12 md:pt-16 pb-12 md:pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-12 mb-20">
          <div className="space-y-6">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-neon-lime">Service Protocol</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-spp-navy tracking-tight max-w-2xl leading-[1.1]">
              Core Industrial <br /> Infrastructure
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-6">
            <p className="text-lg text-spp-navy/50 font-medium max-w-sm text-left lg:text-right leading-relaxed">
              Deploying specialized engineering solutions for national development and industrial excellence.
            </p>
            <Link to="/services" className="bg-slate-50 border border-spp-navy/10 px-8 py-4 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-neon-lime hover:border-neon-lime transition-all">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.slice(0, 3).map((service, index) => (
            <ServiceCard key={index} {...service} premium index={index + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* FULL WIDTH HERO */}
      <section className="relative w-full min-h-[500px] md:min-h-[750px] flex items-center overflow-hidden isolate group">
         {/* Background Image */}
         <img 
           src="/assets/services_hero.png" 
           alt="Industrial Solar Services" 
           className="absolute inset-0 w-full h-full object-cover z-[-2]"
         />
         {/* Sophisticated Overlays */}
         <div className="absolute inset-0 bg-gradient-to-r from-spp-navy/95 via-spp-navy/70 to-transparent z-[-1]"></div>
         <div className="absolute inset-0 bg-spp-navy/20 backdrop-blur-[1px] z-[-1]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-[-1]"></div>

         <div className="max-w-7xl mx-auto px-6 w-full pt-32 pb-16 relative z-10">
            <div className="max-w-5xl space-y-10">
               <h1 className="text-7xl md:text-9xl lg:text-[11.5rem] font-black text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                  Our <br /> Services
               </h1>
               <div className="max-w-xl">
                  <p className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed italic border-l-4 border-neon-lime pl-8">
                    A comprehensive directory of our engineering capabilities, from national welfare projects to industrial power optimization.
                  </p>
               </div>
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, index) => (
            <ServiceCard key={index} {...service} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InitializeConnectionPage() {
  const { serviceSlug } = useParams();
  const service = SERVICES_DATA.find(s => s.slug === serviceSlug);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [phase, setPhase] = useState('SYNC'); // SYNC, ACTIVE, COMPLETE
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated connection handshake
    const timer = setTimeout(() => setPhase('ACTIVE'), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!service) {
    return (
      <div className="pt-40 text-center text-spp-navy font-black uppercase tracking-widest bg-white min-h-screen flex flex-col items-center justify-center space-y-8">
        <X size={48} className="text-red-500 animate-pulse" />
        <div className="space-y-2">
           <h2 className="text-2xl">Uplink Target Invalid</h2>
           <p className="text-sm opacity-40">Protocol deviation detected. Target module not found.</p>
        </div>
        <Link to="/services" className="bg-spp-navy text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em]">Return to Directory</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhase('SYNC');
    try {
      await api.post('/inquiries', { ...formData, type: service.title });
      setPhase('COMPLETE');
    } catch (err) {
      console.error('Transmission failure:', err);
      setPhase('ACTIVE');
      alert("TERMINAL ERROR: Transmission protocol failed. Please re-synchronize and retry.");
    }
  };

  return (
    <div className="bg-spp-navy min-h-screen text-white font-sans selection:bg-neon-lime/30">
       {/* ACTIVE TERMINAL HEADER */}
       <section className="relative pt-40 pb-20 overflow-hidden isolate border-b border-white/5">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(182,255,0,0.05)_0%,transparent_70%)]"></div>
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="grid md:grid-cols-12 gap-16 items-end">
                <div className="md:col-span-8 space-y-10">
                   <div className="flex flex-col gap-6">
                      <Link to="/services" className="inline-flex items-center gap-3 text-white/40 hover:text-neon-lime transition-all font-bold text-[10px] uppercase tracking-widest">
                         <ArrowRight size={14} className="rotate-180" /> Back to Directory
                      </Link>
                      <div className="flex items-center gap-4">
                         <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-neon-lime animate-ping opacity-75"></div>
                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-neon-lime"></div>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime">Industrial Protocol v.4.0.2</span>
                      </div>
                   </div>

                   <div className="space-y-4 md:space-y-6">
                      <h1 className="text-4xl sm:text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter uppercase italic drop-shadow-2xl break-words">
                         {phase === 'SYNC' ? 'Initializing' : 'Uplink'} <br className="hidden sm:block" /> 
                         <span className="text-neon-lime">{service.title}</span>
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                         <span>Lat: 28.6139° N</span>
                         <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
                         <span>Long: 77.2090° E</span>
                         <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
                         <span>Connection: {phase}</span>
                      </div>
                   </div>
                </div>

                <div className="md:col-span-4 block">
                   <div className="p-10 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 text-white/5 font-black text-6xl leading-none">MOD</div>
                      <div className="w-16 h-16 rounded-2xl bg-neon-lime text-spp-navy flex items-center justify-center shadow-2xl">
                         {service.icon}
                      </div>
                      <div className="space-y-3">
                         <p className="text-[10px] font-black uppercase tracking-widest text-neon-lime">{service.tag}</p>
                         <p className="text-xs text-white/60 font-medium leading-relaxed italic">{service.desc}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>

       {/* INQUIRY TERMINAL GRID */}
       <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
             {/* LEFT: FORM HUB */}
             <div className="lg:col-span-8">
                {phase === 'COMPLETE' ? (
                   <div className="bg-white/5 rounded-[60px] p-20 text-center space-y-8 animate-in zoom-in-95 duration-1000 border border-neon-lime/20">
                      <div className="w-24 h-24 bg-neon-lime rounded-full mx-auto flex items-center justify-center text-spp-navy shadow-2xl shadow-neon-lime/30">
                         <CheckCircle2 size={48} />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-4xl font-black uppercase tracking-tight">Transmission Verified</h3>
                         <p className="text-white/40 max-w-md mx-auto leading-relaxed">Your request protocol has been synchronized. A Swastik engineer will initiate secondary contact shortly.</p>
                      </div>
                      <button onClick={() => navigate('/services')} className="mt-8 px-10 py-4 bg-neon-lime text-spp-navy rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Return to Terminal</button>
                   </div>
                ) : (
                   <form onSubmit={handleSubmit} className="space-y-12">
                      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Identity Name</label>
                            <input 
                               required type="text" placeholder="ENTER FULL NAME"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:ring-4 focus:ring-neon-lime/10 focus:border-neon-lime/50 transition-all uppercase"
                               value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Comm. Email</label>
                            <input 
                               required type="email" placeholder="IDENTITY@TERMINAL.COM"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:ring-4 focus:ring-neon-lime/10 focus:border-neon-lime/50 transition-all uppercase"
                               value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Direct Uplink (Mobile)</label>
                            <input 
                               required type="tel" placeholder="+91 00000 00000"
                               className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:ring-4 focus:ring-neon-lime/10 focus:border-neon-lime/50 transition-all uppercase"
                               value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            />
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Mission Payload (Project Details)</label>
                         <textarea 
                            rows={5} placeholder="INITIALIZE PROJECT SPECIFICATIONS..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-6 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:ring-4 focus:ring-neon-lime/10 focus:border-neon-lime/50 transition-all uppercase resize-none"
                            value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                         ></textarea>
                      </div>

                      <button 
                         type="submit" 
                         disabled={phase === 'SYNC'}
                         className="group w-full bg-neon-lime text-spp-navy py-5 md:py-6 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.4em] shadow-2xl shadow-neon-lime/20 flex items-center justify-center gap-3 md:gap-6 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-wait overflow-hidden relative text-center"
                      >
                         <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                         <span>{phase === 'SYNC' ? 'Synchronizing Protocols...' : 'Establish Connection Uplink'}</span>
                         <ArrowRight className="group-hover:translate-x-2 transition-transform h-4 w-4 md:h-5 md:w-5" />
                      </button>
                   </form>
                )}
             </div>

             {/* RIGHT: STATUS SIDEBAR */}
             <div className="lg:col-span-4 space-y-8">
                <div className="bg-white/5 rounded-[40px] p-8 border border-white/5 space-y-8">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-lime">System Metrics</h5>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                            <span>Signal Integrity</span>
                            <span>98%</span>
                         </div>
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-lime w-[98%]"></div>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                            <span>Protocol Load</span>
                            <span>{phase === 'SYNC' ? '45%' : '100%'}</span>
                         </div>
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-neon-lime transition-all duration-1000 ${phase === 'SYNC' ? 'w-[45%]' : 'w-full'}`}></div>
                         </div>
                      </div>
                   </div>

                   <hr className="border-white/5" />

                   <div className="space-y-6">
                      {[
                         { label: "Identity Verification", status: "Active" },
                         { label: "Service Synchronized", status: "Verified" },
                         { label: "Data Pipeline", status: "Ready" }
                      ].map((item, i) => (
                         <div key={i} className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{item.label}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-neon-lime">{item.status}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-neon-lime/5 rounded-[30px] p-8 border border-neon-lime/10 space-y-4">
                   <div className="flex items-center gap-3 text-neon-lime">
                      <ShieldCheck size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Secure Uplink</span>
                   </div>
                   <p className="text-[9px] text-white/40 font-bold leading-relaxed uppercase tracking-wider">
                      Your technical identity and mission payload are protected via industrial-grade 256-bit encryption protocols.
                   </p>
                </div>
             </div>
          </div>
       </section>
    </div>
  );
}

function ServiceCard({ title, desc, icon, tag, premium, link, index, slug }) {
  const cardContent = (
    <>
      <div className="relative z-10 flex flex-col h-full">
        {/* TOP METADATA */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-neon-lime uppercase tracking-[0.4em]">Protocol</span>
             <div className={`w-6 h-px ${premium ? 'bg-white/20' : 'bg-spp-navy/10'}`}></div>
             <span className={`text-[10px] font-black tracking-widest ${premium ? 'text-white/30' : 'text-spp-navy/20'}`}>ID: {String(index).padStart(2, '0')}</span>
          </div>
        </div>

        {/* SERVICE IDENTITY */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></div>
             <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${premium ? 'text-white/40' : 'text-spp-navy/40'}`}>{tag}</span>
          </div>
          <h4 className={`text-2xl lg:text-3xl font-black tracking-tighter uppercase italic leading-[1.1] ${premium ? 'text-white' : 'text-spp-navy'}`}>
            {title}
          </h4>
          <p className={`text-sm font-medium leading-relaxed transition-colors max-w-sm ${premium ? 'text-white/50 group-hover:text-white/70' : 'text-spp-navy/50 group-hover:text-spp-navy/70'}`}>
            {desc}
          </p>
        </div>

        {/* ACTION HUB */}
        <div className="mt-auto flex items-center justify-between">
           <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${premium ? 'text-neon-lime' : 'text-spp-navy/40 group-hover:text-spp-navy'}`}>
             Initialize Connection <ArrowRight size={14} className="group-hover:translate-x-2 transition-all duration-500" />
           </div>
        </div>
      </div>

      {/* BACKGROUND TEXTURE */}
      <div className={`absolute bottom-0 right-0 p-6 md:p-10 font-black text-9xl md:text-[12rem] leading-none uppercase pointer-events-none select-none transition-all duration-1000 transform group-hover:-translate-x-4 ${premium ? 'text-white/[0.04]' : 'text-spp-navy/[0.05]'}`}>
        {String(index).padStart(2, '0')}
      </div>

      {/* GLOW EFFECT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
         <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-lime/10 rounded-full blur-[80px]"></div>
         <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-lime/5 rounded-full blur-[80px]"></div>
      </div>
    </>
  );

  const cardClasses = `group relative rounded-[40px] p-8 lg:p-12 transition-all duration-700 flex flex-col justify-between overflow-hidden min-h-[460px] border-2 cursor-pointer 
    ${premium 
      ? 'bg-spp-navy text-white border-transparent shadow-2xl sm:scale-105 z-10' 
      : 'bg-white border-slate-50 hover:border-neon-lime/20 shadow-xl shadow-slate-200/50 active:scale-[0.98]'
    }`;

  if (link || slug) {
    const target = link || `/initialize-connection/${slug}`;
    if (target.startsWith('/')) {
      return (
        <Link to={target} className={cardClasses}>
          {cardContent}
        </Link>
      );
    }
  }

  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
}

function LeadershipCouncil() {
  const leaders = [
    { name: "Hridesh Rajnath Pandey", role: "Finance Director", img: "https://cdn.designfast.io/image/2026-04-12/c3bb3e7a-73a5-43ee-ac85-051a202db4de.png", special: "Infrastructure Strategy", pos: "object-top" },
    { name: "Vijay Kumar soni", role: "Senior consultant", img: "https://cdn.designfast.io/image/2026-04-12/663d5ee6-318e-4ae3-85cd-d058ad4d146a.png", special: "Renewable Engineering", pos: "object-top" },
  ];

  return (
    <section className="pt-12 md:pt-16 pb-24 md:pb-40 bg-[#F8FAF3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-6 mb-24">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-spp-navy/30">Executive Guidance</p>
          <h2 className="text-5xl md:text-8xl font-black text-spp-navy tracking-tight uppercase italic">
            Leadership <br /> Council
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8">
          {leaders.map((leader, i) => (
            <div key={i} className="relative rounded-[60px] overflow-hidden aspect-[0.8/1] shadow-2xl bg-spp-navy w-full max-w-[380px]">
              <img src={leader.img} className={`w-full h-full object-cover ${leader.pos || 'object-center'} transition-all duration-700`} alt={leader.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-spp-navy via-transparent to-transparent opacity-90"></div>
              <div className="absolute inset-x-0 bottom-0 p-10 space-y-4 transition-all duration-500">
                <p className="text-neon-lime text-[10px] font-black uppercase tracking-[0.2em]">{leader.role}</p>
                <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none">{leader.name}</h4>
                <div className="pt-4 border-t border-white/10">
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">{leader.special}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceItem({ text }) {
  return (
    <li className="flex items-center gap-3 text-sm font-bold text-spp-navy/60">
      <div className="w-2 h-2 rounded-full bg-neon-lime ring-4 ring-neon-lime/20"></div>
      {text}
    </li>
  );
}



function FooterCTA({ formData, setFormData, handleSubmit, loading, status }) {
  return (
    <section id="contact" className="py-24 md:py-40 bg-spp-navy relative overflow-hidden scroll-mt-24">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <img src="/assets/hero.png" className="w-full h-full object-cover opacity-30 grayscale brightness-75 scale-110" alt="CTA backdrop" />
         <div className="absolute inset-0 bg-gradient-to-br from-spp-navy via-spp-navy/80 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-10 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] lg:grid lg:grid-cols-12 items-stretch gap-12 lg:gap-16">
          
          {/* LEFT: CONTENT HUB */}
          <div className="lg:col-span-5 flex flex-col justify-between py-4">
            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime">
                    <Zap size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Project Initiation</span>
                  </div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
                    Ready To <br />
                    Start Saving <br />
                    <span className="text-neon-lime">With Solar?</span>
                  </h2>
                  <p className="text-lg text-white/40 font-medium leading-relaxed max-w-md">
                    Our specialized engineering team is ready to architect high-performance energy solutions tailored for your industrial requirements.
                  </p>
               </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-white/[0.05] border border-white/10 p-5 md:p-6 rounded-3xl md:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 group hover:bg-white/[0.08] transition-all duration-500 w-full overflow-hidden">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-neon-lime rounded-2xl flex-shrink-0 flex items-center justify-center text-spp-navy shadow-2xl shadow-neon-lime/20 group-hover:scale-110 transition-transform">
                       <Phone size={20} className="sm:size-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Direct Line</p>
                      <p className="text-base sm:text-xl font-black text-white tracking-tight break-all md:break-normal">+91 123 456 7890</p>
                    </div>
                  </div>

                  <div className="bg-white/[0.05] border border-white/10 p-5 md:p-6 rounded-3xl md:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 group hover:bg-white/[0.08] transition-all duration-500 w-full overflow-hidden">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 border border-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-white group-hover:bg-white group-hover:text-spp-navy transition-all duration-500">
                       <Mail size={20} className="sm:size-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Mail Terminal</p>
                      <p className="text-base sm:text-xl font-black text-white tracking-tight italic break-all">solutions@swastik.pro</p>
                    </div>
                  </div>
                </div>
            </div>


          </div>

          {/* RIGHT: SECURE INQUIRY FORM */}
          <div className="lg:col-span-7 mt-12 lg:mt-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-br from-neon-lime/20 to-transparent rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[50px] blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white p-8 md:p-14 rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[48px] shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="mb-8 md:mb-10 flex justify-between items-end">
                 <div className="space-y-1">
                    <h3 className="text-2xl md:text-3xl font-black text-spp-navy tracking-tight uppercase italic">Secure Inquiry</h3>
                    <p className="text-[10px] font-bold text-spp-navy/30 uppercase tracking-widest">Field Data Protocol v3.0</p>
                 </div>
                 <ShieldCheck size={28} className="text-spp-navy/10" />
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputGroup label="Full Name" placeholder="ENTER NAME" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} />
                  <InputGroup label="Email Identity" placeholder="NAME@TERMINAL.ACCESS" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                   <InputGroup label="Mobile Number" placeholder="+91 00000 00000" value={formData.mobile} onChange={(v) => setFormData({...formData, mobile: v})} />
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-spp-navy/40 ml-1">Inquiry Type</label>
                    <CustomSelect 
                      options={["Solar Installation", "Jeevan Mission Project", "Industrial Consulting", "Vendor Registration"]}
                      value={formData.type}
                      onChange={(val) => setFormData({ ...formData, type: val })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-spp-navy/40 ml-1">Detailed Message</label>
                  <textarea 
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[24px] p-6 text-xs font-medium text-spp-navy outline-none resize-none hover:bg-slate-100 focus:border-neon-lime/30 transition-all" 
                    rows="4"
                    placeholder="Provide technical specifications or project overview..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {status && (
                  <div className={`p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {status.message}
                  </div>
                )}

                <button className={`group relative w-full bg-spp-navy text-white overflow-hidden py-5 md:py-6 rounded-2xl md:rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-2xl shadow-spp-navy/20 ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-neon-lime hover:text-spp-navy'}`} disabled={loading}>
                   <div className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? 'Transmitting Data...' : 'Initialize Uplink'}
                      {!loading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
                   </div>
                   {/* Shimmer Effect */}
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomSelect({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border-2 rounded-[20px] p-4 md:p-5 text-xs font-black text-spp-navy flex justify-between items-center cursor-pointer transition-all hover:bg-slate-100 ${isOpen ? 'border-neon-lime/30 shadow-lg' : 'border-transparent'}`}
      >
        <span className="uppercase tracking-tight">{value || "Select Type"}</span>
        <ChevronDown size={16} className={`text-spp-navy/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-neon-lime' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-[24px] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {options.map((option, i) => (
            <div 
              key={i}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`p-5 text-xs font-black uppercase tracking-tight cursor-pointer transition-all hover:bg-neon-lime/10 hover:text-spp-navy ${option === value ? 'bg-neon-lime/5 text-neon-lime' : 'text-spp-navy/60'}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-spp-navy/40 ml-1">{label}</label>
      <input 
        className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] p-4 md:p-5 text-xs font-bold text-spp-navy outline-none placeholder:text-spp-navy/20 hover:bg-slate-100 focus:border-neon-lime/30 transition-all uppercase"
        type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required
      />
    </div>
  );
}

function FooterRedesign() {
  return (
    <footer className="py-24 bg-white border-t border-solar-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2 space-y-10">
            <Link to="/" className="flex items-center no-underline">
              <img src="https://cdn.designfast.io/image/2026-04-13/480a1bd7-afbd-467c-9b31-3c3672fca814.png" alt="Swastik Logo" className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            <h4 className="text-4xl md:text-5xl font-black text-spp-navy leading-tight max-w-xs">
              Engineering <br />
              India's <br />
              Green Grid
            </h4>
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-spp-navy hover:bg-neon-lime transition-all cursor-pointer"><Sun size={16} /></div>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-spp-navy hover:bg-neon-lime transition-all cursor-pointer"><Mail size={16} /></div>
               <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-spp-navy hover:bg-neon-lime transition-all cursor-pointer"><Phone size={16} /></div>
            </div>
          </div>

          <FooterCol title="Navigation" links={[
            { label: "Home", href: "/" },
            { label: "Our Projects", href: "/projects" },
            { label: "Services", href: "/services" },
            { label: "Contact", href: "/contact" }
          ]} />
          <FooterCol title="Core Services" links={[
            { label: "Solar Energy", href: "/green-energy-solar" },
            { label: "Water Tanks", href: "/water-tanks" },
            { label: "Jeevan Mission", href: "/jal-jeevan-mission" },
            { label: "Wind Power", href: "/wind-power" }
          ]} />
          <FooterCol title="Resources" links={[
            { label: "Solar Portfolio", href: "/solutions" },
            { label: "Vendor Portal", href: "/login" },
            { label: "Registration", href: "/register" }
          ]} />
          <FooterCol title="Legal Protocol" links={[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/privacy" }
          ]} />
        </div>
        <div className="border-t border-solar-border pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[11px] font-bold text-spp-navy/30 uppercase tracking-widest">©2026 Swastik Power Pro Private Limited. All rights reserved.</p>
           <div className="flex gap-8 text-[11px] font-bold text-spp-navy/30 uppercase tracking-widest">
              <Link to="/privacy" className="hover:text-neon-lime transition-colors leading-none">Privacy Protection</Link>
              <Link to="/privacy" className="hover:text-neon-lime transition-colors leading-none">Legal Terms</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="space-y-8">
      <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-spp-navy/30">{title}</h5>
      <ul className="space-y-4">
        {links.map((l, i) => (
          <li key={i}>
            {l.href.startsWith('#') || l.href === '/' ? (
               <a href={l.href} className="text-sm font-bold text-spp-navy/60 hover:text-neon-lime transition-colors">{l.label}</a>
            ) : (
               <Link to={l.href} className="text-sm font-bold text-spp-navy/60 hover:text-neon-lime transition-colors">{l.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// LOGIN PAGE
function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error("[INDUSTRIAL-AUTH-ERROR]", err);
      const errorMsg = err.response?.data?.message || err.message;
      alert(`AUTH ERROR: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50 py-32 overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?q=80&w=2070&auto=format&fit=crop" 
          alt="Solar Landscape" 
          className="w-full h-full object-cover opacity-5 grayscale-[0.5]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-white">
        <div className="lg:w-[50%] relative h-80 lg:min-h-[600px]">
          <img 
            src="https://images.unsplash.com/photo-1668097613572-40b7c11c8727?q=80&w=870&auto=format&fit=crop" 
            alt="Infrastructure" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-spp-navy/60 via-transparent to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 p-12 space-y-4">
            <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
              Advancing <br />
              India's Solar <br />
              Future
            </h2>
          </div>
        </div>

        <div className="lg:w-[50%] p-12 lg:p-20 bg-white flex flex-col justify-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-spp-navy tracking-tight">Terminal Login</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Access the Swastik Industrial Control Hub</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Email Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-neon-lime transition-colors" size={20} />
                  <input 
                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-solar-border bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-neon-lime/10 focus:bg-white transition-all placeholder:text-slate-300 outline-none"
                    type="email" placeholder="name@terminal.access" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-widest text-slate-400 uppercase">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-neon-lime transition-colors" size={20} />
                  <input 
                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-solar-border bg-slate-50 text-slate-900 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-neon-lime/10 focus:bg-white transition-all placeholder:text-slate-300 outline-none"
                    type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-spp-navy text-white py-6 rounded-2xl font-black tracking-widest text-xs shadow-xl hover:bg-neon-lime hover:text-spp-navy transition-all duration-300 uppercase flex items-center justify-center gap-4 active:scale-95">
              Initialize Uplink <ArrowRight size={20} />
            </button>
          </form>
          
          <div className="text-center pt-8 border-t border-solar-border font-bold">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              New to the platform? <Link to="/register" className="text-neon-lime hover:underline underline-offset-4 ml-2">Register as a Partner</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * REUSABLE COMPONENT FOR SERVICE PROJECT PAGES
 */
function ServiceProjectLayout({ title, subtitle, phases, description }) {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-12">
          <div className="space-y-6 md:space-y-8 w-full">
             <Link to="/" className="inline-flex items-center gap-3 text-spp-navy/40 hover:text-spp-navy transition-colors font-bold text-[10px] md:text-[11px] uppercase tracking-widest px-4 py-2 border border-spp-navy/10 rounded-full w-fit">
                <ArrowRight size={14} className="rotate-180" /> Back to Terminal
             </Link>
             <div className="space-y-3 md:space-y-4">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-neon-lime">{subtitle}</p>
                <h1 className="text-5xl sm:text-6xl md:text-9xl font-black text-spp-navy leading-[0.9] tracking-tighter uppercase italic">
                   {title.split(' ')[0]} <br className="hidden md:block" /> {title.split(' ').slice(1).join(' ')}
                </h1>
             </div>
          </div>
          <p className="text-lg md:text-xl text-spp-navy/40 font-medium max-w-sm leading-relaxed text-left md:text-right uppercase tracking-tight">
             {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(350px,auto)]">
          {phases.map((phase, index) => (
            <div 
              key={index} 
              className={`p-6 sm:p-8 md:p-12 rounded-[30px] sm:rounded-[40px] md:rounded-[60px] flex flex-col justify-between shadow-2xl shadow-spp-navy/5 relative overflow-hidden group transition-all duration-700 hover:shadow-neon-lime/10 ${phase.span} ${phase.color} ${phase.textColor}`}
            >
              {phase.image && (
                <>
                  <div className="absolute inset-0 z-0 overflow-hidden transform group-hover:scale-110 transition-transform duration-1000 ease-out">
                    <img src={phase.image} className="w-full h-full object-cover filter brightness-[0.7] grayscale-[0.3] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" alt={phase.title} />
                  </div>
                  <div className={`absolute inset-0 z-[1] bg-gradient-to-t ${phase.textColor === 'text-white' ? 'from-spp-navy/80 via-spp-navy/30 to-transparent' : 'from-white/80 via-white/30 to-transparent'}`}></div>
                </>
              )}
              {!phase.image && (
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              )}
              <div className="relative z-10 space-y-6 md:space-y-8">
                <div className="flex flex-col gap-4 md:gap-6">
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl ${phase.highlight ? 'bg-spp-navy text-neon-lime' : 'bg-neon-lime text-spp-navy shadow-neon-lime/20'}`}>
                    {React.cloneElement(phase.icon, { size: window?.innerWidth < 768 ? 24 : 32 })}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-lime">{phase.id}</span>
                      <div className="h-px w-6 md:w-8 bg-neon-lime/30"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 block">{phase.timeline}</span>
                  </div>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-2xl sm:text-3xl md:text-5xl font-black leading-[1.1] md:leading-[1] uppercase italic tracking-tighter shadow-black">
                    {phase.title}
                  </h3>
                  <div className={`w-12 md:w-16 h-1 md:h-1.5 rounded-full ${phase.textColor === 'text-white' ? 'bg-neon-lime' : 'bg-spp-navy'}`}></div>
                </div>
                <ul className="space-y-4 md:space-y-5 pt-2 md:pt-4">
                  {phase.activities.map((activity, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 size={12} className="text-neon-lime mt-1 flex-shrink-0" />
                      <span className={`text-[12px] md:text-sm font-medium leading-relaxed ${phase.textColor === 'text-white' ? 'text-white/60' : 'text-spp-navy/60'}`}>
                        {activity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WaterTanks() {
  const phases = [
    {
       id: "MODULE 1",
       title: "Material Sourcing",
       timeline: "Infrastructure Protocol",
       icon: <ShieldCheck size={32} />,
       activities: [
         "Selection of high-grade industrial polymers",
         "Technical material integrity verification",
         "Anti-corrosive coating synchronization",
         "Quality assurance audit of raw materials"
       ],
       color: "bg-spp-navy",
       textColor: "text-white",
       span: "md:col-span-1"
    },
    {
       id: "MODULE 2",
       title: "Structural Foundation",
       timeline: "Phase Initiation",
       icon: <Hammer size={32} />,
       activities: [
         "Reinforced foundation base development",
         "Precision concrete casting and curing",
         "Load-bearing capacity synchronization",
         "Digital tracking of material deployment"
       ],
       color: "bg-slate-50",
       textColor: "text-spp-navy",
       span: "md:col-span-2",
       image: "https://images.unsplash.com/photo-1541888941259-77247c184675?q=80&w=2070&auto=format&fit=crop"
    },
    {
       id: "MODULE 3",
       title: "Mechanical Setup",
       timeline: "System Deployment",
       icon: <Settings size={32} />,
       activities: [
         "High-radius tank shell synchronization",
         "Mechanical joint & seal calibration",
         "Pipeline interconnect verification",
         "Secure mounting to foundation hub"
       ],
       color: "bg-spp-navy",
       textColor: "text-white",
       span: "md:col-span-2",
       image: "https://images.unsplash.com/photo-1590486803833-ffc6f08d533a?q=80&w=2070&auto=format&fit=crop"
    },
    {
       id: "MODULE 4",
       title: "Hydro Handover",
       timeline: "Operational Ready",
       icon: <BarChart size={32} />,
       highlight: true,
       activities: [
         "Pressure and volume technical verification",
         "Zero-leakage protocol synchronization",
         "Digital level telemetry integration",
         "Technical site handover protocol"
       ],
       color: "bg-neon-lime",
       textColor: "text-spp-navy",
       span: "md:col-span-1"
    }
  ];

  return <ServiceProjectLayout title="Water Infrastructure" subtitle="Industrial Storage" phases={phases} description="Precision-engineered storage solutions for strategic water management." />;
}

function WindPower() {
  const phases = [
    {
       id: "SYNCH 1",
       title: "Meteorological Survey",
       timeline: "Energy Analytics",
       icon: <Gauge size={32} />,
       activities: [
         "Site-specific velocity measurements",
         "Topographical wind flow modeling",
         "Grid impact technical assessment",
         "Environmental protocol verification"
       ],
       color: "bg-spp-navy",
       textColor: "text-white",
       span: "md:col-span-2",
       image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2072&auto=format&fit=crop"
    },
    {
       id: "SYNCH 2",
       title: "Infrastructure Hub",
       timeline: "Civil Engineering",
       icon: <Hammer size={32} />,
       activities: [
         "Reinforced steel base construction",
         "Substation hardware deployment",
         "Internal cabling & grid architecture",
         "Command unit structure setup"
       ],
       color: "bg-slate-50",
       textColor: "text-spp-navy",
       span: "md:col-span-1"
    },
    {
       id: "SYNCH 3",
       title: "Turbine Deployment",
       timeline: "Active Generation",
       icon: <Wind size={32} />,
       activities: [
         "Precision nacelle installation",
         "Blade assembly & hub synchronization",
         "Control system primary uplink",
         "Safety brake protocol testing"
       ],
       color: "bg-neon-lime",
       textColor: "text-spp-navy",
       span: "md:col-span-1"
    },
    {
       id: "SYNCH 4",
       title: "Grid Uplink",
       timeline: "Full Operational",
       icon: <Zap size={32} />,
       highlight: true,
       activities: [
         "High-voltage synchronization",
         "Digital frequency calibration",
         "Telemetry feedback initialization",
         "Regional load distribution"
       ],
       color: "bg-spp-navy",
       textColor: "text-white",
       span: "md:col-span-2",
       image: "/assets/wind_power_uplink.png"
    }
  ];

  return <ServiceProjectLayout title="Wind Infrastructure" subtitle="Renewable Energy" phases={phases} description="High-performance wind energy arrays engineered for sustainable grid stabilization." />;
}

export default App;
