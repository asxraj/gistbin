import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center p-5 mb-5">
      <div className="text-2xl font-bold tracking-wide">
        <Link href="/">Gistbin</Link>
      </div>
      <div className="flex gap-6">
        <Link href="/login" className="">
          <a
            className={`btn-secondary ${
              router.pathname === "/login" ? "hidden" : ""
            }`}
          >
            Login
          </a>
        </Link>

        <Link href="/signup">
          <a
            className={`btn-secondary ${
              router.pathname === "/signup" ? "hidden" : ""
            }`}
          >
            Signup
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
