import Link from "next/link";
import React, { useContext, useState, useRef } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineCaretUp } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { SiPastebin } from "react-icons/si";
import Modal from "./Modal";
import ModalConfirm from "./ModalConfirm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const bar = useRef<any>();
  const router = useRouter();
  const { jwt, user, logout } = useContext(UserContext);

  const closeOpenMenus = (e: Event) => {
    if (bar.current && toggle && !bar.current.contains(e.target)) {
      setToggle(false);
    }
  };

  if (typeof window !== "undefined") {
    document.addEventListener("mousedown", closeOpenMenus);
  }

  return (
    <>
      <nav className="flex justify-between items-center p-5 mb-5">
        <div className="text-2xl cursor-pointer flex gap-2 items-center">
          <Link href="/">
            <div className="flex font-poppins gap-2 items-center font-semibold text-2xl">
              <SiPastebin className="w-7 h-7" />
              Gistbin
            </div>
          </Link>
        </div>
        {jwt === "" && (
          <div className="flex lg:gap-6 gap-3 items-center">
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
        )}
        {jwt !== "" && (
          <div className="flex gap-1.5 md:gap-3 items-center relative">
            <div className="flex items-center justify-center md:w-10 w-7 md:h-10 h-7 text-sm md:text-base bg-black font-bold rounded-full">
              <p className="select-none">{user.username[0].toUpperCase()}</p>
            </div>
            <div className="">
              <div
                className="flex cursor-pointer items-center gap-1"
                onClick={() => setToggle((prev) => !prev)}
              >
                <p className="select-none">{user.username}</p>
                {!toggle ? <AiOutlineCaretDown /> : <AiOutlineCaretUp />}
              </div>

              {toggle && (
                <div
                  ref={bar}
                  className="font-semibold bg-slate-700 flex flex-col absolute p-3 py-5 z-50 rounded-md bg-opacity-80 top-14 right-0 mx-6 min-w-[170px] transition-all"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justce items-center gap-2 cursor-pointer list-none hover:bg-slate-900 px-3 py-2 rounded-md transition-all">
                      <SiPastebin />
                      <Link href="/gistbin/view">My Gistbins</Link>
                    </div>
                    <div
                      className="flex justce items-center gap-2 cursor-pointer list-none hover:bg-slate-900 px-3 py-2 rounded-md transition-all"
                      onClick={() => {
                        setIsOpen(true);
                        setToggle(false);
                      }}
                    >
                      <FiLogOut />
                      Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <ModalConfirm
        question="Are you sure you want to logout?"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        confirm="Logout"
        deny="Cancel"
        action={() => logout()}
      />
    </>
  );
};

export default Navbar;
