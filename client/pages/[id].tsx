import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import { humanDate, expiresDays } from "../utils/utils";

interface IGistbin {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
  expires: string;
}

const GistbinPage = () => {
  const [gistbin, setGistbin] = useState<IGistbin>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/v1/gistbin/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setIsLoaded(true);
        if (data.gistbin) {
          data.gistbin.created_at = humanDate(data.gistbin.created_at);
          data.gistbin.expires = expiresDays(data.gistbin.expires);
          setGistbin(data.gistbin);
        }
      });
  }, [id]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <Section>
      <Head>
        <title>{`Gistbin | ${id}`}</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="flex justify-center mt-10">
        <div className="flex flex-col border-2 border-white w-[70%] shadow-2xl  ">
          <div className="flex justify-between p-4 bg-slate-500">
            <p className="">TITLE: {gistbin?.title}</p>
            <p className="">CATEGORY: {gistbin?.category}</p>
          </div>
          <div className="bg-slate-900 p-4">
            <pre className="text-sm">{gistbin?.content}</pre>
          </div>
          <div className="flex justify-between p-4 bg-slate-500">
            <p>CREATED: {gistbin?.created_at}</p>
            <p>EXPIRES IN {gistbin?.expires} DAYS</p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </Section>
  );
};

export default GistbinPage;
