import Head from "next/head";
import Gistbin from "../components/Gistbin";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import Section from "../components/Section";

export default function Home() {
  return (
    <Section>
      <Head>
        <title>Gistbin | Home</title>
        <meta name="description" content="Gistbin project made by asxraj" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Gistbin />
      {/* <Footer /> */}
    </Section>
  );
}
