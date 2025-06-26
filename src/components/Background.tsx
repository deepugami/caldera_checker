import React from 'react';

const Background: React.FC = () => {
  return (
    <>
      {/* Main gradient background */}
      <div className="fixed inset-0 z-[-10] bg-gradient-to-br from-orange-500 via-red-600 to-black transform scale-110 blur-[30px]" />
      
      {/* Noise overlay */}
      <div 
        className="fixed inset-0 z-[-9] opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px'
        }}
      />
      
      {/* Content overlay to ensure readability */}
      <div className="fixed inset-0 z-[-8] bg-black/10" />
    </>
  );
};

export default Background;
