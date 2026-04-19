import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ExternalLink } from 'lucide-react';

export default function ThankYouPage({ onBack }: { onBack: () => void }) {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name') || 'Guest';

  const handleOpenMaps = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=Parvathy+Auditorium,+Chandranagar,+Palakkad', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden text-center">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-sm border border-border p-12 relative z-10">
        <h2 className="font-serif text-[38px] text-gray-dark mb-4 leading-tight">We can't wait to celebrate with you!</h2>
        <p className="text-olive italic font-serif text-[28px] mb-8">{name}</p>
        
        <div className="border-t border-b border-border py-8 mb-8">
          <p className="text-xs font-bold text-gray-light uppercase tracking-[0.2em] mb-3 leading-relaxed">Venue</p>
          <h3 className="text-xl font-bold text-gray-dark uppercase tracking-[0.1em] mb-4">Parvathy Auditorium</h3>
          <div className="flex items-center justify-center gap-2 text-gray-light mb-6">
            <MapPin size={16} className="text-olive" />
            <span className="text-sm font-medium tracking-wide">Chandhranagar, Palakkad</span>
          </div>
          
          <button 
            onClick={handleOpenMaps}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-white border border-olive text-olive rounded-full text-sm font-bold uppercase tracking-widest hover:bg-olive hover:text-white transition-all duration-300"
          >
            Click here for location <ExternalLink size={14} />
          </button>
        </div>
        
        <button 
          onClick={onBack}
          className="text-[10px] text-gray-light uppercase tracking-widest hover:text-olive transition-colors"
        >
          Back to Invitation
        </button>
      </div>
    </div>
  );
}
