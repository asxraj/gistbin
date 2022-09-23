import type { NextPage } from "next";
import Head from "next/head";
import Gistbin from "../components/Gistbin";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <div className="w-[70%] m-auto">
      <Head>
        <title>Gistbin</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Gistbin />
    </div>
  );
};

export default Home;
