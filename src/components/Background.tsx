import React from 'react';

const Background: React.FC = () => {
  return (
    <>
      {/* Main gradient background - completely fixed during scroll */}
      <div className="fixed inset-0 z-[-10] bg-gradient-to-br from-orange-500 via-red-600 to-black transform scale-110 blur-[30px] fixed-background" 
           style={{ 
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100vw',
             height: '100vh',
             backgroundAttachment: 'fixed'
           }} />
      
      {/* Noise overlay - completely fixed during scroll */}
      <div 
        className="fixed inset-0 z-[-9] opacity-20 mix-blend-overlay fixed-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content overlay to ensure readability - completely fixed during scroll */}
      <div className="fixed inset-0 z-[-8] bg-black/10 fixed-background" 
           style={{ 
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100vw',
             height: '100vh',
             backgroundAttachment: 'fixed'
           }} />
    </>
  );
};

export default Background;
