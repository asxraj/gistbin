import React from "react";

const Section = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-algo text-white min-h-screen">
      <div className="w-[100%] md:w-[90%] lg:w-[70%] m-auto">{children}</div>
    </div>
  );
};

export default Section;
