/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './lib/firebase';
import { collection, addDoc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore';
import { MapPin, ChevronDown } from 'lucide-react';
import RSVPPage from './RSVPPage';
import RegretPage from './RegretPage';
import ThankYouPage from './ThankYouPage';
import GuestListPage from './GuestListPage';
import { FloatingFloralBackground } from './components/FloatingFloralBackground';

const WEDDING_DATE = new Date('2026-05-24T16:00:00');

export default function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [rsvpStatus, setRsvpStatus] = useState<'yes' | 'no' | null>(() => {
    const saved = localStorage.getItem('wedding_rsvp_status');
    return (saved === 'yes' || saved === 'no') ? saved : null;
  });
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminData, setAdminData] = useState<any[]>([]);
  const [hasOpened, setHasOpened] = useState(false);
  const [isInvitationReady, setIsInvitationReady] = useState(false);
  const [hasVisitedOtherPage, setHasVisitedOtherPage] = useState(false);
  const [showScrollArrow, setShowScrollArrow] = useState(false);

  // Sync state with URL but allow manual state updates
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync RSVP selection to local storage
  useEffect(() => {
    if (rsvpStatus) {
      localStorage.setItem('wedding_rsvp_status', rsvpStatus);
    }
  }, [rsvpStatus]);

  const isExpired = new Date() > WEDDING_DATE;

  // Auto-redirect after animation and message
  useEffect(() => {
    if (isInvitationReady) {
      const timer = setTimeout(() => {
        setHasOpened(true);
      }, 2000); // Show "You are invited" for 2 seconds before moving
      return () => clearTimeout(timer);
    }
  }, [isInvitationReady]);

  const navigate = (path: string, searchParams?: Record<string, string>) => {
    const url = new URL(path, window.location.origin);
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    window.history.pushState({}, '', url.toString());
    setCurrentPath(path);
    if (path !== '/') {
      setHasVisitedOtherPage(true);
    }
  };

  useEffect(() => {
    if (hasOpened && currentPath === '/') {
      const timer = setTimeout(() => setShowScrollArrow(true), 6000);
      return () => clearTimeout(timer);
    } else {
      setShowScrollArrow(false);
    }
  }, [hasOpened, currentPath]);

  const handleRSVP = (status: 'yes' | 'no') => {
    setRsvpStatus(status);
    if (status === 'yes') {
      navigate('/rsvp');
    } else if (status === 'no') {
      saveRSVP('Regret', 0, 'no').catch(console.error);
      navigate('/regret');
    }
  };

  function getTimeLeft() {
    const now = new Date();
    const difference = WEDDING_DATE.getTime() - now.getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveRSVP = async (name: string, guests: number, status: 'yes' | 'no') => {
    await addDoc(collection(db, 'rsvps'), {
      name,
      guestCount: guests,
      status,
      timestamp: serverTimestamp(),
    });
  };

  // Real-time synchronization of admin data
  useEffect(() => {
    const q = query(collection(db, 'rsvps'), where('status', 'in', ['yes', 'no']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAdminData(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-cream relative overflow-x-hidden">
      <FloatingFloralBackground />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Intro Overlay */}
        <AnimatePresence>
          {!hasOpened && currentPath === '/' && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-cream flex flex-col items-center justify-center p-8 overflow-hidden"
            >
              {/* Background Elements */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 2 }}
                className="absolute inset-0 flex items-center justify-center -z-10"
              >
                <div className="w-[80vw] h-[80vw] border-[20px] border-olive rounded-full blur-3xl" />
              </motion.div>

              <div className="text-center max-w-sm w-full space-y-12 relative flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5 }}
                  className="w-48 h-48 relative"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full text-olive">
                    {/* Petals */}
                    <motion.path
                      d="M50,48 Q42,32 50,22 Q58,32 50,48"
                      fill="none" stroke="currentColor" strokeWidth="0.8"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <motion.path
                      d="M50,48 Q32,35 38,27 Q48,34 50,48"
                      fill="none" stroke="currentColor" strokeWidth="0.8"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                    />
                    <motion.path
                      d="M50,48 Q68,35 62,27 Q52,34 50,48"
                      fill="none" stroke="currentColor" strokeWidth="0.8"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 1 }}
                    />

                    {/* Horizontal Flourishes */}
                    <motion.path
                      d="M45,46 C35,46 25,48 15,38"
                      fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.5 }}
                    />
                    <motion.path
                      d="M55,46 C65,46 75,48 85,38"
                      fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.5 }}
                    />

                    {/* Decorative Swirls */}
                    <motion.path
                      d="M48,50 C40,55 35,55 32,50 C30,45 40,45 48,50"
                      fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 2.2 }}
                    />
                    <motion.path
                      d="M52,50 C60,55 65,55 68,50 C70,45 60,45 52,50"
                      fill="none" stroke="currentColor" strokeWidth="0.5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 2.5 }}
                    />

                    {/* Diamond */}
                    <motion.path
                      d="M50,68 L53,74 L50,80 L47,74 Z"
                      fill="none" stroke="currentColor" strokeWidth="0.8"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 3 }}
                    />

                    {/* Vertical Dots */}
                    {[
                      { x: 50, y: 12, delay: 3.5 }, { x: 50, y: 15, delay: 3.7 }, { x: 50, y: 18, delay: 3.9 },
                      { x: 50, y: 52, delay: 2 },
                      { x: 50, y: 88, delay: 4.1 }, { x: 50, y: 91, delay: 4.3 }, { x: 50, y: 94, delay: 4.5 }
                    ].map((dot, index, array) => (
                      <motion.circle
                        key={index}
                        cx={dot.x} cy={dot.y} r="0.8"
                        fill="currentColor"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: dot.delay, duration: 0.3 }}
                        onAnimationComplete={() => {
                          if (index === array.length - 1) {
                            setTimeout(() => setIsInvitationReady(true), 500);
                          }
                        }}
                      />
                    ))}
                  </svg>
                </motion.div>

                <AnimatePresence>
                  {isInvitationReady && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <h2 className="font-serif text-3xl text-olive tracking-wider mb-2">You are invited</h2>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-px bg-olive/20 mx-auto"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-64 h-64 border-t-2 border-l-2 border-olive/10 rounded-tl-[100px] -m-10" />
              <div className="absolute bottom-0 right-0 w-64 h-64 border-b-2 border-r-2 border-olive/10 rounded-br-[100px] -m-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {isExpired ? (
          <div className="w-full max-w-lg mx-auto py-12 px-4 relative z-10 flex items-center justify-center min-h-[50vh]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-10 md:p-14 text-center border border-olive/10 shadow-xl w-full"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-gray-dark mb-4 leading-relaxed">
                Oops… invitation expired!
              </h2>
              <p className="font-sans text-gray-light text-base md:text-lg leading-relaxed italic">
                We truly missed you on our special day 💖
              </p>
            </motion.div>
          </div>
        ) : currentPath === '/rsvp' ? (
          <RSVPPage onComplete={(name) => navigate('/thank-you', { name })} />
        ) : currentPath === '/regret' ? (
          <RegretPage onBack={() => navigate('/')} />
        ) : currentPath === '/thank-you' ? (
          <ThankYouPage onBack={() => navigate('/')} />
        ) : currentPath === '/guests' ? (
          <GuestListPage adminData={adminData} onBack={() => navigate('/')} />
        ) : (
          <div className="w-full max-w-4xl mx-auto py-12 px-4 space-y-24">
          {/* Header/Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8 relative"
          >
            <div className="relative inline-block">
              {hasVisitedOtherPage && (
                <span className="font-cursive text-7xl md:text-9xl text-olive/40 absolute -top-12 -left-8 -z-10 select-none">Forever</span>
              )}
              <h1 className="font-display text-6xl md:text-8xl text-gray-dark tracking-tight relative z-10">
                Maya <span className="text-olive font-cursive lowercase">&</span> Bimal
              </h1>
            </div>
            <div className="flex flex-col items-center space-y-6">
              <div className="w-px h-16 bg-olive/20" />
              <div className="space-y-4">
                <p className="font-serif text-xl md:text-2xl text-gray-light italic tracking-wide">
                  Are getting married
                </p>
                <p className="font-serif text-lg md:text-xl text-gray-dark italic leading-relaxed">
                  With the blessings of our families,<br />
                  we invite you to celebrate our wedding day.
                </p>
              </div>
            </div>
            
            {showScrollArrow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-olive/50 flex flex-col items-center gap-1 cursor-pointer transition-colors hover:text-olive"
                onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
              >
                <span className="text-[9px] uppercase tracking-[0.3em] font-medium">Scroll</span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown size={18} strokeWidth={1.5} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Date & Details (Centered) */}
          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-md w-full space-y-12 text-center"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.4em] text-olive font-bold">The Date</span>
                <h3 className="font-display text-5xl text-gray-dark">May 24, 2026</h3>
                <p className="font-serif text-lg text-gray-light italic">Sunday Morning</p>
                <p className="font-sans text-sm text-olive uppercase font-bold tracking-[0.2em] mt-1">10:30 am — 11:00 am</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-[40px] border border-olive/10 shadow-sm">
                  <MapPin className="text-olive" size={32} />
                  <div>
                    <h4 className="font-bold text-gray-dark uppercase tracking-wider text-sm mb-1">Parvathy Auditorium</h4>
                    <p className="text-gray-light text-sm">Chandhranagar, Palakkad</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Parvathy+Auditorium,+Chandranagar,+Palakkad" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-olive uppercase font-bold tracking-widest mt-4 inline-block border-b border-olive/30 pb-0.5 hover:border-olive transition-colors"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>

              {/* Countdown Embedded */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds },
                ].map(t => (
                  <div key={t.label} className="text-center p-4 bg-cream/50 rounded-3xl border border-olive/5">
                    <span className="block text-4xl md:text-5xl font-serif text-olive">{t.value}</span>
                    <span className="block text-xs md:text-sm uppercase tracking-widest text-gray-dark font-extrabold mt-2">{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RSVP Section (Pinteresty loving card) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[60px] p-12 md:p-20 text-center shadow-xl border border-olive/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage/20 via-olive/20 to-sage/20" />
            
            <div className="max-w-md mx-auto space-y-10">
              {!rsvpStatus ? (
                <>
                  <div className="space-y-4">
                    <h2 className="font-display text-2xl md:text-3xl text-gray-dark italic leading-tight">
                      We can't wait to celebrate this new beginning with you. Let us know if you'll be joining?
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                      onClick={() => handleRSVP('yes')} 
                      className="px-10 py-5 bg-olive text-white rounded-full text-xs font-bold uppercase tracking-[3px] transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
                    >
                      I'll be there
                    </button>
                    <button 
                      onClick={() => handleRSVP('no')} 
                      className="px-10 py-5 bg-white border-2 border-olive/20 text-olive rounded-full text-xs font-bold uppercase tracking-[3px] transition-all hover:bg-olive hover:text-white hover:border-olive"
                    >
                      Regretfully Decline
                    </button>
                  </div>
                </>
              ) : (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-olive font-cursive text-3xl"
                >
                  {rsvpStatus === 'yes' ? 'We can\'t wait to see you! ✨' : 'We understand. 💖'}
                </motion.p>
              )}
            </div>

            {/* Subtle background SVG flourishes would go here */}
          </motion.div>

          <footer className="text-center pt-12 pb-6">
            <button 
              className="text-[10px] text-gray-light/50 uppercase tracking-[4px] hover:text-olive transition-colors"
              onClick={() => navigate('/guests')}
            >
              Guest List: {adminData.filter(d => d.status === 'yes').reduce((sum, d) => sum + (Number(d.guestCount) || 0), 0)} Confirmed
            </button>
          </footer>
        </div>
      )}
    </div>
  </div>
  );
}
