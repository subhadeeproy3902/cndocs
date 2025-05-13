import React from 'react';

const GradientBlur: React.FC = () => {
  return (
    <div className="absolute top-0 inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Top left blur */}
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-transparent rounded-full blur-[100px] opacity-50" />

      {/* Top right blur */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-gradient-to-bl from-lime-500/30 via-green-500/20 to-transparent rounded-full blur-[100px] opacity-50" />

      {/* Bottom left blur */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-500/20 via-green-500/10 to-transparent rounded-full blur-[80px] opacity-30" />
    </div>
  );
};

export default GradientBlur;
