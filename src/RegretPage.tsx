import React from 'react';

export default function RegretPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-sm border border-border p-12 text-center">
        <h2 className="font-serif text-[32px] text-gray-dark mb-6">We're sorry you can't make it</h2>
        <p className="text-olive italic font-serif text-lg mb-8">Thank you for letting us know! 💖</p>
        
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
