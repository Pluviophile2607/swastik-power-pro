import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  User, 
  Building2, 
  Banknote, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  HeadphonesIcon,
  Check,
  Calendar as CalendarIcon,
  Eye,
  EyeOff
} from 'lucide-react';

function VendorRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    registrationDate: '',
    businessType: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    password: '',
    confirmPassword: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: ''
    }
  });

  const [files, setFiles] = useState({
    gstCertificate: null,
    panCard: null
  });

  const [isEmailVerified, setIsEmailVerified] = useState(true); // Verification protocol bypassed per request
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const sendOtp = async () => {
    if (!formData.contactEmail) return alert("Please enter email protocol address.");
    setIsSendingOtp(true);
    try {
      await api.post('/auth/send-otp', { email: formData.contactEmail });
      setShowOtpField(true);
      alert("Verification protocol initiated. Check your terminal (console logs) for OTP.");
    } catch (err) {
      alert("Transmission failure: " + err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    try {
      await api.post('/auth/verify-otp', { email: formData.contactEmail, otp });
      setIsEmailVerified(true);
      setShowOtpField(false);
      alert("Identity synchronized. Access granted to next protocol stage.");
    } catch (err) {
      alert("Invalid verification protocol. Security breach averted.");
    }
  };

  const gstInputRef = useRef(null);
  const panInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const setDateValue = (date) => {
    setFormData({ ...formData, registrationDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // STEP 1 VALIDATION
    if (step === 1) {
      const requiredFields = ['companyName', 'address', 'contactName', 'contactEmail', 'contactPhone', 'password', 'confirmPassword'];
      for (const field of requiredFields) {
        if (!formData[field]) {
          alert(`Please complete the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} protocol.`);
          return;
        }
      }
      if (formData.password !== formData.confirmPassword) {
        alert("Security protocol failure: Passwords do not match!");
        return;
      }
      setStep(2);
      return;
    }

    // STEP 2 VALIDATION
    if (step === 2) {
      if (!formData.registrationDate || !formData.businessType) {
        alert("Compliance protocol failure: Registration date and business type are mandatory.");
        return;
      }
      setStep(3);
      return;
    }

    // STEP 3 VALIDATION
    if (step === 3) {
      const { accountName, accountNumber, ifscCode, bankName } = formData.bankDetails;
      if (!accountName || !accountNumber || !ifscCode || !bankName) {
        alert("Banking protocol failure: All fiscal identity fields are required.");
        return;
      }
      setStep(4);
      return;
    }

    // STEP 4 VALIDATION (Final Submit)
    if (step === 4) {
      if (!files.gstCertificate || !files.panCard) {
        alert("Document protocol failure: Both GST and PAN scans must be uploaded for verification.");
        return;
      }
    }

    const data = new FormData();
    // Append top-level fields
    data.append('name', formData.contactName);
    data.append('email', formData.contactEmail);
    data.append('password', formData.password);
    data.append('role', 'Vendor');

    // Append vendor profile data
    data.append('companyName', formData.companyName);
    data.append('gstNumber', formData.gstNumber);
    data.append('registrationLicenseId', formData.registrationDate);
    data.append('businessType', formData.businessType);
    data.append('address', formData.address);
    data.append('contactName', formData.contactName);
    data.append('contactEmail', formData.contactEmail);
    data.append('contactPhone', formData.contactPhone);
    data.append('bankDetails[accountName]', formData.bankDetails.accountName);
    data.append('bankDetails[accountNumber]', formData.bankDetails.accountNumber);
    data.append('bankDetails[ifscCode]', formData.bankDetails.ifscCode);
    data.append('bankDetails[bankName]', formData.bankDetails.bankName);

    // Append files
    if (files.gstCertificate) data.append('gstCertificate', files.gstCertificate);
    if (files.panCard) data.append('panCard', files.panCard);

    try {
      await api.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Registration successful! Please wait for Admin approval.');
      window.location.href = '/login';
    } catch (err) {
      console.error('[REGISTRATION ERROR]', err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failure in protocol uplink.';
      alert(errorMsg);
    }
  };

  const steps = [
    { title: 'ACCOUNT', icon: <User size={18} /> },
    { title: 'COMPANY', icon: <Building2 size={18} /> },
    { title: 'BANK', icon: <Banknote size={18} /> },
    { title: 'DOCUMENTS', icon: <FileText size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center py-12 px-6 font-sans">


      {/* Page Title */}
      <div className="text-center mb-12 mt-24">
        <h1 className="text-4xl font-extra-black text-spp-navy tracking-tight mb-3">Vendor Onboarding</h1>
        <p className="text-slate-500 font-medium">Join our ecosystem of Industrial renewable Infrastructure partners.</p>
      </div>

      {/* Modern Stepper */}
      <div className="w-full max-w-4xl mb-12 px-4">
        <div className="flex justify-between items-center relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-[2px] bg-spp-green transition-all duration-700 -z-10" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-3 group">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 font-black text-sm
                ${step === i + 1 ? 'bg-spp-navy text-white shadow-lg scale-110' : 
                  step > i + 1 ? 'bg-spp-green text-white shadow-md' : 
                  'bg-white text-slate-400 border-2 border-slate-200'}
              `}>
                {step > i + 1 ? <Check size={18} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black tracking-widest ${step >= i + 1 ? 'text-spp-navy' : 'text-slate-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,28,85,0.08)] border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Form Content */}
        <div className="flex-1 p-8 md:p-14 md:pr-10">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-spp-navy tracking-tight mb-2">Basic Account Information</h2>
                <p className="text-slate-400 text-sm font-medium">Please provide the primary contact details for your vendor account.</p>
              </div>

              <div className="space-y-6">
                <FormInput 
                  label="COMPANY NAME" name="companyName" placeholder="e.g. SolarTech Infrastructure Ltd" 
                  value={formData.companyName} onChange={handleChange} 
                  required
                />
                
                <FormInput 
                  label="REGISTERED OFFICE ADDRESS" name="address" placeholder="Street address, City, Postal Code" 
                  value={formData.address} onChange={handleChange} 
                  isTextArea
                  required
                />

                <FormInput 
                  label="CONTACT PERSON" name="contactName" placeholder="Full name of representative" 
                  value={formData.contactName} onChange={handleChange} 
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 relative">
                    <FormInput 
                      label="EMAIL ADDRESS" name="contactEmail" type="email" placeholder="contact@company.com" 
                      value={formData.contactEmail} onChange={handleChange} 
                      required
                    />
                  </div>
                  <FormInput 
                    label="PHONE NUMBER" name="contactPhone" type="tel" placeholder="+1 (555) 000-0000" 
                    value={formData.contactPhone} onChange={handleChange} 
                    required
                  />
                </div>

                {/* OTP Field hidden per request */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label="CREATE PASSWORD" name="password" type="password" placeholder="Min. 8 characters" 
                    value={formData.password} onChange={handleChange} 
                    required
                  />
                  <FormInput 
                    label="CONFIRM PASSWORD" name="confirmPassword" type="password" placeholder="Re-enter password" 
                    value={formData.confirmPassword} onChange={handleChange} 
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-spp-navy tracking-tight mb-2">Company Compliance</h2>
                  <p className="text-slate-400 text-sm font-medium">Official registration and tax identification details.</p>
                </div>
                <div className="space-y-6">
                  <FormInput label="GST NUMBER" name="gstNumber" placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={handleChange} />
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase ml-1">REGISTRATION DATE <span className="text-red-500">*</span></label>
                    <CustomDatePicker 
                      value={formData.registrationDate} 
                      onChange={setDateValue} 
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase ml-1">BUSINESS TYPE <span className="text-red-500">*</span></label>
                    <select 
                      name="businessType"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-spp-navy/10 font-bold text-spp-navy transition-all appearance-none cursor-pointer"
                      value={formData.businessType}
                      onChange={handleChange}
                    >
                      <option value="">Select Business Entity</option>
                      <option value="Proprietorship">Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="LLP">LLP</option>
                      <option value="Private Limited">Private Limited</option>
                    </select>
                  </div>
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-spp-navy tracking-tight mb-2">Banking Details</h2>
                  <p className="text-slate-400 text-sm font-medium">Secure banking information for your technology partner account.</p>
                </div>
                <div className="space-y-6">
                  <FormInput label="ACCOUNT HOLDER NAME" name="bankDetails.accountName" placeholder="Organization Account Name" value={formData.bankDetails.accountName} onChange={handleChange} required />
                  <FormInput label="ACCOUNT NUMBER" name="bankDetails.accountNumber" placeholder="Bank Account Number" value={formData.bankDetails.accountNumber} onChange={handleChange} required />
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput label="IFSC CODE" name="bankDetails.ifscCode" placeholder="HDFC000XXXX" value={formData.bankDetails.ifscCode} onChange={handleChange} required />
                    <FormInput label="BANK NAME" name="bankDetails.bankName" placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={handleChange} required />
                  </div>
                </div>
             </div>
          )}

          {step === 4 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-spp-navy tracking-tight mb-2">Document Compliance</h2>
                  <p className="text-slate-400 text-sm font-medium">Please upload the required verification documents.</p>
                </div>
                
                {/* Hidden File Inputs */}
                <input 
                  type="file" 
                  ref={gstInputRef} 
                  name="gstCertificate" 
                  accept=".png,.jpg,.jpeg,.pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  ref={panInputRef} 
                  name="panCard" 
                  accept=".png,.jpg,.jpeg,.pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div 
                    onClick={() => gstInputRef.current.click()}
                    className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 group hover:border-spp-navy/20 transition-all cursor-pointer overflow-hidden ${files.gstCertificate ? 'bg-green-50/50 border-green-200' : 'bg-slate-50/50 border-slate-100'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center transition-all ${files.gstCertificate ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 group-hover:text-spp-navy group-hover:shadow-md'}`}>
                      {files.gstCertificate ? <Check size={28} /> : <ShieldCheck size={28} />}
                    </div>
                    <div className="text-center group w-full px-2">
                      <p className={`text-[10px] font-black tracking-widest uppercase truncate max-w-full ${files.gstCertificate ? 'text-green-700' : 'text-spp-navy'}`}>
                        {files.gstCertificate ? files.gstCertificate.name : 'GST Certificate *'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tight">PNG, JPG, PDF (MAX 5MB)</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => panInputRef.current.click()}
                    className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 group hover:border-spp-navy/20 transition-all cursor-pointer overflow-hidden ${files.panCard ? 'bg-green-50/50 border-green-200' : 'bg-slate-50/50 border-slate-100'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center transition-all ${files.panCard ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 group-hover:text-spp-navy group-hover:shadow-md'}`}>
                      {files.panCard ? <Check size={28} /> : <FileText size={28} />}
                    </div>
                    <div className="text-center group w-full px-2">
                      <p className={`text-[10px] font-black tracking-widest uppercase truncate max-w-full ${files.panCard ? 'text-green-700' : 'text-spp-navy'}`}>
                        {files.panCard ? files.panCard.name : 'Pan Card Copy *'}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tight">PNG, JPG, PDF (MAX 2MB)</p>
                    </div>
                  </div>
                </div>
             </div>
          )}

          <div className="mt-12 flex flex-col md:flex-row gap-4 items-center">
            {step > 1 && (
              <button 
                type="button"
                onClick={() => setStep(step - 1)}
                className="w-full md:w-fit bg-slate-100 text-spp-navy px-10 py-5 rounded-2xl font-black tracking-tight text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <ChevronLeft size={18} /> Previous Protocol
              </button>
            )}
            <button 
              onClick={handleSubmit}
              className="w-full md:w-fit bg-spp-navy text-white px-10 py-5 rounded-2xl font-black tracking-tight text-sm shadow-xl shadow-spp-navy/10 hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-3 whitespace-nowrap"
            >
              {step === 4 ? 'Complete Registration' : step === 1 ? 'Next: Company Details' : step === 2 ? 'Next: Banking Details' : 'Next: Documents Upload'} <ArrowRight size={18} />
            </button>
            <Link to="/login" className="text-slate-400 text-xs font-bold hover:text-spp-navy transition-colors ml-auto">Already have an account? Login here</Link>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="md:w-[380px] bg-slate-50 p-8 md:p-12 border-l border-slate-100 flex flex-col gap-10">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
               <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-spp-navy tracking-tight mb-3">Trust & Compliance</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                By registering with Swastik Power Pro, you gain access to high-tier industrial projects across the global renewable sector. All data is handled with bank-grade encryption.
              </p>
            </div>
          </div>

          <div className="mt-auto bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                   <HeadphonesIcon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">Need Assistance?</p>
                  <h4 className="text-sm font-black text-spp-navy mb-1 uppercase tracking-tight">Priority Partner Support</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Available 24/7 for Onboarding</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl justify-between border-t border-slate-100 pt-8">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
           <Lock size={12} /> Secure SSL Encrypted Connection
        </div>
        <div className="flex items-center gap-6">
           <Link to="/privacy" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-spp-navy transition-colors">Privacy Policy</Link>
           <Link to="/privacy" className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-spp-navy transition-colors">Vendor Terms</Link>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, name, isTextArea, type, required, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group/field">
        {isTextArea ? (
          <textarea 
            name={name} rows="3" 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-spp-navy/10 font-bold text-spp-navy transition-all resize-none placeholder:text-slate-300"
            {...props}
          ></textarea>
        ) : (
          <>
            <input 
              name={name}
              type={inputType}
              className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-spp-navy/10 font-bold text-spp-navy transition-all placeholder:text-slate-300 ${isPassword ? 'pr-14' : ''}`}
              {...props} 
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-spp-navy transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CustomDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' or 'years'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef(null);
  const yearsRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selected.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleYearClick = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode('days');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (viewMode === 'years' && yearsRef.current) {
        const selectedYearBtn = yearsRef.current.querySelector('[data-selected="true"]');
        if (selectedYearBtn) {
            selectedYearBtn.scrollIntoView({ block: 'center' });
        }
    }
  }, [viewMode]);

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const firstDay = firstDayOfMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-full aspect-square"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
        const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i).toDateString();
        const isSelected = value === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i).toISOString().split('T')[0];
        
        days.push(
          <button
            key={i}
            onClick={() => handleDayClick(i)}
            type="button"
            className={`
              w-full aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all
              ${isSelected ? 'bg-spp-navy text-white shadow-lg' : 
                isToday ? 'bg-spp-green/10 text-spp-green border border-spp-green/20' : 
                'hover:bg-slate-50 text-slate-600 hover:text-spp-navy'}
            `}
          >
            {i}
          </button>
        );
    }
    return days;
  };

  const renderYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 50; y <= currentYear + 20; y++) {
      const isSelected = currentMonth.getFullYear() === y;
      years.push(
        <button
          key={y}
          data-selected={isSelected}
          onClick={() => handleYearClick(y)}
          type="button"
          className={`
            py-3 px-4 rounded-xl text-sm font-bold transition-all text-center
            ${isSelected ? 'bg-spp-navy text-white shadow-md' : 'hover:bg-slate-50 text-slate-600 hover:text-spp-navy'}
          `}
        >
          {y}
        </button>
      );
    }
    return years;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-spp-navy/10 font-bold text-spp-navy transition-all flex items-center justify-between text-left group"
      >
        <span className={value ? "text-spp-navy" : "text-slate-300"}>
          {value || "Select Registration Date"}
        </span>
        <CalendarIcon size={18} className="text-slate-300 group-hover:text-spp-navy transition-colors" />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-80 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,28,85,0.12)] p-6 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={viewMode === 'years'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-spp-navy transition-all disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
                type="button"
                onClick={() => setViewMode(viewMode === 'days' ? 'years' : 'days')}
                className="flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs font-black text-spp-navy tracking-tight hover:border-spp-navy/20 transition-all"
            >
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </button>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={viewMode === 'years'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-spp-navy transition-all disabled:opacity-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {viewMode === 'days' ? (
            <>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-[10px] font-black text-slate-300 uppercase text-center aspect-square flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>
            </>
          ) : (
            <div ref={yearsRef} className="grid grid-cols-3 gap-2 h-64 overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
               {renderYears()}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
             <button 
               type="button"
               onClick={() => {
                 const today = new Date();
                 const formattedToday = today.toISOString().split('T')[0];
                 onChange(formattedToday);
                 setCurrentMonth(today);
                 setViewMode('days');
                 setIsOpen(false);
               }}
               className="text-[10px] font-black text-spp-green uppercase tracking-widest hover:underline"
             >
               Today
             </button>
             <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-spp-navy"
             >
               Close
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorRegistration;
