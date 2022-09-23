import React from "react";

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="w-[70%] m-auto">{children}</div>
    </div>
  );
};

export default Section;
