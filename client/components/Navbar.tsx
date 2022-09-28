import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../context/UserContext";
import { AiOutlineCaretDown } from "react-icons/ai";
import { AiOutlineCaretUp } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { SiPastebin } from "react-icons/si";
import { BsBucket } from "react-icons/bs";
import Modal from "./Modal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const router = useRouter();
  const { jwt, user, logout } = useContext(UserContext);

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
          <div className="flex gap-6 items-center">
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
          <div className="flex gap-3 items-center relative">
            <div className="flex items-center justify-center w-10 h-10 bg-black font-bold rounded-full">
              U
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
                <div className="font-semibold bg-slate-700 flex flex-col absolute p-3 py-5 z-50 rounded-md bg-opacity-80 top-14 right-0 mx-6 min-w-[170px] transition-all">
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
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4">
          <h1 className="text-white font-bold text-center">
            Are you sure you want to log out
          </h1>
          <div className="flex my-10 mx-auto gap-8">
            <button
              className="px-10 py-3 bg-white rounded-md font-semibold text-algo"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Yes
            </button>
            <button
              className="px-10 py-3 bg-white rounded-md font-semibold text-algo "
              onClick={() => setIsOpen(false)}
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
