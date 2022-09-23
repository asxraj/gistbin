import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center p-5 mb-5">
      <div className="text-lg font-bold">
        <Link href="/">Gistbin</Link>
      </div>
      <div className="flex gap-6">
        <button
          className={`px-5 py-2 border-2 ${
            router.pathname === "/login" ? "hidden" : ""
          }`}
        >
          <Link href="/login">Login</Link>
        </button>

        <button
          className={`px-5 py-2 border-2 ${
            router.pathname === "/signup" ? "hidden" : ""
          }`}
        >
          <Link href="/signup">Signup</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
