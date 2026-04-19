import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function RSVPPage({ onComplete }: { onComplete: (name: string) => void }) {
  const [formData, setFormData] = useState({ name: '', guests: 1 });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmAndSubmit = async () => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'rsvps'), {
        name: formData.name,
        guestCount: formData.guests,
        status: 'yes',
        timestamp: serverTimestamp(),
      });
      
      // Fire confetti poppers!
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B8D72', '#E8E4D9', '#D1C8B4', '#555555']
      });

      // Delay transition slightly to let the poppers be seen
      setTimeout(() => {
        onComplete(formData.name);
      }, 500);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-sm border border-border p-12 relative z-10">
        <form onSubmit={handleSubmitClick}>
          <h2 className="font-serif text-[42px] text-gray-dark mb-2 text-center text-olive">Lovely!</h2>
          <p className="text-gray-light mb-8 text-center text-sm font-medium uppercase tracking-widest leading-relaxed">Be part of our special day — let us know below 💕</p>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-[13px] font-serif text-gray-dark mb-2 ml-1">Name</label>
              <input required type="text" placeholder="Type your name..." className="p-4 border border-border rounded-xl text-sm w-full bg-cream/30 focus:outline-none focus:ring-1 focus:ring-olive" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-[13px] font-serif text-gray-dark leading-relaxed mb-2 ml-1">
                How many guests will be attending including yourself?
              </label>
              <input required type="number" min="1" placeholder="Number of Guests" className="p-4 border border-border rounded-xl text-sm w-full bg-cream/30 focus:outline-none focus:ring-1 focus:ring-olive" onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})} />
            </div>
            <button type="submit" className="w-full px-6 py-4 bg-olive text-white rounded-full text-sm font-bold uppercase tracking-widest transition hover:shadow-xl hover:-translate-y-1">Submit RSVP</button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-dark/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setShowConfirmation(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full relative z-10 text-center border border-border"
          >
            <h3 className="font-serif text-2xl text-gray-dark mb-4">Almost there!</h3>
            <p className="text-gray-light text-sm mb-8 leading-relaxed">
              Are you sure you want to submit your RSVP with <span className="font-bold text-olive">{formData.guests}</span> guests?
            </p>
            <div className="flex gap-4">
              <button 
                disabled={isSubmitting}
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border border-border text-gray-light rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                onClick={confirmAndSubmit}
                className="flex-1 px-4 py-3 bg-olive text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-olive-dark shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
