import Head from "next/head";
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/Navbar";
import Section from "../../components/Section";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";

import { IGistbin } from "../../utils/types";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";
import ModalConfirm from "../../components/ModalConfirm";
import { REACT_API_URL } from "../../utils/constants";

const GistbinPage = () => {
  const { jwt } = useContext(UserContext);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [gistbins, setGistbins] = useState<IGistbin[]>();
  const [gistbin, setGistbin] = useState<IGistbin>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (jwt) {
      headers.append("Authorization", "Bearer " + jwt);
    }
    fetch(`${REACT_API_URL}/v1/gistbins`, {
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          return new Error("Could not fetch");
        }
        return response.json();
      })
      .then((data) => {
        setGistbins(data.gistbins);
        setIsLoaded(true);
      })
      .catch((err) => console.log(err));
  }, [jwt]);

  const deleteHandler = () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (jwt) {
      headers.append("Authorization", "Bearer " + jwt);
    }

    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };

    fetch(`${REACT_API_URL}/v1/gistbin/delete/${gistbin?.id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.response) {
          setGistbins(gistbins?.filter((el) => el.id != gistbin?.id));
        }
      })
      .catch((err) => console.log(err));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-algo justify-center items-center">
        <p className="text-white">Loading...</p>;
      </div>
    );
  }

  return (
    <Section>
      <Head>
        <title>{`Gistbin | My Gistbins`}</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex flex-col w-[100%] xl:w-[70%] mx-auto justify-center p-5 mt-20">
        <h1 className="text-2xl font-bold mb-5">My Gistibins</h1>
        {!jwt && <p>You have to be signed in to save and view your gists</p>}
        <ul className="w-full bg-darkgray rounded-md overflow-hidden shadow-xl">
          {gistbins?.map((gistbin, index) => (
            <div
              key={gistbin.id}
              className={`py-3 px-5 w-full flex items-center justify-between font-semibold ${
                index !== gistbins.length - 1 && "border-b border-gray-500"
              } transition-all `}
            >
              <Link href={`/gistbin/${gistbin.id}`} className="cursor-pointer">
                <a>
                  <p className="hover:text-blue-400">{gistbin.title}</p>
                </a>
              </Link>
              <div className="flex gap-2 items-center">
                <Link href={`/gistbin/edit/${gistbin.id}`}>
                  <a>
                    <AiFillEdit className="w-6 h-6 text-blue-500" />
                  </a>
                </Link>
                <AiFillDelete
                  onClick={() => {
                    setGistbin(gistbin);
                    setIsDelete(true);
                  }}
                  className="w-6 h-6 text-red-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </ul>
      </div>
      <ModalConfirm
        question="Are you sure you want to delete?"
        open={isDelete}
        onClose={() => setIsDelete(false)}
        confirm="Delete"
        deny="Cancel"
        action={() => deleteHandler()}
      />
    </Section>
  );
};

export default GistbinPage;
