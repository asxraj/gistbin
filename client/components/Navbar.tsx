import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between p-5 bg-blue-600">
      <h1 className="text-lg font-bold">Gistbin</h1>
      <ul className="flex gap-4">
        <li>login</li>
        <li>signup</li>
      </ul>
    </nav>
  );
};

export default Navbar;
