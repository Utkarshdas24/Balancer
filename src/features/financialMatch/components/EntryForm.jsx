/**
 * EntryPopup — Exact replica of LifeMilestoneRace IntroScreen popup.
 * White card, Bajaj-blue border, name/mobile validation, LMS submission.
 * Branding: "Bajaj Life Insurance".
 */
import { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';

const EntryPopup = memo(function EntryPopup({ onSubmit, onClose }) {
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(true);
    const [showTerms, setShowTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const phoneInputRef = useRef(null);

    const [lastSubmittedPhone, setLastSubmittedPhone] = useState(() => {
        return sessionStorage.getItem('bb_lastPhone') || null;
    });

    useEffect(() => {
        if (lastSubmittedPhone) {
            sessionStorage.setItem('bb_lastPhone', lastSubmittedPhone);
        }
    }, [lastSubmittedPhone]);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const validateField = (field, value) => {
        let msg = '';
        if (field === 'name') {
            if (!value.trim()) msg = 'Please enter your name';
            else if (!/^[A-Za-z\s]+$/.test(value.trim())) msg = 'Name must contain only letters.';
        } else if (field === 'phone') {
            if (!value) msg = 'Please enter mobile number';
            else if (!/^\d{10}$/.test(value)) msg = 'Enter a valid 10-digit mobile number';
        }
        if (msg) {
            setErrors((p) => ({ ...p, [field]: msg }));
            return false;
        } else {
            setErrors((p) => ({ ...p, [field]: '' }));
            return true;
        }
    };

    const validateForm = () => {
        return validateField('name', userName) & validateField('phone', phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!termsAccepted) return;

        if (lastSubmittedPhone === phone) {
            setToast({ message: 'You have already registered.', type: 'info' });
            setTimeout(() => onSubmit(userName.trim(), phone), 1000);
            return;
        }

        setIsSubmitting(true);
        try {
            setLastSubmittedPhone(phone);
            await onSubmit(userName.trim(), phone);
        } catch {
            setToast({ message: 'Something went wrong.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Entry Popup Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white shadow-2xl w-full max-w-[320px] min-[375px]:max-w-[340px] p-5 min-[375px]:p-6 border-[4px] sm:border-[6px] border-[#0066B2] rounded-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6" />
                    </button>

                    <div className="text-center mb-4 min-[375px]:mb-6">
                        <div className="w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 sm:w-20 sm:h-20 bg-[#0066B2] flex items-center justify-center mx-auto mb-3 min-[375px]:mb-4 shadow-xl border-4 border-white rounded-full">
                            <span className="text-2xl min-[375px]:text-3xl sm:text-4xl">👋</span>
                        </div>
                        <h2 className="text-[#0066B2] text-lg min-[375px]:text-xl sm:text-2xl font-black mb-1">Welcome!</h2>
                        <p className="text-slate-500 font-bold text-xs min-[375px]:text-sm sm:text-base">Enter your details to start.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 min-[375px]:space-y-4">
                        {/* Name */}
                        <div className="space-y-1 min-[375px]:space-y-1.5 text-left">
                            <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="bb-userName">
                                Your Name
                            </label>
                            <input
                                id="bb-userName"
                                type="text"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    if (/^[A-Za-z\s]*$/.test(e.target.value)) {
                                        setErrors((p) => ({ ...p, name: '' }));
                                    }
                                }}
                                onBlur={(e) => validateField('name', e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (validateField('name', userName)) phoneInputRef.current?.focus();
                                    }
                                }}
                                placeholder="Full Name"
                                autoFocus
                                className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1 min-[375px]:space-y-1.5 text-left">
                            <label className="block text-slate-700 text-[9px] min-[375px]:text-[10px] sm:text-xs font-black uppercase tracking-widest ml-1" htmlFor="bb-phone">
                                Mobile Number
                            </label>
                            <input
                                ref={phoneInputRef}
                                id="bb-phone"
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setPhone(val);
                                    setErrors((p) => ({ ...p, phone: '' }));
                                }}
                                onBlur={(e) => validateField('phone', e.target.value)}
                                placeholder="9876543210"
                                className={`w-full px-3 py-2.5 min-[375px]:px-4 min-[375px]:py-3 sm:py-3.5 border-4 ${errors.phone ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-100 focus:border-[#0066B2]'} focus:outline-none focus:ring-4 focus:ring-[#0066B2]/10 text-slate-800 font-bold text-sm min-[375px]:text-base sm:text-lg transition-all rounded-lg`}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-[9px] min-[375px]:text-[10px] font-black uppercase tracking-wider ml-1">{errors.phone}</p>
                            )}
                        </div>

                        {/* Terms */}
                        <div className="flex items-start space-x-3 pt-1 text-left">
                            <div className="relative flex items-center">
                                <input
                                    id="bb-terms"
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 bg-slate-50 transition-all checked:border-[#0066B2] checked:bg-[#0066B2] hover:border-[#0066B2]"
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={4} />
                            </div>
                            <label htmlFor="bb-terms" className="text-[10px] sm:text-xs font-semibold text-slate-500 leading-tight select-none">
                                I agree to the{' '}
                                <button type="button" onClick={() => setShowTerms(true)} className="text-[#0066B2] hover:underline font-bold inline">
                                    Terms &amp; Conditions
                                </button>{' '}
                                and Acknowledge the Privacy Policy.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={!userName.trim() || phone.length !== 10 || !termsAccepted || isSubmitting}
                            className="w-full py-2.5 min-[375px]:py-3 sm:py-4 rounded-xl font-game text-sm sm:text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-white uppercase font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: 'linear-gradient(135deg, #0066B2 0%, #3B82F6 100%)',
                                boxShadow: '0 4px 15px rgba(0, 102, 178, 0.3)',
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Starting...</span>
                                </>
                            ) : (
                                "Let's Go!"
                            )}
                        </button>
                    </form>
                </motion.div>
            </motion.div>

            {/* Terms Popup */}
            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
                        onClick={() => setShowTerms(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl border-4 border-[#0066B2] relative text-left"
                        >
                            <button
                                onClick={() => setShowTerms(false)}
                                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-[#0066B2] font-black text-lg uppercase mb-4 tracking-tight">Terms &amp; Conditions</h3>
                            <div className="text-xs sm:text-sm text-slate-600 space-y-3 font-medium leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <p>
                                    I hereby authorize Bajaj Life Insurance Limited to call me on the contact number made available by me on the website with a specific request to call back. I further declare that, irrespective of my contact number being registered on National Customer Preference Register (NCPR) or on National Do Not Call Registry (NDNC), any call made, SMS or WhatsApp sent in response to my request shall not be construed as an Unsolicited Commercial Communication even though the content of the call may be for the purposes of explaining various insurance products and services or solicitation and procurement of insurance business.
                                </p>
                                <p>Please refer to BALIC Privacy Policy.</p>
                            </div>
                            <button
                                onClick={() => { setShowTerms(false); setTermsAccepted(true); }}
                                className="w-full mt-6 py-3 bg-[#0066B2] text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm uppercase tracking-wider"
                            >
                                I Agree
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}
                    >
                        {toast.type === 'error' ? <X size={20} className="stroke-[3]" /> : <Check size={20} className="stroke-[3]" />}
                        <span className="font-bold text-sm">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});

EntryPopup.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default EntryPopup;
