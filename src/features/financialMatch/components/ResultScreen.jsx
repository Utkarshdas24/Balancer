/**
 * ResultScreen — Exact Replica + Scrolling Fix.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Share2, RefreshCw, Calendar, X, ChevronDown } from 'lucide-react';
import { submitToLMS } from '../services/apiClient.js';
import Speedometer from './ScoreRing.jsx';
import Confetti from './Confetti.jsx';
import { TILE_META, BUCKET_MAX } from '../config/gameConfig.js';

const BUCKET_ORDER = ['GREEN', 'BLUE', 'YELLOW', 'RED'];

const ResultScreen = ({
    finalScore,
    buckets,
    userName,
    userPhone,
    onRestart,
    onBookSlot,
}) => {
    // Score handling
    const displayScore = finalScore || 0;

    const [showBooking, setShowBooking] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const [formData, setFormData] = useState({
        name: userName || '',
        mobile: userPhone || '',
        date: '',
        time: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Date Logic
    const today = new Date().toISOString().split("T")[0];
    const endOfYear = new Date(new Date().getFullYear(), 11, 31).toISOString().split("T")[0];

    // Form logic
    const updateField = (field, val) => {
        setFormData(p => ({ ...p, [field]: val }));
        if (errors[field]) setErrors(p => ({ ...p, [field]: null }));
    };

    const validate = () => {
        /* ... same validation ... */
        const errs = {};
        if (!formData.name.trim()) errs.name = "Name is required";
        else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) errs.name = "Invalid name";
        if (!formData.mobile) errs.mobile = "Mobile is required";
        else if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = "Invalid Mobile Number";
        if (!formData.date) errs.date = "Required";
        if (!formData.time) errs.time = "Required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            if (onBookSlot) {
                await onBookSlot(formData);
            }
            setShowBooking(false);
        } catch (err) {
            // Parent handles logging
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShare = async () => {
        const text = `I scored ${displayScore}/100 in Balance Builder! Check how prepared you are.`;
        if (navigator.share) {
            try { await navigator.share({ title: 'Balance Builder Score', text, url: window.location.href }); } catch { }
        } else {
            try { await navigator.clipboard.writeText(text + ' ' + window.location.href); } catch { }
        }
    };

    // Styling logic — Simplified Scrolling
    // Root is absolute/fixed filling parent. Overflow-y-auto guarantees scroll.
    const ghibliCardClass = "w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col items-center pt-4 pb-8 px-4";

    return (
        <div className={ghibliCardClass} style={{
            background: "linear-gradient(180deg, #00509E 0%, #003366 100%)"
        }}>
            <Confetti />

            {/* Top Right Share Icon (Fixed relative to viewport or scrolling container?) 
                If container scrolls, fixed might be better. 
            */}
            <button onClick={handleShare} className="fixed top-4 right-4 z-50 text-white/90 hover:text-white transition-opacity p-2 bg-black/10 rounded-full backdrop-blur-sm">
                <Share2 className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" strokeWidth={2.5} />
            </button>

            {/* Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center opacity-60 mix-blend-overlay"
                style={{ backgroundImage: 'linear-gradient(radial-gradient, circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)' }}>
            </div>

            {/* Content Container (Max width for desktop) */}
            <div className="relative z-10 w-full max-w-[500px] flex flex-col items-center shrink-0">

                {/* Header Section */}
                <div className="text-center mb-2 w-full">
                    <h1 className="text-base sm:text-lg md:text-xl font-medium text-white uppercase tracking-wide italic mb-1">
                        Hi <span className="ml-1 text-2xl sm:text-3xl md:text-4xl font-black">{userName || 'Player'}!</span>
                    </h1>
                    <h2 className="text-sm sm:text-base md:text-lg text-white uppercase tracking-wide italic mb-2 opacity-90">
                        Your <span className="font-black text-lg sm:text-xl text-[#FF8C00]">Balance Builder</span> score is
                    </h2>

                    {/* Speedometer */}
                    <div className="transform scale-90 sm:scale-100 mb-1 origin-top">
                        <Speedometer score={displayScore} />
                    </div>

                    {/* View Breakdown Button */}
                    <div className="flex justify-center -mt-8 mb-4 relative z-20">
                        <button
                            onClick={() => setShowBreakdown(true)}
                            className="text-white/80 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all shadow-lg"
                        >
                            View Breakdown <ChevronDown size={12} />
                        </button>
                    </div>

                    {/* Share Button (Pill - Below Speedometer) */}
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-[#FF8C00] to-[#FF7000] hover:from-[#FF7000] hover:to-[#E65C00] text-white font-black py-3 px-10 shadow-[0_4px_0_#993D00] active:translate-y-1 active:shadow-none transition-all flex items-center gap-3 text-sm sm:text-base border-2 border-white/20 uppercase tracking-widest rounded-full"
                        >
                            <Share2 className="w-5 h-5" /> SHARE SCORE
                        </button>
                    </div>
                </div>

                {/* CTA Card (White) */}
                <div className="w-full bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/50 mb-6 shrink-0 rounded-xl relative z-20">
                    <p className="text-slate-600 text-[11px] sm:text-sm font-bold text-center mb-4 leading-relaxed uppercase tracking-wide">
                        To know more, connect with our Relationship Manager.
                    </p>

                    {/* Call Action */}
                    <a href="tel:1800209999" className="block w-full mb-4">
                        <button className="w-full bg-[#0066B2] hover:bg-[#004C85] text-white font-black py-4 shadow-[0_4px_0_#00335C] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-sm sm:text-lg uppercase tracking-widest border-2 border-white/10 rounded-lg">
                            <Phone className="w-5 h-5" /> CALL NOW
                        </button>
                    </a>

                    <div className="relative py-2 mb-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[10px] sm:text-xs uppercase"><span className="px-4 bg-white text-slate-400 font-black tracking-widest">Or</span></div>
                    </div>

                    {/* Booking Trigger Button */}
                    <button
                        onClick={() => setShowBooking(true)}
                        className="w-full bg-[#FF8C00] hover:bg-[#FF7000] text-white font-black py-4 shadow-[0_4px_0_#993D00] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 text-sm sm:text-lg uppercase tracking-widest border-2 border-white/10 rounded-lg"
                    >
                        <Calendar className="w-5 h-5" /> BOOK A SLOT
                    </button>
                </div>

                {/* Restart Option */}
                <div className="shrink-0 text-center pb-8">
                    <button
                        onClick={onRestart}
                        className="text-blue-100/60 hover:text-white text-[11px] sm:text-sm font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 mx-auto drop-shadow-md hover:scale-105 active:scale-95"
                    >
                        <RefreshCw className="w-4 h-4" /> RETAKE QUIZ
                    </button>
                </div>

            </div>

            {/* Breakdown Modal */}
            <AnimatePresence>
                {showBreakdown && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 w-full max-w-sm shadow-2xl relative border-4 border-white/50 rounded-xl"
                        >
                            <button
                                onClick={() => setShowBreakdown(false)}
                                className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 transition-colors bg-slate-100 p-1 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-[#0066B2] font-black text-center mb-6 uppercase tracking-wider text-sm">Bucket Breakdown</h3>

                            <div className="grid grid-cols-2 gap-3">
                                {BUCKET_ORDER.map(type => {
                                    const meta = TILE_META[type];
                                    const val = buckets[type] || 0;
                                    const pct = Math.min(Math.round((val / BUCKET_MAX) * 100), 100);
                                    return (
                                        <div key={type} className="bg-slate-50 p-2 rounded-lg flex flex-col items-center border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: meta.color }}></div>
                                            <div className="w-6 h-6 rounded mb-1 shadow-sm" style={{ background: meta.bg }}></div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide text-center leading-tight mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{meta.label}</span>
                                            <span className="text-lg font-black text-slate-700">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBooking && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white p-6 w-full max-w-sm shadow-2xl relative border-4 border-white/50 rounded-xl"
                        >
                            <button
                                onClick={() => setShowBooking(false)}
                                className="absolute right-4 top-4 text-slate-300 hover:text-slate-500 transition-colors bg-slate-100 p-1 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-[#0066B2] font-black text-center mb-6 text-sm sm:text-base uppercase tracking-tight pt-2">Book a convenient slot</h2>

                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                                    <input
                                        value={formData.name} onChange={e => updateField('name', e.target.value)}
                                        className="w-full bg-slate-50 h-10 border-2 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold px-3 rounded"
                                        placeholder="Full Name"
                                    />
                                    {errors.name && <span className="text-[10px] text-red-500 ml-1 font-black uppercase tracking-wider">{errors.name}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                    <input
                                        value={formData.mobile}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            updateField('mobile', val);
                                        }}
                                        type="tel"
                                        className="w-full bg-slate-50 h-10 border-2 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold px-3 rounded"
                                        placeholder="9876543210"
                                    />
                                    {errors.mobile && <span className="text-[10px] text-red-500 ml-1 font-black uppercase tracking-wider">{errors.mobile}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Date</label>
                                        <input
                                            type="date"
                                            min={today}
                                            max={endOfYear}
                                            value={formData.date} onChange={e => updateField('date', e.target.value)}
                                            className="w-full bg-slate-50 h-10 border-2 border-slate-100 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 text-[10px] font-bold px-2 rounded"
                                        />
                                        {errors.date && <span className="text-[10px] text-red-500 ml-1 font-black uppercase tracking-wider">{errors.date}</span>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Time</label>
                                        <select
                                            value={formData.time}
                                            onChange={e => updateField('time', e.target.value)}
                                            className="w-full bg-slate-50 h-10 border-2 border-slate-100 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 text-[10px] font-bold px-2 appearance-none rounded"
                                        >
                                            <option value="">Select</option>
                                            {[...Array(12)].map((_, i) => {
                                                const start = 9 + i;
                                                const end = start + 1;
                                                const formatTime = (h) => {
                                                    const amp = h >= 12 ? 'PM' : 'AM';
                                                    const hour = h > 12 ? h - 12 : h;
                                                    return `${hour}:00 ${amp}`;
                                                };
                                                const label = `${formatTime(start)} - ${formatTime(end)}`;
                                                return <option key={start} value={label}>{label}</option>;
                                            })}
                                        </select>
                                        {errors.time && <span className="text-[10px] text-red-500 ml-1 font-black uppercase tracking-wider">{errors.time}</span>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#FF8C00] hover:bg-[#FF7000] text-white font-black py-4 shadow-[0_4px_0_#993D00] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-xs mt-3 border-2 border-white/20 rounded-lg"
                                >
                                    {isSubmitting ? 'Confirming...' : 'Book a Slot'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResultScreen;
