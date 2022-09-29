import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Section from "../../components/Section";
import { humanDate, expiresDays } from "../../utils/utils";

import { IGistbin } from "../../utils/types";
import Link from "next/link";

const GistbinPage = () => {
  const [gistbins, setGistbins] = useState<IGistbin[]>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetch(`http://localhost:4000/v1/gistbins`)
      .then((response) => {
        if (!response.ok) {
          return new Error("Could not fetch");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setGistbins(data.gistbins);
        setIsLoaded(true);
      });
  }, []);

  if (!isLoaded) {
    return <p>Loading...</p>;
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
        <ul className="w-full bg-darkgray rounded-md overflow-hidden shadow-xl">
          {gistbins?.map((gistbin, index) => (
            <Link href={`/gistbin/${gistbin.id}`} key={gistbin.id}>
              <a>
                <div
                  className={`py-3 px-5 w-full ${
                    index !== gistbins.length - 1 && "border-b border-gray-500"
                  } transition-all hover:bg-gray-400 hover:text-darkgray cursor-pointer`}
                >
                  {gistbin.title}
                </div>
              </a>
            </Link>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default GistbinPage;
