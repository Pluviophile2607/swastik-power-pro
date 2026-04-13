import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, Send, MessageSquare } from 'lucide-react';
import api from '../services/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        type: 'General Inquiry'
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Combine names for existing backend structure if necessary
            const payload = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
            };
            await api.post('/inquiries', payload);
            setStatus({ type: 'success', message: 'Message sent successfully.' });
            setFormData({ firstName: '', lastName: '', email: '', message: '', type: 'General Inquiry' });
            setTimeout(() => setStatus(null), 5000);
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
            setTimeout(() => setStatus(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] pt-32 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                
                {/* LEFT CONTENT */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-10"
                >
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-spp-navy leading-[1.1]">
                            Get in —<br />
                            <span className="font-bold">touch with us</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                            We're here to help! Whether you have a question about our industrial services, need project assistance, or want to provide feedback, our team is ready to assist you.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-400">Email:</p>
                            <a href="mailto:swastikpowerpro369@gmail.com" className="text-2xl font-bold text-spp-navy hover:text-neon-lime transition-colors">swastikpowerpro369@gmail.com</a>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-400">Phone:</p>
                            <p className="text-2xl font-bold text-spp-navy">+91 70077 42635</p>
                            <p className="text-xs text-slate-400 font-medium">Available Monday to Friday, 9 AM - 6 PM IST</p>
                        </div>
                    </div>

                </motion.div>

                {/* RIGHT FORM CARD */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white rounded-[50px] p-8 md:p-14 shadow-2xl shadow-black/5 border border-white/40"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl text-center text-xs font-bold uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}
                            >
                                {status.message}
                            </motion.div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 ml-1">First Name</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Enter your first name..."
                                    className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-spp-navy placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-500 ml-1">Last Name</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Enter your last name..."
                                    className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-spp-navy placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 ml-1">Email</label>
                            <input 
                                required
                                type="email" 
                                placeholder="Enter your email address..."
                                className="w-full bg-[#f9f9f9] border-none rounded-2xl px-6 py-4 text-spp-navy placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 ml-1">How can we help you?</label>
                            <textarea 
                                required
                                rows={5} 
                                placeholder="Enter your message..."
                                className="w-full bg-[#f9f9f9] border-none rounded-[2rem] px-8 py-6 text-spp-navy placeholder:text-slate-300 focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="bg-black text-white px-10 py-5 rounded-full font-bold flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-2xl shadow-black/10 disabled:opacity-50"
                            >
                                <span className="text-sm uppercase tracking-widest">{loading ? 'Sending...' : 'Send Message'}</span>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors">
                                    <Send size={16} />
                                </div>
                            </button>
                        </div>
                    </form>
                </motion.div>

            </div>
        </div>
    );
};

export default ContactPage;
