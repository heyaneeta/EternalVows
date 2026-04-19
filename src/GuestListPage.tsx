import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Users } from 'lucide-react';

export default function GuestListPage({ adminData, onBack }: { adminData: any[], onBack: () => void }) {
  const attendingGuests = adminData.filter(d => d.status === 'yes');
  const totalCount = attendingGuests.reduce((sum, d) => sum + (Number(d.guestCount) || 0), 0);

  // Sort by timestamp (newest first) if available
  const sortedGuests = [...attendingGuests].sort((a, b) => {
    const timeA = a.timestamp?.toMillis?.() || 0;
    const timeB = b.timestamp?.toMillis?.() || 0;
    return timeB - timeA;
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 space-y-12 relative z-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[10px] text-gray-light uppercase tracking-widest hover:text-olive transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Invitation
      </button>

      <div className="text-center space-y-4">
        <h2 className="font-serif text-[42px] text-gray-dark mb-2 text-olive">Guest List</h2>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-olive/10 shadow-sm">
          <Users className="text-olive" size={20} />
          <span className="font-serif text-2xl text-gray-dark">{totalCount}</span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-light">Confirmed</span>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-olive/10 shadow-xl overflow-hidden backdrop-blur-sm">
        {sortedGuests.length === 0 ? (
          <div className="p-12 text-center text-gray-light italic font-serif text-lg">
            No RSVPs received yet. Check back soon.
          </div>
        ) : (
          <ul className="divide-y divide-olive/10">
            {sortedGuests.map((guest, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 flex justify-between items-center hover:bg-cream/30 transition-colors"
              >
                <div>
                  <p className="font-serif text-xl text-gray-dark">{guest.name}</p>
                  {guest.timestamp && (
                    <p className="text-[10px] uppercase tracking-widest text-gray-light/60 mt-1">
                      {new Date(guest.timestamp.toDate?.() || Date.now()).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="block font-serif text-2xl text-olive">{guest.guestCount}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-light">
                    {guest.guestCount > 1 ? 'Guests' : 'Guest'}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
